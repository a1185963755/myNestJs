import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  @Inject('TRANSPORTER')
  private readonly transporter: Transporter;

  @Inject()
  private redisService: RedisService;

  constructor(private readonly configService: ConfigService) {}

  async sendMail(obj: MailOptions) {
    return this.transporter.sendMail({
      from: this.configService.get<string>('MAIL.from'),
      ...obj,
    });
  }

  async sendCode(email: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${email}`, code, 60 * 5);
    const info = await this.transporter.sendMail({
      to: email,
      from: this.configService.get<string>('MAIL.from'),
      text: `【Oliver】你的验证码是：${code}`,
      subject: '验证码邮件',
    });
    this.logger.log(`验证码已发送至 ${email}`);
    return info.accepted;
  }
}
