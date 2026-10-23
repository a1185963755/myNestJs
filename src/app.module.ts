import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';
import { SsoModule } from './sso/sso.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationFactory from './common/config/configuration.factory';
import { HttpModule } from '@nestjs/axios';
import { WeatherModule } from './weather/weather.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './common/authorization/authorization.module';
import { join } from 'path';
import { BookModule } from './book/book.module';
import { MailModule } from './mail/mail.module';
import { RedisModule } from './redis/redis.module';
import { ArticleModule } from './article/article.module';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ShortUrlModule } from './short-url/short-url.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { SystemModule } from './system/system.module';
import { FeishuModule } from './feishu/feishu.module';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    // 配置模块放最前：后面所有 forRootAsync 都依赖它
    ConfigModule.forRoot({
      load: [configurationFactory],
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    // 全局 filter / interceptor / middleware 全部由 CommonModule 接管
    CommonModule,
    // 健康检查：/health 探针（MySQL / Redis / 内存），供 Docker HEALTHCHECK 使用
    HealthModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang', 'l']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang']),
        AcceptLanguageResolver,
      ],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB.host'),
        port: config.get<number>('DB.port'),
        username: config.get<string>('DB.username'),
        password: config.get<string>('DB.password'),
        database: config.get<string>('DB.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // 生产默认关闭，避免启动时自动改表结构
        synchronize: config.get<boolean>('DB.synchronize') ?? false,
      }),
    }),
    UsersModule,
    UploadModule,
    SsoModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        timeout: config.get<number>('HTTP_TIMEOUT'),
      }),
    }),
    WeatherModule,
    AuthorizationModule.register({
      modelPath: join(__dirname, './assets/casbin/model.conf'),
      policyAdapter: join(__dirname, './assets/casbin/policy.csv'),
      global: true,
    }),
    BookModule,
    MailModule,
    RedisModule,
    ArticleModule,
    TaskModule,
    ShortUrlModule,
    QrcodeModule,
    SystemModule,
    FeishuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
