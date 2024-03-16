import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async create(userId: number, createWishlistDto: CreateWishlistDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { itemsId, ...rest } = createWishlistDto;

    const wishes = await this.wishRepository.find({
      where: {
        id: In(itemsId),
        owner: { id: userId },
      },
    });

    if (wishes.length !== itemsId.length) {
      throw new NotFoundException('One or more wishes do not exist');
    }

    const wishlist = this.wishlistsRepository.create({
      ...rest,
      items: wishes,
    });

    wishlist.owner = user;

    try {
      await this.wishlistsRepository.save(wishlist);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create wishlist.');
    }

    return wishlist;
  }

  async findAll() {
    try {
      const wishlists = await this.wishlistsRepository.find({
        relations: {
          owner: true,
          items: true,
        },
      });
      return wishlists;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve wishlists.');
    }
  }

  async findOneById(id) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID "${id}" not found.`);
    }

    return wishlist;
  }

  async updateById(
    userId: number,
    wishId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const { itemsId, ...rest } = updateWishlistDto;

    const wishes = await this.wishRepository.find({
      where: {
        id: In(itemsId),
        owner: { id: userId },
      },
    });

    if (wishes.length !== itemsId.length) {
      throw new NotFoundException('One or more items do not exist.');
    }

    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishId, owner: { id: userId } },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID "${wishId}" not found.`);
    }

    Object.assign(wishlist, rest);

    wishlist.items = wishes;

    try {
      return await this.wishlistsRepository.save(wishlist);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update wishlist with ID "${wishId}".`,
      );
    }
  }

  async deleteOneById(userId: number, wishId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id: wishId,
        owner: { id: userId },
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID "${wishId}" not found.`);
    }

    try {
      return await this.wishlistsRepository.delete(wishId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to delete wishlist with ID "${wishId}".`,
      );
    }
  }
}
