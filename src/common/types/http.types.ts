import type { Request } from 'express';

/** 请求进入时由 RequestLogInterceptor 打点的时间戳，供响应包装拦截器算耗时。 */
export type TimedRequest = Request & { startTime?: number };
