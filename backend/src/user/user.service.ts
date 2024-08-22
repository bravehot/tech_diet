import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

import { ProfileDto, SetPasswordDto } from './dto';
import { SmsTemplateEnum } from 'src/@type/enum';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async profile(userInfo: ProfileDto) {
    const { userId } = userInfo;
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        phone: true,
        avatar: true,
        gender: true,
        birthday: true,
        address: true,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return user;
  }

  async setPassword(passwordInfo: SetPasswordDto, userInfo: ProfileDto) {
    const { smsCode } = passwordInfo;
    const { phone } = userInfo;
    const redisKey = `${phone}_${SmsTemplateEnum.SET_PASSWORD}`;
    if (smsCode !== (await this.redisService.get(redisKey))) {
      throw new HttpException('验证码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (passwordInfo.phone !== phone) {
      throw new HttpException('手机号码错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        phone,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(passwordInfo.password, 10),
      },
    });
    await this.redisService.del(redisKey);

    return true;
  }
}
