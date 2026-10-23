import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { RedisHealthIndicator } from './redis.health';

/**
 * 健康检查模块。
 *
 * TerminusModule 自动提供 HealthCheckService 及全部内置指标
 * （TypeOrmHealthIndicator / MemoryHealthIndicator 等）；
 * RedisHealthIndicator 是自定义指标，需在本模块声明为 provider。
 *
 * RedisService 来自全局的 RedisModule，这里无需再 import。
 */
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator],
})
export class HealthModule {}
