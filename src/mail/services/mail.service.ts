import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SignUpVerification } from '../models/sign_up_verfication';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendSignUpVerificationMail(to: string, data: SignUpVerification) {
    // Transform class → plain object (respect @Expose)
    const context = instanceToPlain(data, {
      exposeUnsetFields: false,
    });

    await this.mailer.sendMail({
      to,
      subject: 'Welcome to our app',
      template: 'sign_up_verification',
      context,
    });
  }
}
