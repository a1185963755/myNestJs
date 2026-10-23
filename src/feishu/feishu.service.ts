import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import axios from 'axios';

interface FeishuMessage {
  msg_type: string;
  content?: unknown;
  card?: unknown;
}

@Injectable()
export class FeishuService {
  private readonly logger = new Logger(FeishuService.name);

  constructor(private readonly configService: ConfigService) {}

  private get webhookUrl(): string {
    return this.configService.get<string>('FEISHU_WEBHOOK_URL') || '';
  }

  private get secret(): string {
    return this.configService.get<string>('FEISHU_SECRET') || '';
  }

  /**
   * 统一发送入口：配置了 FEISHU_SECRET 时按官方算法附加 timestamp + sign，
   * 否则直接发送。之前 secret 读出来从未使用，开启签名校验的机器人会一直 403。
   */
  private async send(payload: FeishuMessage): Promise<boolean> {
    if (!this.webhookUrl) {
      this.logger.warn('飞书 Webhook 未配置，跳过发送');
      return false;
    }
    const body: FeishuMessage & { timestamp?: string; sign?: string } = {
      ...payload,
    };
    if (this.secret) {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      body.timestamp = timestamp;
      body.sign = createHmac('sha256', `${timestamp}\n${this.secret}`)
        .update('')
        .digest('base64');
    }
    try {
      await axios.post(this.webhookUrl, body, { timeout: 5000 });
      return true;
    } catch (error) {
      this.logger.error(
        `飞书消息发送失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  }

  /** 发送文本消息 */
  sendText(content: string): Promise<boolean> {
    return this.send({ msg_type: 'text', content: { text: content } });
  }

  /** 发送富文本消息（post 类型） */
  sendPost(post: {
    zh_cn: {
      title: string;
      content: Array<Array<{ tag: string; text?: string; href?: string }>>;
    };
  }): Promise<boolean> {
    return this.send({ msg_type: 'post', content: post });
  }

  /** 发送互动卡片消息 */
  sendCard(card: {
    header?: {
      title: { tag: string; content: string };
      template?: string;
    };
    elements: Array<{
      tag: string;
      text?: { content: string; tag: string };
      actions?: Array<{
        tag: string;
        text?: { content: string; tag: string };
        type?: string;
        url?: string;
      }>;
    }>;
  }): Promise<boolean> {
    return this.send({ msg_type: 'interactive', card });
  }
}
