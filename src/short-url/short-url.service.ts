import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { generateRandomStr } from 'src/common/utils/randomStr';
import { UniqueCode } from './entities/unique-code.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShortLongMap } from './entities/short-long-map.entity';

@Injectable()
export class ShortUrlService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  async generateCode(): Promise<any> {
    const str = generateRandomStr(6);
    const uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      code: str,
    });
    if (!uniqueCode) {
      const code = new UniqueCode();
      code.code = str;
      code.status = 0;

      return await this.entityManager.insert(UniqueCode, code);
    } else {
      return this.generateCode();
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async batchGenerateCode() {
    for (let i = 0; i < 10000; i++) {
      this.generateCode();
    }
  }

  async generateShortUrl(longUrl: string) {
    let uniqueCode = await this.entityManager.findOneBy(UniqueCode, {
      status: 0,
    });

    if (!uniqueCode) {
      uniqueCode = await this.generateCode();
    }
    const map = new ShortLongMap();
    map.shortUrl = uniqueCode!.code;
    map.longUrl = longUrl;

    await this.entityManager.insert(ShortLongMap, map);
    await this.entityManager.update(
      UniqueCode,
      {
        id: uniqueCode!.id,
      },
      {
        status: 1,
      },
    );
    return uniqueCode!.code;
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
    if (!map) {
      return null;
    }
    return map.longUrl;
  }
}
