import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { authPayloadDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signin')
  @UseGuards(LocalGuard)
  async login(@Body() authPayload: authPayloadDTO) {
    const tokenObj = await this.authService.auth(authPayload);
    return tokenObj;
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    const { username, password } = user;

    return this.authService.auth({ username, password });
  }
}
