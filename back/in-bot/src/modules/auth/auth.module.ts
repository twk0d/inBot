import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './web/auth.controller';
import { RegisterHandler } from './application/handlers/register.handler';
import { LoginHandler } from './application/handlers/login.handler';
import { LogoutHandler } from './application/handlers/logout.handler';
import { AUTH_REPOSITORY, TOKEN_REPOSITORY } from './application/contracts/tokens';
import { PrismaAuthRepository } from './infrastructure/persistence/prisma/auth.repository.prisma';
import { PrismaTokenRepository } from './infrastructure/persistence/prisma/token.repository.prisma';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';

const Handlers = [RegisterHandler, LoginHandler, LogoutHandler];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...Handlers,
    JwtStrategy,
    {
      provide: AUTH_REPOSITORY,
      useClass: PrismaAuthRepository,
    },
    {
      provide: TOKEN_REPOSITORY,
      useClass: PrismaTokenRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
