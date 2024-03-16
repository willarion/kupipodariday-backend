import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const user = this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      const { username, id } = user;
      return { username, id };
    } catch (error) {
      // PostgreSQL unique violation error code
      if (error.code === '23505') {
        throw new ConflictException(
          'A user with the given username or email already exists.',
        );
      }
      throw new InternalServerErrorException();
    }
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
    const user = await this.usersRepository.findOne({
      where: { [key]: value },
      relations: ['wishes'],
    });

    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    return user.wishes || [];
  }
}
