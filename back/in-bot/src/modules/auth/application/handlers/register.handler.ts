import { Inject, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcryptjs';
import { RegisterCommand } from '../commands/register.command';
import { AUTH_REPOSITORY } from '../contracts/tokens';
import type { IAuthRepository } from '../contracts/auth-repository.contract';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(command: RegisterCommand) {
    const existingUser = await this.authRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    const user = await this.authRepository.create({
      name: command.name,
      email: command.email,
      passwordHash,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }
}
