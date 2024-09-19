import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SsoService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(username: string, pwd: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.OK);
    }
    if (!bcrypt.compareSync(pwd, bcrypt.hashSync(user.password, 10))) {
      throw new HttpException('密码不正确', HttpStatus.OK);
    }
    const { password, ...result } = user;
    console.log('🚀 ~ SsoService ~ validateUser ~ password:', password);
    return result;
  }

  async login(user: any) {
    const payload = { userId: user.id, username: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
