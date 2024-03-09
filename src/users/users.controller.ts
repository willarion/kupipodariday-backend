import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { SearchKeys } from 'src/models/enums';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  // only for testing
  // TODO delete
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() req: Request) {
    console.log('req', req.user);
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('me')
  getMyProfile(@Req() req: any) {
    return this.usersService.findOne(SearchKeys.ID, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMyProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    const updateResult = await this.usersService.updateById(
      req.user.id,
      updateUserDto,
    );

    if (updateResult.affected > 0) {
      return { message: 'Update was successful.' };
    } else {
      // TODO add error
      return { message: 'No rows were updated.' };
    }
  }

  @Get('/find')
  findUserByUsernameOrEmail(@Body() findUserDto: FindUserDto) {
    return this.usersService.findUserByUsernameOrEmail(findUserDto.query);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne(SearchKeys.USERNAME, username);
    delete user.email;

    return user;
  }
}
