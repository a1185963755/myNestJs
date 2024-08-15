import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];
  create(user: User) {
    if (this.users.find((item) => item.name == user.name)) {
      throw new HttpException(
        {
          errCode: HttpStatus.BAD_REQUEST,
          errMsg: '用户已存在',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return {
      code: 200,
      message: 'success',
      data: {
        ...newUser,
      },
    };
  }
  findAll() {
    return {
      code: 200,
      message: 'success',
      data: this.users,
      total: this.users.length,
    };
  }

  async findOne(username: string) {
    return {
      code: 200,
      message: 'success',
      data: this.users.find((user) => user.name == username),
    };
  }
}
