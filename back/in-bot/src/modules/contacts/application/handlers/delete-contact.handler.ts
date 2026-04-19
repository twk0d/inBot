import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { IContactRepository } from '../contracts/contact-repository.contract';
import { CONTACT_REPOSITORY } from '../contracts/tokens';
import { DeleteContactCommand } from '../commands/delete-contact.command';

@CommandHandler(DeleteContactCommand)
export class DeleteContactHandler implements ICommandHandler<DeleteContactCommand> {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(command: DeleteContactCommand) {
    return this.contactRepository.delete(command.id, command.userId);
  }
}
