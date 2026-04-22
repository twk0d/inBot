import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAddressByCepQuery } from '../application/queries/get-address-by-cep.query';

@Controller('address')
export class AddressController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('cep/:cep')
  async getAddressByCep(@Param('cep') cep: string) {
    return this.queryBus.execute(new GetAddressByCepQuery(cep));
  }
}