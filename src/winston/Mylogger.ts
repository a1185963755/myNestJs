import { LoggerService } from '@nestjs/common';

import dayjs from 'dayjs';
import { createLogger, Logger, LoggerOptions } from 'winston';

export class MyLogger implements LoggerService {
  private logger: Logger;

  constructor(options: LoggerOptions) {
    this.logger = createLogger(options);
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY/MM/DD HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }

  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, time });
  }
}
