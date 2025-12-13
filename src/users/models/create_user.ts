export class CreateUser {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  phoneNumber: string;

  dateOfBirth: Date;

  constructor(args: Partial<CreateUser>) {
    Object.assign(this, args);
  }
}
