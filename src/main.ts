import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax' },
    }),
  );

  // CORS：origin '*' 与 credentials: true 不能共存（浏览器会直接拒绝）。
  // 配了 CORS_ORIGIN 就按白名单，否则开发环境反射请求来源。
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || '';
  app.enableCors({
    origin: corsOrigin
      ? corsOrigin.split(',').map((item) => item.trim())
      : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 全局异常过滤器由 CommonModule 通过 APP_FILTER 注册，这里不再重复注册，
  // 避免"先注册的过滤器吞掉后面 i18n 过滤器"的覆盖问题。
  app.useGlobalPipes(new I18nValidationPipe());

  app.useStaticAssets('uploads', { prefix: '/static' });

  const port = configService.get<number>('PORT') ?? 3333;
  app.enableShutdownHooks();
  await app.listen(port);
  new Logger('Bootstrap').log(`Application is running on: ${port}`);
}

bootstrap();
