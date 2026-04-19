import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { IContactRepository } from '../contracts/contact-repository.contract';
import { CONTACT_REPOSITORY } from '../contracts/tokens';
import { UpdateContactCommand } from '../commands/update-contact.command';

@CommandHandler(UpdateContactCommand)
export class UpdateContactHandler implements ICommandHandler<UpdateContactCommand> {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(command: UpdateContactCommand) {
    return this.contactRepository.update(command.id, command.userId, {
      name: command.name,
      email: command.email,
      phone: command.phone,
      address: command.address,
    });
  }
}
