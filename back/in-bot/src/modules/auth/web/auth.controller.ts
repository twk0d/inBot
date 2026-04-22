import { Body, Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterCommand } from '../application/commands/register.command';
import { LoginCommand } from '../application/commands/login.command';
import { LogoutCommand } from '../application/commands/logout.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.commandBus.execute(
      new RegisterCommand(dto.name, dto.email, dto.password),
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.commandBus.execute(
      new LoginCommand(dto.email, dto.password),
    );
  }

  @Post('logout')
  async logout(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }
    const token = authHeader.split(' ')[1];
    return this.commandBus.execute(new LogoutCommand(token));
  }
}