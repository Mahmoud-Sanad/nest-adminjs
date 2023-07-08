import { Module } from '@nestjs/common';
import { myGatway } from './gatway';

@Module({
  providers: [myGatway],
})
export class GatwayModule {}
