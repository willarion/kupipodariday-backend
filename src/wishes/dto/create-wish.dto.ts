import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1024)
  description: string;
}
