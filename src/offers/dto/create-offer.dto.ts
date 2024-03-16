import { IsNotEmpty, Min, IsBoolean, IsDecimal } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(0)
  @IsDecimal()
  amount: number;

  @IsNotEmpty()
  @Min(0)
  @IsDecimal()
  itemId: number;

  @IsBoolean()
  hidden: boolean;
}
