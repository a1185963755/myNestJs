import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { QrcodeService } from './qrcode.service';
import { RedisService } from 'src/redis/redis.service';
import { QrCodeStatus } from './types';
import type { AuthenticatedRequest } from 'src/common/types/auth.types';

/** 二维码状态在 Redis 中的存活时间（秒） */
const QRCODE_TTL = 5 * 60;
/** 确认后记录扫码用户的 key 存活时间（秒） */
const QRCODE_USER_TTL = 5 * 60;

@Controller('qrcode')
export class QrcodeController {
  constructor(
    private readonly qrcodeService: QrcodeService,
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {}

  @Get('generate')
  async generate() {
    const data = await this.qrcodeService.generateQrCode();
    await this.redisService.set(
      `qrcode_${data.qrcode_id}`,
      QrCodeStatus.noscan,
      QRCODE_TTL,
    );
    return data;
  }

  @Get('status/:id')
  async checkStatus(@Param('id') id: string) {
    const status = await this.qrcodeService.check(id);
    if (status.status === QrCodeStatus.scan_confirm) {
      const userId = await this.redisService.get(`qrcode_user_${id}`);
      return { ...status, userId: userId ? Number(userId) : undefined };
    }
    return status;
  }

  @Get('scan/:id')
  async scanQrCode(@Param('id') id: string) {
    const status = await this.redisService.get(`qrcode_${id}`);

    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    if (status !== QrCodeStatus.noscan) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许扫描',
      };
    }

    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_wait_confirm,
      QRCODE_TTL,
    );

    return {
      qrcode_id: id,
      status: QrCodeStatus.scan_wait_confirm,
      message: '请确认登录',
    };
  }

  /**
   * 确认登录：必须携带有效 JWT。
   *
   * 之前这里只读 Authorization 头打印一下就放行，等于任何人都能确认任意二维码。
   * 现在由 AuthGuard 校验 token，并把登录用户记到 qrcode_user_{id}。
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('confirm/:id')
  async confirmQrCode(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const status = await this.redisService.get(`qrcode_${id}`);

    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    if (status !== QrCodeStatus.scan_wait_confirm) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许确认',
      };
    }

    // 记录确认人，并保留状态一段时间供前端轮询到 scan-confirm
    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_confirm,
      QRCODE_TTL,
    );
    await this.redisService.set(
      `qrcode_user_${id}`,
      String(req.user!.userId),
      QRCODE_USER_TTL,
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

    if (!status) {
      return {
        qrcode_id: id,
        status: QrCodeStatus.expired,
        message: '二维码已过期',
      };
    }

    if (status !== QrCodeStatus.scan_wait_confirm) {
      return {
        qrcode_id: id,
        status,
        message: '二维码状态不允许取消',
      };
    }

    await this.redisService.set(
      `qrcode_${id}`,
      QrCodeStatus.scan_cancel,
      QRCODE_TTL,
    );

    return {
      qrcode_id: id,
      status: QrCodeStatus.scan_cancel,
      message: '扫码已取消',
    };
  }
}
