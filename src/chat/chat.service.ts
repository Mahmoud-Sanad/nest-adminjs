import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async createChat(request: Request) {
    const users = request.body.members.map((userId) => ({ id: userId }));
    const chat = await this.prisma.chat.create({
      data: {
        participants: {
          connect: users,
        },
      },
    });
    return {
      chat,
    };
  }
}
