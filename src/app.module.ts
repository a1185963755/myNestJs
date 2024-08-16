import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { UploadModule } from './upload/upload.module';
import { SsoModule } from './sso/sso.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationFactory from './common/config/configuration.factory';
import { HttpModule } from '@nestjs/axios';
import { WeatherModule } from './weather/weather.module';
// import { WechatyModule } from './wechaty/wechaty.module';

@Module({
  imports: [
    UsersModule,
    UploadModule,
    SsoModule,
    ConfigModule.forRoot({
      load: [configurationFactory],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          timeout: config.get('HTTP_TIMEOUT'),
        };
      },
      inject: [ConfigService],
    }),
    WeatherModule,
    // WechatyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/users');
  }
}
