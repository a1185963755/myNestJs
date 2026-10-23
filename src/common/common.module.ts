import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RequestLogInterceptor } from './interceptors/request-log.interceptor';
import { TransformIntercepter } from './interceptors/transform.interceptor';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id/request-id.middleware';

/**
 * 公共模块：集中注册"全局生效"的过滤器、拦截器、中间件。
 *
 * 只要在 AppModule 里 imports: [CommonModule]，
 * 下面这些 provider 就会自动以全局身份生效，无需在每个业务模块里重复声明。
 *
 * 注意：APP_FILTER / APP_INTERCEPTOR 是 Nest 内部常量 token，
 * 模块本身不需要把它们 export 出去 —— Nest 会自动识别并以全局身份应用。
 */
@Global()
@Module({
  providers: [
    // 1) 全局异常过滤器：把所有未处理异常统一格式化成 { errCode, errMsg, requestId, path, timestamp }
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 2) 请求日志拦截器：记录入站请求 / 出站响应 / 耗时（最先执行，方便观察链路）
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
    // 3) 响应包装拦截器：把 Controller 返回值统一包成 { code, data, msg, duration }
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformIntercepter,
    },
  ],
})
export class CommonModule implements NestModule {
  /**
   * 中间件注册。
   *
   * 执行顺序：RequestIdMiddleware 必须最先跑，
   * 它会生成/透传 requestId 并写入 AsyncLocalStorage，
   * 这样下游的拦截器（RequestLogInterceptor）和过滤器（HttpExceptionFilter）
   * 都能从 ALS 里拿到同一个 requestId，整条链路日志能串起来。
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('/users');
  }
}
