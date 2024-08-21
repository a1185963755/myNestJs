import {
  Controller,
  Get,
  Post,
  Body,
  Header,
  UseInterceptors,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserSchema, CreateUserDto } from './dto/create-user.dto';
import { HelloWorldInterceptor } from 'src/common/interceptors/hello-world/hello-world.interceptor';

import { UserName } from 'src/common/decorators/user-id/user-name.decorator';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { ZodValidationPipe } from 'src/pipes/parse-int/zod-validate.pipe';

@Controller('users')
@UseInterceptors(HelloWorldInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(RoleGuard)
  @Get()
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(RoleGuard)
  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() createCatDto: CreateUserDto) {
    return this.usersService.register(createCatDto);
  }

  @UseGuards(RoleGuard)
  @Get(':username')
  async findOne(@UserName() username: string) {
    return this.usersService.findOne(username);
  }
}
