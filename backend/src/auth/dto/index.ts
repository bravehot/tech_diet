import { IsString, Length, Matches } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';

export class PhoneDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入中国大陆地区手机号' })
  phone: string;
}

export class PasswordDto {
  @Matches(
    /^(?=.*[A-Za-z])(?=.*[0-9])|(?=.*[A-Za-z])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-])|(?=.*[0-9])(?=.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-])[A-Za-z0-9!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-]{8,14}$/,
    {
      message: '长度为8~14个字符, 字母/数字以及标点符号至少包含2种',
    },
  )
  @Length(8, 14, { message: '长度为8~14个字符' })
  password: string;
}

export class RegisterDto extends PasswordDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入中国大陆地区手机号' })
  phone: string;

  @Length(6, 6, { message: '请输入验证码' })
  smsCode: string;
}

export class smsDto extends PhoneDto {
  @Length(4, 4, { message: '请输入验证码' })
  captcha: string;

  @IsString()
  templateId: string;
}

export class LoginByPasswordDto extends PhoneDto {
  @IsString({ message: '请输入密码' })
  password: string;
}

export class LoginByPhoneDto extends PickType(RegisterDto, [
  'phone',
  'smsCode',
]) {}
