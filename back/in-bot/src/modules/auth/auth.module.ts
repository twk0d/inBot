import { Module } from '@nestjs/common';
import { AuthController } from './web/auth.controller';

@Module({
    controllers: [AuthController],
})
export class AuthModule { }
