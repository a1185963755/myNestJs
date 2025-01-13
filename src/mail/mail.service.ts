import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MailService {
  @Inject('TRANSPORTER')
  private readonly transporter: Transporter;

  @Inject()
  private redisService: RedisService;
  async sendMail(obj: MailOptions) {
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

  async sendCode(email: string) {
    try {
      const code = Math.random().toString().slice(2, 8);
      await this.redisService.set(`captcha_${email}`, code, 60 * 5);
      const info = await this.transporter.sendMail({
        to: email,
        from: '"ol" <1185963755@qq.com>',
        text: `【Oliver】你的验证码是：${code}`,
        subject: '验证码邮件',
      });
      return info.accepted;
    } catch (error) {
      console.log('🚀 ~ MailService ~ sendMail ~ error:', error);
    }
  }
}
