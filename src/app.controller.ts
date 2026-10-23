import { Controller, Get, Query } from '@nestjs/common';
import pinyin from 'pinyin';

@Controller()
export class AppController {
  @Get('pinyin')
  getPinyin(@Query('text') text: string) {
    const res = pinyin(text ?? '', {
      style: pinyin.STYLE_NORMAL,
    });
    return res.join('');
  }
}
