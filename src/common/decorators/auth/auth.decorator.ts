import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';

/**
 * 认证 + 角色鉴权装饰器。
 *
 *   @Auth()              只要求登录
 *   @Auth('admin')       要求登录且角色为 admin
 *
 * 注意：AuthGuard 必须排在 RoleGuard 前面，前者负责把 JWT 解析成 request.user。
 */
export const Auth = (...roles: string[]) =>
  applyDecorators(Roles(...roles), UseGuards(AuthGuard, RoleGuard));
