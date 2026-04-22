export interface Address {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address & {
    number: number;
    observation?: string;
  };
}
