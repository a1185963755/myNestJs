import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UploadModule } from './upload/upload.module';
import { SsoModule } from './sso/sso.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configurationFactory from './common/config/configuration.factory';

@Module({
  imports: [
    UsersModule,
    UploadModule,
    SsoModule,
    ConfigModule.forRoot({
      load: [configurationFactory],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/users');
  }
}
