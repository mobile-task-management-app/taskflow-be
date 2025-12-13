import { Expose } from 'class-transformer';

export class SignUpVerification {
  @Expose()
  email: string;

  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  otp: string;

  constructor(args: Partial<SignUpVerification>) {
    Object.assign(this, args);
  }
}
