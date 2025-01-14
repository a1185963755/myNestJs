import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { CreateShortUrlDto } from './dto/create-short-url.dto';
import { SkipGlobalInterceptor } from 'src/common/decorators/skip-global.decorator';

@Controller('short-url')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  @Get()
  findAll() {
    return this.shortUrlService.generateCode();
  }
  @Get(':code')
  @Redirect()
  @SkipGlobalInterceptor()
  async jump(@Param('code') code: string) {
    const longUrl = await this.shortUrlService.getLongUrl(code);
    if (!longUrl) {
      throw new BadRequestException('短链不存在');
    }
    return {
      url: longUrl,
      statusCode: 302,
    };
  }

  @Post('generate')
  async create(@Body() body: CreateShortUrlDto) {
    const { url } = body;
    return await this.shortUrlService.generateShortUrl(url);
  }
}
