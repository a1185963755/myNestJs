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
import { TypeOrmModule } from '@nestjs/typeorm';
// import { WechatyModule } from './wechaty/wechaty.module';
import { AuthorizationModule } from './common/authorization/authorization.module';
import { join } from 'path';
import { BookModule } from './book/book.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'mydb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 自动加载实体
      synchronize: true, // 自动同步数据库（生产环境下建议关闭）
    }),
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
    AuthorizationModule.register({
      modelPath: join(__dirname, '../casbin/model.conf'),
      policyAdapter: join(__dirname, '../casbin/policy.csv'),
      global: true,
    }),
    BookModule,
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
