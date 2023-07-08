import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authservice.register(dto);
  }
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authservice.login(dto);
  }
}
