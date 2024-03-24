import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  ValidateIf,
} from 'class-validator';

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
  @Length(2, 200)
  @ValidateIf((o) => o.about && o.about.trim().length > 0)
  about?: string;

  @IsUrl()
  @ValidateIf((o) => o.avatar !== undefined)
  avatar?: string;
}
