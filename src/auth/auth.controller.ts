import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}
  @Post('send')
  send(@Req() req: Request) {
    return this.authservice.sendToZegoServer(req);
  }
  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authservice.register(dto);
  }
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authservice.login(dto);
  }
}
