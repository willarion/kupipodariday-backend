import { IsNotEmpty, IsString, IsUrl, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Max(200)
  about?: string;

  @IsUrl()
  avatar?: string;
}
