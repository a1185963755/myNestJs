import { Module } from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { ShortUrlController } from './short-url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueCode } from './entities/unique-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniqueCode])],
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
})
export class ShortUrlModule {}
