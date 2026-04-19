import { Module } from '@nestjs/common';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';

@Module({
  imports: [AuthModule, ContactsModule, AddressModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
