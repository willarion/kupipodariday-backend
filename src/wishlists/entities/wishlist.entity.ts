import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base.entity';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

@Entity()
export class Wishlist extends Base {
  @Column({ length: 250 })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  @Length(1, 250, { message: 'Name must be between 1 and 250 characters' })
  name: string;

  @Column({ length: 1500, default: '' })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @Length(1, 1500, {
    message: 'Description must be between 1 and 1500 characters',
  })
  description: string;

  @Column()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.id)
  owner: Partial<User>;
}
