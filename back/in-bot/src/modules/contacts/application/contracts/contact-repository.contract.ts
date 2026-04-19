import type { Contact } from '../../domain/entities/contact.entity';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface IContactRepository {
  create(data: Omit<Contact, 'id'> & { userId: string }): Promise<Contact>;
  findAll(userId: string): Promise<Contact[]>;
  findById(id: string, userId: string): Promise<Contact | null>;
  update(id: string, userId: string, data: DeepPartial<Omit<Contact, 'id'>>): Promise<Contact>;
  delete(id: string, userId: string): Promise<void>;
}
