import { Module } from '@nestjs/common';
import { AddressController } from './web/address.controller';

@Module({
    controllers: [AddressController],
})
export class AddressModule { }