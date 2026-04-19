import { User } from '../../domain/entities/user.entity';

export interface IAuthRepository {
  create(data: Omit<User, 'id'>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
