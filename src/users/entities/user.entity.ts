import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import { Base } from 'src/utils/base.entity';
import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { defaultValues } from 'src/utils/helpers';

@Entity()
@Unique(['username', 'email'])
export class User extends Base {
  @Column({ length: 30, unique: true })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  @Length(2, 30, { message: 'Username must be between 2 and 30 characters' })
  username: string;

  @Column({ length: 200, default: defaultValues.about })
  @IsString()
  @Length(2, 200, {
    message: 'About section must be between 2 and 200 characters',
  })
  about: string;

  @Column({ default: defaultValues.avatar })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
