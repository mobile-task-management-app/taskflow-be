import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { LogInInput } from '../services/inputs/login.input';

export class LogInRequestDTO {
  @Expose({ name: 'email' })
  @IsEmail({}, { message: 'invalid email' })
  @IsNotEmpty()
  @ApiProperty({ name: 'email', example: 'user@example.com' })
  email: string;

  @Expose({ name: 'password' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'password', example: 'StrongP@ssw0rd' })
  password: string;
  toLogInInput(): LogInInput {
    return new LogInInput({ ...this });
  }
}
