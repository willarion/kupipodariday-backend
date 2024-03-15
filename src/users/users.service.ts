import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchKeys } from 'src/models/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

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
    returnHiddenFields: boolean = false,
  ): Promise<User | null> {
    // const user = await this.usersRepository.findOne({
    //   where: {
    //     [key]: value,
    //   },
    // });

    const query = this.usersRepository
      .createQueryBuilder('user')
      .where(`user.${key} = :value`, { value });

    if (returnHiddenFields) {
      query.addSelect(['user.password', 'user.email']);
    }

    const user = await query.getOne();

    return user;
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

  async findUsersByUsernameOrEmail(query: string): Promise<User[] | null> {
    const users = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
      select: {
        id: true,
        username: true,
        email: true,
        about: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async findUserWishes(
    key: SearchKey,
    value: string | number,
  ): Promise<Wish[] | null> {
    const userWithWishes = await this.usersRepository.findOne({
      where: { [key]: value },
      relations: ['wishes'],
    });

    return userWithWishes.wishes || null;
  }
}
