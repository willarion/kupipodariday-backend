import { Injectable, NotFoundException } from '@nestjs/common';
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
      // TODO update the error
      throw new NotFoundException('One or more items do not exist');
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

    await this.wishlistsRepository.save(wishlist);
    // TODO update the error

    return wishlist;
  }

  async findAll() {
    const wishlists = this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
    return wishlists;
  }

  async findOneById(id) {
    const wishlist = this.wishlistsRepository.find({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
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

    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishId, owner: { id: userId } },
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist not found.`);
    }

    Object.assign(wishlist, rest);

    wishlist.items = wishes;

    const result = await this.wishlistsRepository.save(wishlist);

    return result;
  }

  async deleteOneById(userId: number, wishId: number) {
    const result = await this.wishlistsRepository.delete({
      id: wishId,
      owner: { id: userId },
    });

    return result;
  }
}
