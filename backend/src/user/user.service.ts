import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ProfileDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
