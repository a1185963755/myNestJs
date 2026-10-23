import {
  Body,
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, CreateUserDto } from './dto/create-user.dto';
import { Auth } from 'src/common/decorators/auth/auth.decorator';
import { ZodValidationPipe } from 'src/pipes/parse-int/zod-validate.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 权限由 Casbin policy.csv 决定：admin/staff 可读，manager 继承 staff
  @Auth()
  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async findAll() {
    return this.usersService.findAll();
  }

  // policy.csv: p, role:manager, /users/register, create（admin 为 *）
  @Auth('admin', 'manager')
  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Auth()
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
