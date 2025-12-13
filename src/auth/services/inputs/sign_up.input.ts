import * as bcrypt from 'bcrypt';
import { CreateUserConfirmSignUp } from 'src/auth/models/create_user_confirm_sign_up';

export class SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;

  constructor(args: Partial<SignUpInput>) {
    Object.assign(this, args);
  }
  toCreateUSerConfirmSignUp(args: {
    otp: string;
    expireAfter: number;
  }): CreateUserConfirmSignUp {
    const hashedPassword = bcrypt.hashSync(this.password, 10);

    return new CreateUserConfirmSignUp({
      email: this.email,
      password: hashedPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      dateOfBirth: new Date(this.dateOfBirth),
      otp: args.otp,
      expireAt: new Date(Date.now() + args.expireAfter),
    });
  }
}
