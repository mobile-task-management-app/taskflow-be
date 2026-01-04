import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDTO {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
    name: 'first_name',
  })
  @Expose({ name: 'first_name' })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
    name: 'last_name',
  })
  @Expose({ name: 'last_name' })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @Expose({ name: 'email' })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'International phone number',
    name: 'phone_number',
  })
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty({
    type: Number,
    description: 'unix timestamp of the last successful login',
    name: 'last_login_at',
  })
  @Expose({ name: 'last_login_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  lastLoginAt: Date;

  constructor(args: Partial<UserResponseDTO>) {
    this.id = args.id!;
    this.email = args.email!;
    this.firstName = args.firstName!;
    this.lastName = args.lastName!;
    this.phoneNumber = args.phoneNumber!;
    this.lastLoginAt = args.lastLoginAt!;
  }
}
