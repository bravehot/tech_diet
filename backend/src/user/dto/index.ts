import { IsString } from 'class-validator';
import { RegisterDto } from 'src/auth/dto';

export class ProfileDto {
  @IsString()
  userId: string;

  @IsString()
  phone: string;
}

export class SetPasswordDto extends RegisterDto {}
