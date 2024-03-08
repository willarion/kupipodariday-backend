import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { authPayloadDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser({
    username,
    password,
  }: authPayloadDTO): Promise<Partial<User>> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
      // const payload = { username: user.username, sub: user.id };
      // return {
      //   access_token: this.jwtService.sign(payload),
      // };
    }
    return null;
  }

  auth(user: Partial<User>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
