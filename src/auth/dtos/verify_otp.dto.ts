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
