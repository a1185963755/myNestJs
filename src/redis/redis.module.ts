import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const client = createClient({
          socket: {
            host: config.get<string>('REDIS.host'),
            port: config.get<number>('REDIS.port'),
          },
          password: config.get<string>('REDIS.password'),
        });
        client.on('error', (err) => {
          // 避免未监听 error 事件导致进程直接崩溃
          new Logger('Redis').error(err.message);
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
