import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';
import { AddressModule } from './modules/address/address.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { PrismaModule } from './shared/infrastructure/persistence/prisma/prisma.module';
import { HealthModule } from './shared/infrastructure/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get<string>('LOG_LEVEL') || 'info',
          redact: ['req.headers.authorization', 'req.body.password'],
          transport:
            config.get<string>('NODE_ENV') !== 'production'
              ? { target: 'pino-pretty', options: { colorize: true } }
              : undefined,
        },
      }),
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ContactsModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
