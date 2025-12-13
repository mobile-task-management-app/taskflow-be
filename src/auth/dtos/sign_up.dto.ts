import { IsEmail, IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { SignUpInput } from '../services/inputs/sign_up.input';

export class SignUpRequestDTO {
  @Expose({ name: 'email' })
  @IsEmail({}, { message: 'invalid email' })
  @IsNotEmpty()
  email: string;

  @Expose({ name: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @Expose({ name: 'first_name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Expose({ name: 'last_name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Expose({ name: 'phone_number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Expose({ name: 'date_of_birth' })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(Number(value) * 1000), {
    toClassOnly: true,
  })
  dateOfBirth: Date;

  toSignUpInput(): SignUpInput {
    return new SignUpInput({
      ...this,
    });
  }
}
