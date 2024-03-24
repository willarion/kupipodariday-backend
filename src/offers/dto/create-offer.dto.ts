import { IsNotEmpty, Min, IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  itemId: number;

  @IsBoolean()
  hidden: boolean;
}
