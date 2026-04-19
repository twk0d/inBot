import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { IContactRepository } from '../contracts/contact-repository.contract';
import type { IViaCepGateway } from '../contracts/viacep-gateway.contract';
import { CONTACT_REPOSITORY, VIACEP_GATEWAY } from '../contracts/tokens';
import { CreateContactCommand } from '../commands/create-contact.command';

@CommandHandler(CreateContactCommand)
export class CreateContactHandler implements ICommandHandler<CreateContactCommand> {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
    @Inject(VIACEP_GATEWAY)
    private readonly viaCepGateway: IViaCepGateway,
  ) {}

  async execute(command: CreateContactCommand) {
    const address = await this.viaCepGateway.getAddressByCep(command.address.cep);

    const contact = await this.contactRepository.create({
      userId: command.userId,
      name: command.name,
      email: command.email,
      phone: command.phone,
      address: {
        cep: address.cep,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        number: command.address.number,
        observation: command.address.observation,
      },
    });

    return contact;
  }
}
