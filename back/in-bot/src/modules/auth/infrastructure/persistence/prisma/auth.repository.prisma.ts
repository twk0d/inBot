import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { User } from '../../../domain/entities/user.entity';
import { IAuthRepository } from '../../../application/contracts/auth-repository.contract';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: any): User {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
      passwordHash: model.password,
    };
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const model = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
      },
    });
    return this.mapToDomain(model);
  }

  async findByEmail(email: string): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { email } });
    return model ? this.mapToDomain(model) : null;
  }

  async findById(id: string): Promise<User | null> {
    const model = await this.prisma.user.findUnique({ where: { id } });
    return model ? this.mapToDomain(model) : null;
  }
}
