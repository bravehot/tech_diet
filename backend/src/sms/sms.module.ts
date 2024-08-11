import { Module } from '@nestjs/common';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import type {} from 'tencentcloud-sdk-nodejs';

import { ConfigService } from '@nestjs/config';
import { SmsService } from './sms.service';

@Module({
  providers: [
    {
      provide: 'SMS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const SmsClient = tencentcloud.sms.v20210111.Client;
        const client = await new SmsClient({
          credential: {
            secretId: configService.get('TENCENT_SECRET_ID'),
            secretKey: configService.get('TENCENT_SECRET_KEY'),
          },
          region: 'ap-guangzhou',
          profile: {
            httpProfile: {
              endpoint: 'sms.tencentcloudapi.com',
            },
          },
        });
        return client;
      },
      inject: [ConfigService],
    },
    SmsService,
  ],
  exports: [SmsService],
})
export class SmsModule {}
