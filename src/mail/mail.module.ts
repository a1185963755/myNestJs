import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MailController],
  providers: [
    MailService,
    {
      provide: 'TRANSPORTER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get('MAIL_USER');
        const pass = configService.get('MAIL_PASS');
        const transporter = nodemailer.createTransport({
          host: 'smtp.qq.com',
          port: 587,
          secure: false,
          auth: {
            user,
            pass,
          },
        });
        return transporter;
      },
    },
  ],
})
export class MailModule {}
