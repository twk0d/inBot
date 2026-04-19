import { Injectable, Inject, ServiceUnavailableException, Logger, NotFoundException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import CircuitBreaker = require('opossum');
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import type { IViaCepGateway } from '../../application/contracts/viacep-gateway.contract';

@Injectable()
export class ViaCepGateway implements IViaCepGateway {
  private readonly http: AxiosInstance;
  private readonly breaker: any; // Usando any para evitar conflito de tipo com CommonJS require
  private readonly logger = new Logger(ViaCepGateway.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('VIACEP_BASE_URL') || 'https://viacep.com.br/ws';
    
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
    });

    axiosRetry(this.http, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ? error.response.status >= 500 : false);
      },
    });

    const breakerOptions = {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      volumeThreshold: 5,
    };

    // No CommonJS, o opossum é exportado diretamente
    this.breaker = new (CircuitBreaker as any)(this.fetchFromViaCep.bind(this), breakerOptions);
    
    this.breaker.on('open', () => this.logger.warn('[ViaCEP] Circuit breaker OPEN'));
    this.breaker.on('halfOpen', () => this.logger.log('[ViaCEP] Circuit breaker HALF-OPEN'));
    this.breaker.on('close', () => this.logger.log('[ViaCEP] Circuit breaker CLOSED'));
  }

  private async fetchFromViaCep(cep: string) {
    try {
      const response = await this.http.get(`/${cep}/json`);
      
      if (!response.data || response.data.erro === true || response.data.erro === 'true') {
        return null;
      }

      return {
        cep: response.data.cep.replace('-', ''),
        street: response.data.logradouro || '',
        neighborhood: response.data.bairro || '',
        city: response.data.localidade || '',
        state: response.data.uf || '',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return null;
      }
      throw error;
    }
  }

  async getAddressByCep(cep: string) {
    const cleanCep = cep.replace('-', '');
    const cacheKey = `cep:${cleanCep}`;
    
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached as any;
    }

    try {
      const address = await this.breaker.fire(cleanCep);
      
      if (!address) {
        throw new NotFoundException(`Address not found for CEP: ${cep}`);
      }

      await this.cacheManager.set(cacheKey, address, 86400000);
      return address;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`[ViaCEP] Error fetching CEP ${cep}: ${error.message}`);
      throw new ServiceUnavailableException('ZIP code service temporarily unavailable');
    }
  }
}
