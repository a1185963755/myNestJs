import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ClassValidatePipe } from 'src/pipes/parse-int/class-validate.pipe';
import { TransformIntercepter } from './common/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
  app.useGlobalPipes(new ClassValidatePipe());
  app.useGlobalInterceptors(new TransformIntercepter());
  app.useStaticAssets('uploads', { prefix: '/static' });
  await app.listen(port);
}
bootstrap();
