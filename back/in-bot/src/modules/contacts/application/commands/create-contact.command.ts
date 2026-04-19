export class CreateContactCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: {
      cep: string;
      street: string;
      neighborhood: string;
      city: string;
      state: string;
      number: number;
      observation?: string;
    },
  ) {}
}
