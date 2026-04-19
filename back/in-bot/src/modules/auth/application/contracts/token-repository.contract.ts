import { AccessToken } from '../../domain/entities/access-token.entity';

export interface ITokenRepository {
  create(data: Omit<AccessToken, 'id'>): Promise<AccessToken>;
  findByToken(token: string): Promise<AccessToken | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
