import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';

import {
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterDto,
  smsDto,
} from './dto';
import { Public } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('loginByPhone')
  async loginByPhone(@Body() loginDto: LoginByPhoneDto) {
    return this.authService.loginByPhone(loginDto);
  }

  @Public()
  @Post('loginByPassword')
  async loginByPassword(@Body() loginDto: LoginByPasswordDto) {
    return this.authService.loginByPassword(loginDto);
  }

  @Public()
  @Get('sendSms')
  async sendSms(@Query() sendSmsDto: smsDto) {
    return this.authService.sendSms(sendSmsDto);
  }

  @Public()
  @Get('captcha')
  async getCaptcha(@Res() res: Response) {
    const captcha = await this.authService.getCaptcha();
    res.type('svg').send(captcha.data);
  }
}
