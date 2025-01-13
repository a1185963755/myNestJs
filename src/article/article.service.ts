import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  @Inject()
  private readonly redisService: RedisService;

  async findOne(id: number) {
    const article = await this.entityManager.findOne(Article, {
      where: {
        id,
      },
    });
    return article;
  }

  async viewOneArticle(id: number, userId: string) {
    const redisArticle = await this.redisService.hashGet(`article_${id}`);
    if (redisArticle.viewCount == undefined) {
      const article = await this.entityManager.findOne(Article, {
        where: {
          id,
        },
      });
      if (!article) {
        throw new HttpException('文章不存在', HttpStatus.OK);
      }
      const viewCount = article.viewCount + 1;
      article.viewCount = viewCount;
      await this.entityManager.update(Article, { id }, { viewCount });
      await this.redisService.hashSet(
        `article_${id}`,
        {
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          collectCount: article.collectCount,
        },
        10 * 60,
      );
      await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
      return viewCount;
    } else {
      const flag = await this.redisService.get(`user_${userId}_article_${id}`);
      if (flag) {
        return +redisArticle.viewCount;
      }
      const viewCount = +redisArticle.viewCount + 1;
      await this.redisService.hashSet(
        `article_${id}`,
        {
          ...redisArticle,
          viewCount,
        },
        10 * 60,
      );
      await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);
      return viewCount;
    }
  }
  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const res = await this.redisService.hashGet(key);

      const [, id] = key.split('_');

      await this.entityManager.update(
        Article,
        {
          id: +id,
        },
        {
          viewCount: +res.viewCount,
        },
      );
    }
  }
}
