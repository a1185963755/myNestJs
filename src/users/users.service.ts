import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

export const BCRYPT_ROUNDS = 10;

/** 对外可见的用户字段，永远不包含 password。 */
export interface PublicUser {
  id: number;
  username: string;
  email: string | null;
  role: string;
}

const toPublicUser = (user: UserEntity): PublicUser => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
});

@Injectable()
export class UsersService {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  // 注册
  async register(user: CreateUserDto): Promise<PublicUser> {
    const existing = await this.entityManager.findOne(UserEntity, {
      where: { username: user.username },
    });
    if (existing) {
      throw new ConflictException('用户已存在');
    }

    const newUser = this.entityManager.create(UserEntity, {
      username: user.username,
      password: await bcrypt.hash(user.password, BCRYPT_ROUNDS),
    });
    await this.entityManager.save(newUser);
    return toPublicUser(newUser);
  }

  async findAll() {
    const users = (await this.entityManager.find(UserEntity)).map(toPublicUser);
    const total = await this.entityManager.count(UserEntity);
    return {
      users,
      total,
    };
  }

  /** 对外查询：不带 password。 */
  async findOne(username: string): Promise<PublicUser | null> {
    const user = await this.findEntityByUsername(username);
    return user ? toPublicUser(user) : null;
  }

  /** 仅登录校验使用：需要 password 哈希。 */
  async findEntityByUsername(username: string): Promise<UserEntity | null> {
    return this.entityManager.findOne(UserEntity, { where: { username } });
  }

  /** 历史明文密码登录成功后透明升级为 bcrypt 哈希。 */
  async upgradePasswordHash(userId: number, passwordHash: string) {
    await this.entityManager.update(
      UserEntity,
      { id: userId },
      { password: passwordHash },
    );
  }

  async findUserByEmail(email: string): Promise<PublicUser> {
    const user = await this.entityManager.findOne(UserEntity, {
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return toPublicUser(user);
  }
}
