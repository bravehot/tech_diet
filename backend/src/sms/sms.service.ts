import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { smsTemplateEnum } from 'src/@type/enum';

@Injectable()
export class SmsService {
  @Inject('SMS_CLIENT')
  private smsClient: any;

  constructor(private readonly configService: ConfigService) {}

  async sendSms(
    phone: string,
    code: string | number,
    templateId: smsTemplateEnum,
  ) {
    const params = {
      SmsSdkAppId: this.configService.get('SMS_SECRET_ID'),
      SignName: this.configService.get('SMS_SIGN_NAME'),
      TemplateId: templateId,
      PhoneNumberSet: [phone],
      TemplateParamSet: [code.toString()],
    };
    console.log('params: ', params);

    try {
      // const { SendStatusSet } = await this.smsClient.SendSms(params);
      const { SendStatusSet } = { SendStatusSet: [{ Code: 'Ok' }] };
      const smsResult = SendStatusSet && SendStatusSet[0];
      if (smsResult.Code === 'Ok') {
        return true;
      } else {
        console.log('smsResult.Code: ', smsResult.Code);
        throw new HttpException(
          '验证码发送失败',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        '验证码发送失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
