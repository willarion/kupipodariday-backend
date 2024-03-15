import {
  IsDecimal,
  IsNotEmpty,
  Min,
  IsBoolean,
  IsPositive,
} from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsDecimal()
  @Min(0)
  itemId: number;

  @IsBoolean()
  hidden: boolean;
}
