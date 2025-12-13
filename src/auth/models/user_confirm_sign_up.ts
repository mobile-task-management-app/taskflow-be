import { Expose } from 'class-transformer';
import { BaseModel } from 'src/common/models/base_model';

export class UserConfirmSignUp extends BaseModel {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  password: string;

  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Expose()
  otp: string;

  @Expose({ name: 'expire_at' })
  expireAt: Date;
}
