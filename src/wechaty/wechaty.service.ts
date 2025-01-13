import { Injectable, OnModuleInit } from '@nestjs/common';
import { WechatyBuilder, ScanStatus } from 'wechaty';
import { WechatyInterface } from 'wechaty/impls';
import qrTerm from 'qrcode-terminal';
@Injectable()
export class WechatyService implements OnModuleInit {
  private bot: WechatyInterface | null = null;
  onModuleInit() {
    this.bot = WechatyBuilder.build();
    // 监听机器人启动
    this.bot.on('scan', (qrcode, status) => {
      if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        qrTerm.generate(qrcode, { small: true }); // show qrcode on console

        const qrcodeImageUrl = [
          'https://wechaty.js.org/qrcode/',
          encodeURIComponent(qrcode),
        ].join('');

        console.info(
          'StarterBot',
          'onScan: %s(%s) - %s',
          ScanStatus[status],
          status,
          qrcodeImageUrl,
        );
      } else {
        console.info(
          'StarterBot',
          'onScan: %s(%s)',
          ScanStatus[status],
          status,
        );
      }
    });

    // 监听登录事件
    this.bot.on('login', async (user) => {
      console.log(`User ${user} logged in`);
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
    console.log('🚀 ~ WechatyService ~ onMessage ~ msg:', msg);
    const text = msg.text();
    const contact = msg.talker();

    // 指定关键字检测
    const keywords = ['关键字1', '关键字2'];

    if (keywords.some((keyword) => text.includes(keyword))) {
      await contact.say('检测到关键字！');
    }
  }
}
