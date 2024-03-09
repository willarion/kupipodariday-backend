import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { authPayloadDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { SearchKeys } from 'src/models/enums';
import { cleanUserResult } from 'src/users/users.utils';

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
    const user = await this.usersService.findOne(
      SearchKeys.USERNAME,
      username,
      true,
    );

    if (user && user.password === password) {
      return cleanUserResult(user);
    }
    return null;
  }

  auth(user: Partial<User>) {
    const payload = { username: user.username, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
