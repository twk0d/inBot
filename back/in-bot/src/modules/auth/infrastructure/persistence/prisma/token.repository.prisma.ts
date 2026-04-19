import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { AccessToken } from '../../../domain/entities/access-token.entity';
import { ITokenRepository } from '../../../application/contracts/token-repository.contract';

@Injectable()
export class PrismaTokenRepository implements ITokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: any): AccessToken {
    return {
      id: model.id,
      token: model.token,
      userId: model.userId,
      expiresAt: model.expiresAt,
      revokedAt: model.revokedAt,
    };
  }

  async create(data: Omit<AccessToken, 'id'>): Promise<AccessToken> {
    const model = await this.prisma.accessToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
    return this.mapToDomain(model);
  }

  async findByToken(token: string): Promise<AccessToken | null> {
    const model = await this.prisma.accessToken.findUnique({ where: { token } });
    return model ? this.mapToDomain(model) : null;
  }

  async revoke(token: string): Promise<void> {
    await this.prisma.accessToken.update({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.accessToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
