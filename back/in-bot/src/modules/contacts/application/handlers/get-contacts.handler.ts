import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { IContactRepository } from '../contracts/contact-repository.contract';
import { CONTACT_REPOSITORY } from '../contracts/tokens';
import { GetContactsQuery } from '../queries/get-contacts.query';

@QueryHandler(GetContactsQuery)
export class GetContactsHandler implements IQueryHandler<GetContactsQuery> {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(query: GetContactsQuery) {
    return this.contactRepository.findAll(query.userId);
  }
}
