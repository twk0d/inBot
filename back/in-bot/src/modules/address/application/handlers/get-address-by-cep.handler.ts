import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAddressByCepQuery } from '../queries/get-address-by-cep.query';
import { VIACEP_GATEWAY } from '../contracts/tokens';
import type { IViaCepGateway } from '../contracts/viacep-gateway.contract';

@QueryHandler(GetAddressByCepQuery)
export class GetAddressByCepHandler implements IQueryHandler<GetAddressByCepQuery> {
  constructor(
    @Inject(VIACEP_GATEWAY)
    private readonly viaCepGateway: IViaCepGateway,
  ) {}

  async execute(query: GetAddressByCepQuery) {
    return this.viaCepGateway.getAddressByCep(query.cep);
  }
}
