import { Expose } from 'class-transformer';
import { BaseModel } from 'src/common/models/base_model';

export class User extends BaseModel {
  @Expose({ name: 'first_name' })
  firstName: string;

  @Expose({ name: 'last_name' })
  lastName: string;

  @Expose({ name: 'email' })
  email: string;

  @Expose({ name: 'password' })
  password: string;

  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @Expose({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Expose({ name: 'last_login_at' })
  lastLoginAt: Date;

  @Expose({ name: 'current_refresh_token' })
  currentRefreshToken: string;
}
