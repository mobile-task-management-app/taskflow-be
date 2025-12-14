import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'otp',
    example: '123456',
    description: 'One-time password code',
  })
  otp: string;
}

export class VerifyOtpResponseDTO {
  @Expose({ name: 'access_token' })
  @ApiProperty({
    name: 'access_token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @Expose({ name: 'refresh_token' })
  @ApiProperty({
    name: 'refresh_token',
    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  constructor(args: Partial<VerifyOtpResponseDTO>) {
    Object.assign(this, args);
  }
}
