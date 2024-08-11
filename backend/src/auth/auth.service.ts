import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { SmsService } from 'src/sms/sms.service';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  LoginByPasswordDto,
  LoginByPhoneDto,
  RegisterDto,
  smsDto,
} from './dto';

import { getRandomSmsCode } from 'src/utils';

import { smsTemplateEnum } from 'src/@type/enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getTokenInfo(jwtSignInfo: {
    userId: string | number;
    phone: string | number;
  }) {
    const accessToken = this.jwtService.sign(jwtSignInfo, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES') || '30d',
    });
    const refreshToken = this.jwtService.sign(jwtSignInfo, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES') || '45d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async loginByPhone(loginDto: LoginByPhoneDto) {
    const { phone, smsCode } = loginDto;

    if (smsCode !== (await this.redisService.get(phone))) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const jwtSignInfo = {
      userId: user.id,
      phone: user.phone,
    };

    await this.redisService.del(phone);
    const tokenInfo = this.getTokenInfo(jwtSignInfo);

    return tokenInfo;
  }

  async loginByPassword(loginDto: LoginByPasswordDto) {
    const { phone, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    const isMatch = await bcrypt.compare(password, user?.password || '');

    if (user && isMatch) {
      const jwtSignInfo = {
        userId: user.id,
        phone: user.phone,
      };
      return this.getTokenInfo(jwtSignInfo);
    } else {
      throw new HttpException(
        '用户名或密码错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    const { phone, smsCode, password } = registerDto;
    const redisSmsCode = await this.redisService.get(phone);
    if (!redisSmsCode || smsCode !== redisSmsCode) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    if (user) {
      throw new HttpException('用户已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(phone);

    const newUser = await this.prismaService.user.create({
      data: {
        phone,
        password: await bcrypt.hash(password, 10),
      },
    });

    const jwtSignInfo = {
      userId: newUser.id,
      phone: newUser.phone,
    };

    const tokenInfo = this.getTokenInfo(jwtSignInfo);

    return tokenInfo;
  }

  async sendSms(sendSmsDto: smsDto) {
    const { phone, captcha } = sendSmsDto;
    const captchaText = await this.redisService.get(captcha);
    if (!captchaText) {
      throw new HttpException('验证码已过期', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (captchaText !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.redisService.del(captcha);

    const smsCode = await this.redisService.get(phone);
    if (smsCode) {
      throw new HttpException(
        '验证码已发送，请稍后再试',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const code = getRandomSmsCode();
    await this.redisService.set(phone, code, 60);
    await this.smsService.sendSms(phone, code, smsTemplateEnum.LOGIN);

    return code;
  }

  async getCaptcha() {
    const captcha = svgCaptcha.create();
    await this.redisService.set(captcha.text, captcha.text, 60);
    return captcha;
  }
}
