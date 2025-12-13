export class CreateUserConfirmSignUp {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: Date;
  otp: string;
  expireAt: Date;

  constructor(args: Partial<CreateUserConfirmSignUp>) {
    Object.assign(this, args);
  }
}
