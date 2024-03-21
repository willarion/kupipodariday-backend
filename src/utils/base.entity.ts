import { IsDateString } from 'class-validator';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  @IsDateString({}, { message: 'Invalid createdAt date format' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @IsDateString({}, { message: 'Invalid createdAt date format' })
  updatedAt: Date;
}
