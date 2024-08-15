import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';

@Controller()
export class AppController {
  private readonly appService: AppService;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {
    this.appService = this.moduleRef.get(AppService);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    const username = this.configService.get('USERNAME');
    const port = this.configService.get('PORT');
    return {
      username,
      port,
    };
  }
}
