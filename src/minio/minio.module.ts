import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';

export const MINIO_CLIENT = 'MINIO_CLIENT';

@Module({
  imports: [ConfigModule],
  controllers: [MinioController],
  providers: [
    MinioService,
    {
      provide: MINIO_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Minio.Client({
          endPoint: config.get<string>('MINIO.endPoint')!,
          port: config.get<number>('MINIO.port'),
          useSSL: config.get<boolean>('MINIO.useSSL'),
          accessKey: config.get<string>('MINIO.accessKey'),
          secretKey: config.get<string>('MINIO.secretKey'),
        }),
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
