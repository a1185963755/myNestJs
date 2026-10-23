import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService, BCRYPT_ROUNDS } from 'src/users/users.service';
import { RedisService } from 'src/redis/redis.service';
import type { JwtPayload } from 'src/common/types/auth.types';
import type { PublicUser } from 'src/users/users.service';

const BCRYPT_PATTERN = /^\$2[aby]\$\d{2}\$/;

@Injectable()
export class SsoService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(username: string, pwd: string): Promise<PublicUser> {
    const user = await this.usersService.findEntityByUsername(username);
    // 用户不存在与密码错误返回同一个错误，避免暴露账号是否注册
    if (!user || !(await this.verifyPassword(pwd, user.password, user.id))) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * 校验密码；对历史遗留的明文密码做一次透明升级。
   *
   * 老版本注册接口直接把明文写进 password 列，这里识别到非 bcrypt 格式时
   * 按明文比对，成功后立刻改写成 bcrypt 哈希，用户无感知。
   */
  private async verifyPassword(
    input: string,
    stored: string,
    userId: number,
  ): Promise<boolean> {
    if (BCRYPT_PATTERN.test(stored)) {
      return bcrypt.compare(input, stored);
    }
    if (input !== stored) return false;
    await this.usersService.upgradePasswordHash(
      userId,
      await bcrypt.hash(input, BCRYPT_ROUNDS),
    );
    return true;
  }

  async validateUserByEmail(email: string, code: string): Promise<PublicUser> {
    const redisCode = await this.redisService.get(`captcha_${email}`);
    if (!redisCode) {
      throw new UnauthorizedException('验证码已失效');
    }
    if (code !== redisCode) {
      throw new UnauthorizedException('验证码不正确');
    }
    // 验证码一次性使用，校验通过立刻删除，防止重放
    await this.redisService.del(`captcha_${email}`);
    return this.usersService.findUserByEmail(email);
  }

  login(user: PublicUser) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
