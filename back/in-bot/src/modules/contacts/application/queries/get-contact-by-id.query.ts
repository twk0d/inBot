export class GetContactByIdQuery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
