import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as qrcode from 'qrcode';
import { RedisService } from 'src/redis/redis.service';
import { QrCodeStatus } from './types';

@Injectable()
export class QrcodeService {
  @Inject()
  private readonly redisService: RedisService;
  async generateQrCode() {
    const uuid = randomUUID();
    const dataUrl = await qrcode.toDataURL(uuid, { errorCorrectionLevel: 'H' });
    return {
      qrcode_id: uuid,
      qrcode_url: dataUrl,
    };
  }

  async check(id: string) {
    const status = await this.redisService.get(`qrcode_${id}`);
    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired, // 如果redis中不存在，说明二维码已过期
        last_checked: new Date().toISOString(),
      };
    }

    return {
      qrcode_id: id,
      status, // 状态可以是 active, scanned, expired 等
      last_checked: new Date().toISOString(),
    };
  }
}
