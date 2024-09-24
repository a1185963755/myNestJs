import { DynamicModule, Global, Module } from '@nestjs/common';
import { MyLogger } from './Mylogger';
import { LoggerOptions } from 'winston';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';
@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN,
          useValue: new MyLogger(options),
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
