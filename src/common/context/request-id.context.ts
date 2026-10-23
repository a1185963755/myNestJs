/**
 * 请求级上下文存储（基于 Node AsyncLocalStorage）。
 *
 * 作用：在一个 HTTP 请求"链路上"的任何位置（Service / Interceptor / Filter / Logger）
 * 都能拿到同一个 requestId，而不需要显式传参。
 *
 * 用法：
 *   requestContextStorage.run({ requestId }, () => next());
 *   // 链路任意位置：
 *   const id = getRequestId();
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  /** 当前请求的唯一 ID */
  requestId: string;
}

export const requestContextStorage =
  new AsyncLocalStorage<RequestContextStore>();

/** 在当前调用栈里取 requestId；不在请求上下文里时返回 undefined。 */
export function getRequestId(): string | undefined {
  return requestContextStorage.getStore()?.requestId;
}
