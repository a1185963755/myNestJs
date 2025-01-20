import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { ClassValidatePipe } from 'src/pipes/parse-int/class-validate.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    session({
      secret: 'oliver',
      resave: false,
      saveUninitialized: false,
    }),
  );
  // 配置 CORS
  app.enableCors({
    origin: '*', // 允许的来源，可以设置为具体的前端地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 允许携带凭证（如 cookies）
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalPipes(new ClassValidatePipe());
  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.useStaticAssets('uploads', { prefix: '/static' });

  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap();
