import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressController } from './web/address.controller';
import { GetAddressByCepHandler } from './application/handlers/get-address-by-cep.handler';
import { VIACEP_GATEWAY } from './application/contracts/tokens';
import { ViaCepGateway } from '../../shared/infrastructure/external/viacep.adapter';

@Module({
  imports: [CqrsModule],
  controllers: [AddressController],
  providers: [
    GetAddressByCepHandler,
    {
      provide: VIACEP_GATEWAY,
      useClass: ViaCepGateway,
    },
  ],
})
export class AddressModule {}