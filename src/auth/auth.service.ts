import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { authPayloadDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { SearchKeys } from 'src/models/enums';
import * as bcrypt from 'bcrypt';

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

    if (user && (await bcrypt.compare(password, user.password))) {
      return { username: user.username, id: user.id };
    }
    throw new UnauthorizedException('Username or password is incorrect.');
  }

  auth(user: Partial<User>) {
    const payload = { username: user.username, id: user.id };
    try {
      const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      return {
        access_token: accessToken,
      };
    } catch (error) {
      // Log the error and handle it appropriately
      throw new InternalServerErrorException(
        'Failed to generate access token.',
      );
    }
  }
}
