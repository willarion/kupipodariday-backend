import {
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
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
  @Max(200)
  @Min(2)
  @ValidateIf((o) => o.about !== undefined)
  about?: string;

  @IsUrl()
  @ValidateIf((o) => o.avatar !== undefined)
  avatar?: string;
}
