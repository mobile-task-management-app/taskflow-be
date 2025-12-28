import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenResponseDTO {
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

  constructor(args: Partial<TokenResponseDTO>) {
    Object.assign(this, args);
  }
}
