import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginCommand } from '../commands/login.command';
import { AUTH_REPOSITORY, TOKEN_REPOSITORY } from '../contracts/tokens';
import type { IAuthRepository } from '../contracts/auth-repository.contract';
import type { ITokenRepository } from '../contracts/token-repository.contract';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginCommand) {
    const user = await this.authRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(command.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    // Store token for stateful revocation
    const decodedToken = this.jwtService.decode(token) as any;
    const expiresAt = new Date(decodedToken.exp * 1000);

    await this.tokenRepository.create({
      token,
      userId: user.id,
      expiresAt,
      revokedAt: null,
    });

    return { 
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    };
  }
}
