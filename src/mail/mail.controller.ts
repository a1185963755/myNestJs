import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MailService } from './mail.service';
import { Auth } from 'src/common/decorators/auth/auth.decorator';

class SendCodeDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty()
  email: string;
}

class SendMailDto {
  @IsEmail({}, { message: '收件人邮箱格式不正确' })
  to: string;

  @IsString()
  @IsNotEmpty({ message: '主题不能为空' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: '正文不能为空' })
  text: string;

  @IsOptional()
  @IsString()
  html?: string;
}

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  /**
   * 发验证码：登录前就要用，所以保持匿名可访问。
   * 之前没有校验 body，任意字符串都会被当成邮箱塞进 Redis。
   */
  @Post('code')
  async sendCode(@Body() body: SendCodeDto) {
    return this.mailService.sendCode(body.email);
  }

  /**
   * 任意邮件发送：之前完全匿名，任何人都能把本服务当开放中继发垃圾邮件。
   * 现在只允许管理员调用。
   */
  @Auth('admin')
  @Post('send')
  async sendMail(@Body() body: SendMailDto) {
    return this.mailService.sendMail({
      to: body.to,
      subject: body.subject,
      text: body.text,
      html: body.html,
    });
  }
}
