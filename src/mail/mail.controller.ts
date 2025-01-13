import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() obj: MailOptions) {
    const res = await this.mailService.sendMail(obj);
    return res;
  }
}
