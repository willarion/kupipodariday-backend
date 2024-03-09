import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchKeys } from 'src/models/enums';
import { UpdateUserDto } from './dto/update-user.dto';

type SearchKey = SearchKeys.ID | SearchKeys.USERNAME | SearchKeys.EMAIL;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(
    key: SearchKey,
    value: string | number,
    keepPassword: boolean = false,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        [key]: value,
      },
    });

    if (user) {
      if (!keepPassword) {
        delete user.password;
      }
      return user;
    }

    return null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
  }

  async findUserByUsernameOrEmail(query: string) {
    const user = await this.usersRepository.findOne({
      where: [{ email: query }, { username: query }],
    });

    if (user) {
      delete user.password;

      return user;
    }

    return null;
  }
}
