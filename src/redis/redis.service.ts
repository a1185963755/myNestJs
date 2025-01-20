import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
  async get(key: string) {
    const value = await this.redisClient.get(key);
    return value;
  }

  async hashGet(key: string) {
    return await this.redisClient.hGetAll(key);
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.redisClient.hSet(key, name, obj[name]);
    }

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }
  /**
   * 设置键的过期时间
   * @param key Redis键名
   * @param ttl 过期时间（秒）
   */
  async expire(key: string, ttl: number) {
    return await this.redisClient.expire(key, ttl);
  }
}
