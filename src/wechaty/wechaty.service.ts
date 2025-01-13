import { Injectable, OnModuleInit } from '@nestjs/common';
import { WechatyBuilder } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';

@Injectable()
export class WechatyService implements OnModuleInit {
  private bot: WechatyInterface | null = null;
  onModuleInit() {
    this.bot = WechatyBuilder.build();
    // 监听机器人启动
    this.bot.on('scan', (qrcode, status) => {
      console.log('🚀 ~ WechatyService ~ this.bot.on ~ qrcode:', qrcode);
      console.log(
        `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`,
      );
    });

    // 监听登录事件
    this.bot.on('login', async (user) => {
      console.log(`User ${user} logged in`);
      const contactList = await this.bot?.Contact.findAll();
      console.log(
        '🚀 ~ WechatyService ~ this.bot.on ~ contactList:',
        contactList,
      );
    });

    // 监听消息事件
    this.bot.on('message', this.onMessage.bind(this));

    // 启动机器人
    this.bot.start().catch(console.error);
    this.bot.on('stop', () => {
      console.log('机器人已停止运行');
    });
  }

  private async onMessage(msg: any) {
    const text = msg.text();
    const contact = msg.talker();

    // 指定关键字检测
    const keywords = ['关键字1', '关键字2'];

    if (keywords.some((keyword) => text.includes(keyword))) {
      await contact.say('检测到关键字！');
    }
  }
}
