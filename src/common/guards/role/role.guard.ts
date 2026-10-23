import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from 'src/common/authorization';
import { ROLES_KEY } from 'src/common/decorators/roles/roles.decorator';
import type { AuthenticatedRequest } from 'src/common/types/auth.types';

/**
 * 角色守卫：必须配合 AuthGuard 使用（AuthGuard 负责解析 JWT 并写入 request.user）。
 *
 * 判定顺序：
 *   1. request.user 不存在 → 401（没登录）
 *   2. 路由/类上声明了 @Roles('admin', ...) → 用户角色必须在名单里，否则 403
 *   3. 交给 Casbin 做接口级鉴权（model.conf 的 g(r.sub, p.sub) 支持角色继承），
 *      没命中任何策略就拒绝 —— 默认拒绝。
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('未登录');
    }

    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('无权访问该资源');
    }

    // Nest 注册到 Express 的 route.path 已是完整路径，如 /users/:username
    const resource = request.route?.path ?? request.path;
    const action = this.authorizationService.mappingAction(request.method);
    const allowed = await this.authorizationService.checkPermission(
      `role:${user.role}`,
      resource,
      action,
    );
    if (!allowed) {
      throw new ForbiddenException('无权访问该资源');
    }
    return true;
  }
}
