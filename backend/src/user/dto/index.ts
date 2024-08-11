import { IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  userId: string;

  @IsString()
  phone: string;
}
