import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SsoService } from './sso.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { SsoLoginDto } from './dto/sso-login.dto';

@Controller('sso')
export class SsoController {
  constructor(
    private readonly ssoService: SsoService,
    private readonly UsersService: UsersService,
  ) {}

  @Post('login')
  async create(@Body() ssoBody: SsoLoginDto) {
    const user = await this.ssoService.validateUser(
      ssoBody.username,
      ssoBody.password,
    );
    return this.ssoService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':username')
  async getUser(@Param('username') username: string) {
    const { data } = await this.UsersService.findOne(username);
    if (!data) {
      throw new HttpException(
        {
          code: 404,
          message: '用户不存在',
          data: null,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const { password, ...others } = data!;
    console.log('🚀 ~ SsoController ~ getUser ~ password:', password);
    return {
      code: 200,
      message: 'success',
      data: others,
    };
  }
}
