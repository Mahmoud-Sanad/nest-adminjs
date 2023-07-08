import { Injectable, Req, ForbiddenException, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

import axios from 'axios';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  getZegoSignature(appId, SignatureNonce, serverSecret, timestamp) {
    const hash = crypto.createHash('md5');
    const str = appId + SignatureNonce + serverSecret + timestamp;
    hash.update(str);
    return hash.digest('hex');
  }
  async sendToZegoServer(request: Request) {
    const RoomId = request.body.RoomId;
    const userId = request.body.userId;
    const AppId = 918272161;
    const serverSecret = '52c2b55f2793f65e66a0b204e67767f8';
    const timeStamp = Math.round(Date.now() / 1000);
    const randomBytes = (length) => {
      const randomUuid = uuidv4();
      return randomUuid.replace(/-/g, '').substr(0, length * 2);
    };

    const SignatureNonce = randomBytes(8);
    const Signature = this.getZegoSignature(
      AppId,
      SignatureNonce,
      serverSecret,
      timeStamp,
    );
    console.log(Signature);

    const url =
      'https://zim-api.zego.im/?Action=SendRoomMessage&AppId=' +
      AppId +
      '&Timestamp=' +
      timeStamp +
      '&Signature=' +
      Signature +
      '&SignatureVersion=2.0&SignatureNonce=' +
      SignatureNonce;
    console.log(url);
    try {
      const response: any = await axios({
        url: url,
        method: 'POST',
        data: {
          FromUserId: userId,
          RoomId: RoomId,
          MessageType: 2,
          Priority: 3,
          MessageBody: {
            Message: 'hello world',
            ExtendedData: 'd',
          },
        },
        // responseEncoding: 'utf-8',
        // responseType:'json',
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return error;
    }
  }
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
