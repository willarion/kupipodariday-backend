import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { saveWithValidation } from 'src/utils/helpers';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userId: number, createWishDto: CreateWishDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wish = this.wishesRepository.create(createWishDto);
    wish.owner = user;
    return saveWithValidation(wish, (i) => this.wishesRepository.save(i));
  }

  async findLatestWishesByUserId(userId: number): Promise<Wish[] | undefined> {
    const wishes = await this.wishesRepository.find({
      where: { owner: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 40,
      relations: {
        owner: true,
        offers: true,
      },
    });

    return wishes;
  }

  async findOneById(wishId: number): Promise<Wish | undefined> {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new NotFoundException(`Wish with ID "${wishId}" is not found.`);
    }

    return wish;
  }

  async findTopWishes(): Promise<Wish[] | undefined> {
    return this.wishesRepository.find({
      order: { copied: 'ASC' },
      take: 20,
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async updateById(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
        owner: { id: userId },
      },
      relations: {
        offers: true,
      },
    });

    if (!wish) {
      throw new NotFoundException('No wish found');
    }

    if (updateWishDto.price && wish.offers.length > 0) {
      throw new BadRequestException(
        "Price can't be changed because people have already made offers",
      );
    }

    return await this.wishesRepository.save({
      ...wish,
      ...updateWishDto,
    });
  }

  async deleteOneById(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId, owner: { id: userId } },
    });

    if (!wish) {
      throw new NotFoundException(`Wish with ID "${wishId}" not found`);
    }

    try {
      const result = await this.wishesRepository.delete({
        id: wishId,
        owner: { id: userId },
      });
      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'An error occurred while saving the new wish.',
      );
    }
  }

  async copyWish(wishId: number, userId: number): Promise<Wish> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wishToCopy = await this.wishesRepository.findOneBy({ id: wishId });

    if (!wishToCopy) {
      throw new NotFoundException(`Wish with ID "${wishId}" not found.`);
    }

    try {
      await this.wishesRepository.increment({ id: wishId }, 'copied', 1);

      const newWishDto: CreateWishDto = {
        name: wishToCopy.name,
        link: wishToCopy.link,
        image: wishToCopy.image,
        price: wishToCopy.price,
        description: wishToCopy.description,
      };

      const newWish = this.wishesRepository.create(newWishDto);
      newWish.owner = user;

      await this.wishesRepository.save(newWish);

      return newWish;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'An error occurred while saving the new wish.',
      );
    }
  }
}
