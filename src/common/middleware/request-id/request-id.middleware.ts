import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { requestContextStorage } from '../../context/request-id.context';

/** 响应头 / 入站请求头的字段名，统一大小写不敏感处理。 */
export const REQUEST_ID_HEADER = 'X-Request-Id';

/** 给 Express Request 补充上 requestId 字段，TS 友好。 */
export type RequestWithId = Request & { requestId: string };

/**
 * 全局请求 ID 中间件。
 *
 * 职责：
 *   1. 如果上游（网关 / Nginx / 前端）已经带了 X-Request-Id，沿用同一个 ID，便于跨服务串联日志。
 *   2. 否则用 Node 自带的 crypto.randomUUID() 生成一个。
 *   3. 写入 req.requestId，并设置到响应头 X-Request-Id。
 *   4. 把 requestId 放进 AsyncLocalStorage，下游任意位置（Service / Interceptor / Filter）都能拿到。
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: RequestWithId, res: Response, next: NextFunction): void {
    const incoming = req.headers[REQUEST_ID_HEADER.toLowerCase()];
    const requestId =
      typeof incoming === 'string' && incoming.trim().length > 0
        ? incoming.trim()
        : randomUUID();

    // 写入 req：业务代码可以直接 req.requestId 拿到
    req.requestId = requestId;
    // 写入响应头：客户端 / 网关可以通过这个头反查日志
    res.setHeader(REQUEST_ID_HEADER, requestId);

    // 用 ALS 把 requestId 传到下游整条链路
    requestContextStorage.run({ requestId }, () => next());
  }
}
