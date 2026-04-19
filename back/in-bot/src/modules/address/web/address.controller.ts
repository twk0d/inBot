import { Controller, Get, Param } from '@nestjs/common';

@Controller('address')
export class AddressController {

    @Get('cep/:cep')
    getAddressByCep(@Param('cep') cep: string) { }

}