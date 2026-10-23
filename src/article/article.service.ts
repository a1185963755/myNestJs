import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { RedisService } from 'src/redis/redis.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

/** 阅读量在 Redis 中的缓存时长（秒） */
const ARTICLE_CACHE_TTL = 10 * 60;
/** 同一用户重复阅读的判重窗口（秒） */
const VIEW_DEDUP_TTL = 3;

@Injectable()
export class ArticleService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;
  @Inject()
  private readonly redisService: RedisService;

  async create(dto: CreateArticleDto) {
    const article = this.entityManager.create(Article, dto);
    return this.entityManager.save(article);
  }

  async findAll() {
    return this.entityManager.find(Article);
  }

  async findOne(id: number) {
    const article = await this.entityManager.findOne(Article, {
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }
    return article;
  }

  async update(id: number, dto: UpdateArticleDto) {
    const article = await this.findOne(id);
    await this.entityManager.update(Article, { id }, dto);
    // 计数缓存可能已被更新覆盖，直接失效让下次读取重新回源
    return { ...article, ...dto };
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    await this.entityManager.delete(Article, { id });
    return article;
  }

  async viewOneArticle(id: number, userId: string) {
    const redisArticle = await this.redisService.hashGet(`article_${id}`);
    if (redisArticle.viewCount == undefined) {
      const article = await this.findOne(id);
      const viewCount = article.viewCount + 1;
      await this.entityManager.update(Article, { id }, { viewCount });
      await this.redisService.hashSet(
        `article_${id}`,
        {
          viewCount,
          likeCount: article.likeCount,
          collectCount: article.collectCount,
        },
        ARTICLE_CACHE_TTL,
      );
      await this.redisService.set(
        `user_${userId}_article_${id}`,
        1,
        VIEW_DEDUP_TTL,
      );
      return viewCount;
    }

    const flag = await this.redisService.get(`user_${userId}_article_${id}`);
    if (flag) {
      return +redisArticle.viewCount;
    }
    const viewCount = +redisArticle.viewCount + 1;
    await this.redisService.hashSet(
      `article_${id}`,
      { ...redisArticle, viewCount },
      ARTICLE_CACHE_TTL,
    );
    await this.redisService.set(
      `user_${userId}_article_${id}`,
      1,
      VIEW_DEDUP_TTL,
    );
    return viewCount;
  }

  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    for (const key of keys) {
      const res = await this.redisService.hashGet(key);
      if (res.viewCount == undefined) continue;
      const [, id] = key.split('_');
      await this.entityManager.update(
        Article,
        { id: +id },
        { viewCount: +res.viewCount },
      );
    }
  }
}
