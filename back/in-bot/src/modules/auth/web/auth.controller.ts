import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {

    @Post('register')
    register(@Body() dto: RegisterDto) { }

    @Post('login')
    login(@Body() dto: LoginDto) { }

    @Post('logout')
    logout() { }

}