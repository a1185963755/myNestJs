import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

/**
 * JWT 认证守卫。
 *
 * 之前这里返回 `of(true)`，任何请求都会被放行，`@Auth()` 形同虚设。
 * 现在直接复用 passport-jwt 策略：请求头必须带 `Authorization: Bearer <token>`，
 * 校验通过后把 `{ userId, username, role }` 挂到 `request.user` 上，供 RoleGuard 使用。
 *
 * 依赖 SsoModule 里注册的 JwtStrategy（passport 策略是进程级注册的，
 * 只要 AppModule 引入了 SsoModule，其它模块即可直接使用）。
 */
@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {}
