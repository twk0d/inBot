export interface IViaCepGateway {
  getAddressByCep(cep: string): Promise<{
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }>;
}
