import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import * as Minio from 'minio';
export const MINIO_CLIENT = 'MINIO_CLIENT';
@Module({
  controllers: [MinioController],
  providers: [
    MinioService,
    {
      provide: MINIO_CLIENT,
      useFactory: async () => {
        const client = new Minio.Client({
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: '4aqWvpqC3EYWdAHgR8af',
          secretKey: 'WNuauSrDgi68zfmqGm3EbaQrn4nwSY4mwNLsguQ3',
        });
        return client;
      },
    },
  ],
  exports: [MINIO_CLIENT],
})
export class MinioModule {}
