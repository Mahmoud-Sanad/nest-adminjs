import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthDto } from './dto/auth.dto.js';
import { JwtGuard } from './guards/jwt.guard.js';
@UseGuards(JwtGuard)
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
