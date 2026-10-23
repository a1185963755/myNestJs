import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { BCRYPT_ROUNDS } from './users.service';

/**
 * 首个管理员引导。
 *
 * 注册接口现在需要 admin / manager 权限，空库时没有任何账号可用。
 * 启动时若 user 表为空，自动创建一个 admin：
 *   - 设置了 ADMIN_PASSWORD 就用它
 *   - 否则生成随机密码并打印一次到日志
 */
@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.entityManager.count(UserEntity);
    if (count > 0) return;

    const username =
      this.configService.get<string>('ADMIN_USERNAME') || 'admin';
    const configuredPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const password = configuredPassword || randomBytes(9).toString('base64url');

    await this.entityManager.save(
      this.entityManager.create(UserEntity, {
        username,
        password: await bcrypt.hash(password, BCRYPT_ROUNDS),
        role: 'admin',
      }),
    );

    if (configuredPassword) {
      this.logger.log(
        `已创建初始管理员 ${username}（密码取自 ADMIN_PASSWORD）`,
      );
    } else {
      this.logger.warn(
        `已创建初始管理员 ${username}，随机密码：${password}（请立即登录后修改，或设置 ADMIN_PASSWORD 后重建）`,
      );
    }
  }
}
