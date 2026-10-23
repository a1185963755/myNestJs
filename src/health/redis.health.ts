import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { RedisService } from 'src/redis/redis.service';

/**
 * 自定义 Redis 健康指标。
 *
 * Terminus 没有内置 redis 客户端的指标，这里继承 HealthIndicator
 * 并复用全局 RedisModule 导出的 RedisService 做 ping 探活。
 */
@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   * ping Redis，超过 timeoutMs 未响应视为不健康，
   * 避免连接挂起时把探针（以及调用方）拖死。
   */
  private async pingWithTimeout(timeoutMs: number): Promise<string> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`Redis ping 超过 ${timeoutMs}ms 未响应`)),
        timeoutMs,
      );
    });
    try {
      // node-redis v4 的 ping() 正常时返回 'PONG'
      return await Promise.race([this.redisService.ping(), timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 健康检查入口，供 HealthCheckService 调度。
   * @param key 检查项名称，出现在报告里，如 'redis'
   */
  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const start = Date.now();
    let isHealthy = true;
    let error: string | undefined;

    try {
      await this.pingWithTimeout(2000);
    } catch (err) {
      isHealthy = false;
      error = err.message;
    }

    const result = this.getStatus(key, isHealthy, {
      responseTime: `${Date.now() - start}ms`,
      ...(error ? { error } : {}),
    });

    if (!isHealthy) {
      // 抛出后由 HealthCheckService 汇总，最终以 503 响应
      throw new HealthCheckError('Redis Health Check Failed', result);
    }
    return result;
  }
}
