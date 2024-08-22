import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { SetPasswordDto } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get('profile')
  async profile(@Req() req: Request) {
    const [, token] = req.headers.authorization?.split(' ') ?? [];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return this.userService.profile(payload);
  }

  @Post('setPassword')
  async setPassword(
    @Req() req: Request,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    const [, token] = req.headers.authorization?.split(' ') ?? [];
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return this.userService.setPassword(setPasswordDto, payload);
  }
}
