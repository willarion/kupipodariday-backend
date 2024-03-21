import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Base } from 'src/utils/base.entity';
import { IsBoolean, IsDecimal } from 'class-validator';

@Entity()
export class Offer extends Base {
  @ManyToOne(() => User, (user) => user.id)
  user: User['id'];

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish['id'];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'Amount must be a decimal with two digits after the point' },
  )
  amount: number;

  @Column({ default: false })
  @IsBoolean({ message: 'Hidden must be a boolean value' })
  hidden: boolean;
}
