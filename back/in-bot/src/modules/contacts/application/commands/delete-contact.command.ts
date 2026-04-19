export class DeleteContactCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
