import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';

/**
 * 健康检查端点（存活 + 就绪二合一）。
 *
 * 不挂 @Auth() 守卫 —— 探针必须匿名可达，
 * 否则 Docker/K8s 探测拿到 401/403 会误判服务不健康。
 *
 * 任一检查项失败时整体返回 503（由 @HealthCheck() 抛出
 * ServiceUnavailableException，HttpExceptionFilter 会保留状态码）。
 */
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // MySQL：对默认连接执行 SELECT 1（默认 1s 超时）
      () => this.db.pingCheck('database'),
      // Redis：自定义指标，2s 超时
      () => this.redis.pingCheck('redis'),
      // V8 堆内存超过 512MB 视为不健康
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      // 进程常驻内存超过 1GB 视为不健康
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
    ]);
  }
}
