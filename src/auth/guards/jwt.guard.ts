/* eslint-disable prettier/prettier */
/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
