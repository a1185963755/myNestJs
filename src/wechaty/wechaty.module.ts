import { Module } from '@nestjs/common';
import { WechatyService } from './wechaty.service';
import { WechatyController } from './wechaty.controller';

@Module({
  controllers: [WechatyController],
  providers: [WechatyService],
})
export class WechatyModule {}
