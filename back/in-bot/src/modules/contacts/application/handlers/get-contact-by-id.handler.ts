import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { IContactRepository } from '../contracts/contact-repository.contract';
import { CONTACT_REPOSITORY } from '../contracts/tokens';
import { GetContactByIdQuery } from '../queries/get-contact-by-id.query';

@QueryHandler(GetContactByIdQuery)
export class GetContactByIdHandler implements IQueryHandler<GetContactByIdQuery> {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(query: GetContactByIdQuery) {
    return this.contactRepository.findById(query.id, query.userId);
  }
}
