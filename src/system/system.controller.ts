import { Controller, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { Auth } from 'src/common/decorators/auth/auth.decorator';

/**
 * 系统信息（CPU / 内存 / 磁盘）暴露主机细节，之前完全匿名。
 * 现在只允许管理员查看。
 */
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Auth('admin')
  @Get('status')
  getStatus() {
    return this.systemService.getStatus();
  }
}
