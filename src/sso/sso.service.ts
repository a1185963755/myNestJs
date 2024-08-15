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
    const { data: user } = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(pwd, bcrypt.hashSync(user.password, 10))) {
      const { password, ...result } = user;
      console.log('🚀 ~ SsoService ~ validateUser ~ password:', password);
      return result;
    } else {
      throw new HttpException(
        {
          errCode: HttpStatus.BAD_REQUEST,
          errMsg: 'accessToken失效',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: any) {
    const payload = { userId: user.id, username: user.name };
    return {
      code: 200,
      message: 'success',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
