import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getme(@Req() req: Request) {
    const user = (req as any).user;
    return user;
  }
}
