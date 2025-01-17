import { Controller, Get, Inject, Param, Headers } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { RedisService } from 'src/redis/redis.service';
import { QrCodeStatus } from './types';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}
  @Inject()
  private readonly redisService: RedisService;
  @Get('generate')
  async generate() {
    const data = await this.qrcodeService.generateQrCode();
    await this.redisService.set(
      `qrcode_${data.qrcode_id}`,
      QrCodeStatus.noscan,
      5 * 60,
    );
    return data;
  }

  @Get('status/:id')
  async checkStatus(@Param('id') id: string) {
    return await this.qrcodeService.check(id);
  }
  @Get('scan/:id')
  async scanQrCode(@Param('id') id: string) {
    const status = await this.redisService.get(`qrcode_${id}`);

    // 检查二维码是否存在
    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    // 检查二维码状态是否允许扫描
    if (status !== QrCodeStatus.noscan) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许扫描',
      };
    }

    // 更新二维码状态为等待确认
    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_wait_confirm,
      5 * 60, // 保持5分钟有效期
    );

    return {
      qrcode_id: id,
      status: QrCodeStatus.scan_wait_confirm,
      message: '请确认登录',
    };
  }
  @Get('confirm/:id')
  async confirmQrCode(
    @Param('id') id: string,
    @Headers('Authorization') auth: string,
  ) {
    console.log(auth);
    const status = await this.redisService.get(`qrcode_${id}`);

    // 检查二维码是否存在
    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    // 检查二维码状态是否允许确认
    if (status !== QrCodeStatus.scan_wait_confirm) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许确认',
      };
    }

    // 更新二维码状态为已确认
    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_confirm,
      5 * 60, // 保持5分钟有效期
    );

    return {
      qrcode_id: id,
      status: QrCodeStatus.scan_confirm,
      message: '登录成功',
    };
  }
  @Get('cancel/:id')
  async cancelQrCode(@Param('id') id: string) {
    const status = await this.redisService.get(`qrcode_${id}`);

    // 检查二维码是否存在
    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    // 检查二维码状态是否允许取消
    if (status !== QrCodeStatus.scan_wait_confirm) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许取消',
      };
    }

    // 更新二维码状态为已取消
    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_cancel,
      5 * 60, // 保持5分钟有效期
    );

    return {
      qrcode_id: id,
      status: QrCodeStatus.scan_cancel,
      message: '扫码已取消',
    };
  }
}
