import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../shared/infrastructure/persistence/prisma/prisma.service';
import { Contact } from '../../../domain/entities/contact.entity';
import { IContactRepository } from '../../../application/contracts/contact-repository.contract';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaContactRepository implements IContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: any): Contact {
    return {
      id: model.id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      address: {
        cep: model.cep,
        street: model.street,
        neighborhood: model.neighborhood,
        city: model.city,
        state: model.state,
        number: model.number,
        observation: model.observation || undefined,
      },
    };
  }

  async create(data: Omit<Contact, 'id'> & { userId: string }): Promise<Contact> {
    try {
      const model = await this.prisma.contact.create({
        data: {
          userId: data.userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          cep: data.address.cep,
          street: data.address.street,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          number: data.address.number,
          observation: data.address.observation,
        },
      });
      return this.mapToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('You already have a contact with this email');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Contact[]> {
    const models = await this.prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return models.map((m) => this.mapToDomain(m));
  }

  async findById(id: string, userId: string): Promise<Contact | null> {
    const model = await this.prisma.contact.findFirst({
      where: { id, userId },
    });
    return model ? this.mapToDomain(model) : null;
  }

  async update(id: string, userId: string, data: any): Promise<Contact> {
    try {
      // First check ownership
      const existing = await this.findById(id, userId);
      if (!existing) throw new NotFoundException('Contact not found');

      const model = await this.prisma.contact.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          cep: data.address?.cep,
          street: data.address?.street,
          neighborhood: data.address?.neighborhood,
          city: data.address?.city,
          state: data.address?.state,
          number: data.address?.number,
          observation: data.address?.observation,
        },
      });
      return this.mapToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('You already have another contact with this email');
      }
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const existing = await this.findById(id, userId);
    if (!existing) throw new NotFoundException('Contact not found');

    await this.prisma.contact.delete({ where: { id } });
  }
}
