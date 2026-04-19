export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    number: number;
    observation?: string;
  };
}
