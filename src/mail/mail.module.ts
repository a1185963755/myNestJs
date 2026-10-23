import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [ConfigModule],
  controllers: [MailController],
  providers: [
    MailService,
    {
      provide: 'TRANSPORTER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        nodemailer.createTransport({
          host: configService.get<string>('MAIL.host'),
          port: configService.get<number>('MAIL.port'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL.user'),
            pass: configService.get<string>('MAIL.pass'),
          },
        }),
    },
  ],
})
export class MailModule {}
