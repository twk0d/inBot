import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ContactsController } from './web/contacts.controller';
import { CreateContactHandler } from './application/handlers/create-contact.handler';
import { UpdateContactHandler } from './application/handlers/update-contact.handler';
import { DeleteContactHandler } from './application/handlers/delete-contact.handler';
import { GetContactsHandler } from './application/handlers/get-contacts.handler';
import { GetContactByIdHandler } from './application/handlers/get-contact-by-id.handler';
import { CONTACT_REPOSITORY, VIACEP_GATEWAY } from './application/contracts/tokens';
import { PrismaContactRepository } from './infrastructure/persistence/prisma/contact.repository.prisma';
import { ViaCepGateway } from '../../shared/infrastructure/external/viacep.adapter';

const Handlers = [
  CreateContactHandler,
  UpdateContactHandler,
  DeleteContactHandler,
  GetContactsHandler,
  GetContactByIdHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [ContactsController],
  providers: [
    ...Handlers,
    {
      provide: CONTACT_REPOSITORY,
      useClass: PrismaContactRepository,
    },
    {
      provide: VIACEP_GATEWAY,
      useClass: ViaCepGateway,
    },
  ],
})
export class ContactsModule {}