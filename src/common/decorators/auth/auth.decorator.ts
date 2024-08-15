import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
// 整合了角色metadata和认证guard与角色guard的装饰器
export const Auth = (...roles: string[]) =>
  applyDecorators(Roles(...roles), UseGuards(AuthGuard, RoleGuard));
