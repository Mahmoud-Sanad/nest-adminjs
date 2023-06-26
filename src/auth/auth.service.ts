import { Injectable, Req, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async login(dto: AuthDto) {
    console.log(dto);

    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    console.log(user);

    if (!user || !(await argon.verify(user.hash, dto.password))) {
      throw new ForbiddenException('Wrong Data Sent ');
    }

    delete user.hash;
    const token = await this.signToken(user.id, user.email);
    return { token };
  }
  async register(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          username: dto.username,
        },
      });
      delete user.hash;
      const token = await this.signToken(user.id, user.email);
      return { token };
    } catch (error) {
      throw error;
    }
  }
  async signToken(userId: number, email: string) {
    const data = {
      sub: userId,
      email,
    };
    return this.jwt.signAsync(data, { secret: 'secret' });
  }
}
