import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 配置 CORS
  app.enableCors({
    origin: '*', // 允许的来源，可以设置为具体的前端地址
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 允许携带凭证（如 cookies）
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  app.enableShutdownHooks();
  await app.listen(port);
}
bootstrap();
