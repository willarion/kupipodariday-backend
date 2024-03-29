import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SearchKeys } from 'src/models/enums';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import ExtendedReq from 'src/models/ExtendedReq';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMyProfile(@Req() req: ExtendedReq) {
    return this.usersService.findOne(SearchKeys.ID, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMyProfile(
    @Req() req: ExtendedReq,
    @Body() updateUserDto: UpdateUserDto,
  ) {
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
      return { message: 'No rows were updated.' };
    }
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req: ExtendedReq) {
    return this.usersService.findUserWishes(SearchKeys.ID, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findUsersByUsernameOrEmail(@Body() findUserDto: FindUserDto) {
    return this.usersService.findUsersByUsernameOrEmail(findUserDto.query);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne(SearchKeys.USERNAME, username);

    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(SearchKeys.USERNAME, username);
  }
}
