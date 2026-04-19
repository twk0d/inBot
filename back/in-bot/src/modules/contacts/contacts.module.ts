import { Module } from '@nestjs/common';
import { ContactsController } from './web/contacts.controller';

@Module({
    controllers: [ContactsController],
})
export class ContactsModule { }