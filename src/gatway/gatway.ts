/* eslint-disable prettier/prettier */
import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class myGatway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log(socket.id);
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.to(body.chat).emit('onMessage', {
      content: body.message,
      chat: body.chat,
    });
  }

  @SubscribeMessage('joinChat')
  onJoinChat(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    socket.join(body.chat);
  }
  @SubscribeMessage('joinChats')
  onJoinChats(@MessageBody() body: any, @ConnectedSocket() socket: Socket) {
    console.log(body);
    body.chats.forEach((chat) => {
      socket.join(chat);
    });
    return 'joined success';
  }
}
