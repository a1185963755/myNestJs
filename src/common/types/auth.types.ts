import type { Request } from 'express';

/** JWT 载荷：sub 为 user id（JWT 规范字段）。 */
export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

/** 校验通过后挂到 request.user 上的当前登录用户。 */
export interface AuthenticatedUser {
  userId: number;
  username: string;
  role: string;
}

export type AuthenticatedRequest = Request & { user?: AuthenticatedUser };
