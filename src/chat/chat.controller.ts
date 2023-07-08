import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatService } from './chat.service';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Post('create')
  createChat(@Req() request: Request) {
    this.chatService.createChat(request);
  }
}
