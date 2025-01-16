import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import pinyin from 'pinyin';
import { MINIO_CLIENT } from './minio/minio.module';
import * as Minio from 'minio';
@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {
    this.appService = this.moduleRef.get(AppService);
  }

  @Get('todos')
  async getTodos() {
    return this.appService.getTodos();
  }

  @Get('config')
  getConfig() {
    const username = this.configService.get('USERNAME');
    const port = this.configService.get('PORT');
    const timeout = this.configService.get('HTTP_TIMEOUT');
    return {
      username,
      port,
      timeout,
    };
  }

  @Get('pinyin')
  getPinyin(@Query('text') text: string) {
    const res = pinyin(text, {
      style: pinyin.STYLE_NORMAL,
    });
    return {
      result: res.join(''),
    };
  }

  @Inject(MINIO_CLIENT)
  private minioClient: Minio.Client;

  @Get('test')
  async test() {
    try {
      await this.minioClient.fPutObject('aaa', 'hello.json', './package.json');
      return 'http://localhost:9000/aaa/hello.json';
    } catch (e) {
      console.log(e);
      return '上传失败';
    }
  }

  @Get('presignedUrl')
  async presignedUrl(@Query('name') name: string) {
    return this.minioClient.presignedPutObject('aaa', name, 3600);
  }
}
