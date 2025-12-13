import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class VerifyOtpRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  otp: string;
}

export class VerifyOtpResponseDTO {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  constructor(args: Partial<VerifyOtpResponseDTO>) {
    Object.assign(this, args);
  }
}
