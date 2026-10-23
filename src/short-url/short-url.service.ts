import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateRandomStr } from 'src/common/utils/randomStr';
import { UniqueCode } from './entities/unique-code.entity';
import { ShortLongMap } from './entities/short-long-map.entity';

/** 每次批量补码的数量 */
const BATCH_SIZE = 10_000;
/** 单条 INSERT 的最大行数，避免 SQL 包体过大 */
const INSERT_CHUNK = 500;
/** 生成随机码时的最大重试次数 */
const MAX_CODE_RETRY = 10;

@Injectable()
export class ShortUrlService {
  private readonly logger = new Logger(ShortUrlService.name);

  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  /**
   * 生成一个未占用的短码并落库，返回入库后的实体。
   *
   * 之前返回的是 TypeORM 的 InsertResult，调用方拿 `.code` 是 undefined；
   * 并且用递归重试，撞码多了会有栈风险。这里改成循环 + 返回实体。
   */
  async generateCode(): Promise<UniqueCode> {
    for (let attempt = 0; attempt < MAX_CODE_RETRY; attempt++) {
      const str = generateRandomStr(6);
      const exists = await this.entityManager.findOneBy(UniqueCode, {
        code: str,
      });
      if (exists) continue;
      const code = this.entityManager.create(UniqueCode, {
        code: str,
        status: 0,
      });
      await this.entityManager.insert(UniqueCode, code);
      return code;
    }
    throw new Error('短码生成失败：连续多次撞码');
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async batchGenerateCode() {
    const rows: UniqueCode[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      rows.push(
        this.entityManager.create(UniqueCode, {
          code: generateRandomStr(6),
          status: 0,
        }),
      );
    }
    // 分批插入，避免一次 1 万行的单条 SQL 和 1 万次往返
    for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
      await this.entityManager.insert(
        UniqueCode,
        rows.slice(i, i + INSERT_CHUNK),
      );
    }
    this.logger.log(`短码池已补充 ${rows.length} 条`);
  }

  async generateShortUrl(longUrl: string) {
    const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      status: 0,
    });
    const code = uniqueCode ?? (await this.generateCode());

    await this.entityManager.transaction(async (manager) => {
      // 条件更新：只有仍是"未使用"才占用，避免并发下同一个码被发两次
      const result = await manager.update(
        UniqueCode,
        { id: code.id, status: 0 },
        { status: 1 },
      );
      if (result.affected === 0) {
        throw new Error('短码已被占用，请重试');
      }
      await manager.insert(ShortLongMap, {
        shortUrl: code.code,
        longUrl,
      });
    });

    return code.code;
  }

  /**
   * 根据短网址代码获取对应的长网址
   * @param code 短网址代码，用于查找对应的长网址
   * @returns 返回对应的长网址字符串，如果找不到则返回null
   */
  async getLongUrl(code: string) {
    const map = await this.entityManager.findOneBy(ShortLongMap, {
      shortUrl: code,
    });
    return map?.longUrl ?? null;
  }
}
