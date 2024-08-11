import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SmsModule } from 'src/sms/sms.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [SmsModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
