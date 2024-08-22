import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}

  async register(user: User) {
    const usr = await this.entityManager.find(UserEntity, {
      where: {
        username: user.name,
      },
    });
    if (usr.length > 0) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = this.entityManager.create(UserEntity, {
      username: user.name,
      password: user.password,
    });
    await this.entityManager.save(newUser);
    return newUser;
  }
  async findAll() {
    const users = (await this.entityManager.find(UserEntity)).map((user) => ({
      id: user.id,
      username: user.username,
    }));
    const total = await this.entityManager.count(UserEntity);
    return {
      users,
      total,
    };
  }

  async findOne(username: string) {
    const user = await this.entityManager.findOne(UserEntity, {
      where: {
        username,
      },
    });
    return user;
  }
}
