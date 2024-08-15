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

  @Get('todos')
  getTodos() {
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
}
