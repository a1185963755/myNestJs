import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class MailService {
  @Inject('TRANSPORTER')
  private readonly transporter: Transporter;
  async sendMail(obj: MailOptions) {
    console.log('🚀 ~ MailService ~ sendMail ~ obj:', obj);
    try {
      const info = await this.transporter.sendMail({
        from: '"ol" <1185963755@qq.com>',
        ...obj,
      });
      return info;
    } catch (error) {
      console.log('🚀 ~ MailService ~ sendMail ~ error:', error);
    }
  }
}
