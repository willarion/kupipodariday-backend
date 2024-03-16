import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}
  async create(userId: number, createOfferDto: CreateOfferDto) {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      // TODO update the error
      throw new Error('User not found');
    }

    const wish = await this.wishesRepository.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if (!wish) {
      throw new Error('wish not found');
    }
    if (wish.owner.id === userId) {
      throw new Error('You cannot put offer for your own wish');
    }
    if (wish.price === wish.raised) {
      throw new Error('Offer cant be made: money already collected');
    }

    const newRaised = wish.raised + createOfferDto.amount;

    if (newRaised > wish.price) {
      throw new Error('Offer cant be made: offer is too big');
    }

    const updatedWish = await this.wishesRepository.save({
      ...wish,
      raised: newRaised,
    });

    if (!updatedWish) {
      return new Error('failed to update the wish');
    }

    const offer = this.offersRepository.create({
      ...createOfferDto,
      item: createOfferDto.itemId,
    });
    offer.user = user.id;
    return this.offersRepository.save(offer);
  }

  async findAll() {
    const offers = await this.offersRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .getMany();

    // TODO error handling
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository
      .createQueryBuilder('offer')
      .where('offer.id = :id', { id })
      .leftJoinAndSelect('offer.user', 'user')
      .leftJoinAndSelect('user.wishlists', 'wishlists')
      .getOne();
    // TODO add error handler
    return offer;
  }
}
