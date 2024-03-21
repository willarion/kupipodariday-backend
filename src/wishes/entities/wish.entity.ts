import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import NumericTransformer from './wish.utils';
import {
  IsDecimal,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Base } from 'src/utils/base.entity';

@Entity()
export class Wish extends Base {
  @Column({ length: 250 })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Length(1, 30, { message: 'Name must be between 1 and 30 characters' })
  name: string;

  @Column()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  @IsNotEmpty({ message: 'Link is required' })
  link: string;

  @Column()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
  })
  @IsNotEmpty({ message: 'Price is required' })
  @IsDecimal()
  price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new NumericTransformer(),
    default: 0,
  })
  @IsDecimal()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ length: 1024 })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @Length(1, 1024, {
    message: 'Description must be between 1 and 1024 characters',
  })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
