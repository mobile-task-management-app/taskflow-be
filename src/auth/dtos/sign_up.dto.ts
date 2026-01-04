import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { SignUpInput } from '../services/inputs/sign_up.input';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDTO {
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

  @Expose({ name: 'first_name' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'first_name', example: 'John' })
  firstName: string;

  @Expose({ name: 'last_name' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'last_name', example: 'Doe' })
  lastName: string;

  @Expose({ name: 'phone_number' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'phone_number', example: '+1234567890' })
  phoneNumber: string;

  @Expose({ name: 'date_of_birth' })
  @IsNotEmpty()
  @IsDate()
  @ApiProperty({ name: 'date_of_birth', type: Number })
  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  @ApiProperty({ name: 'date_of_birth', example: 915148800 }) // timestamp in seconds
  dateOfBirth: Date;

  toSignUpInput(): SignUpInput {
    return new SignUpInput({
      ...this,
    });
  }
}
