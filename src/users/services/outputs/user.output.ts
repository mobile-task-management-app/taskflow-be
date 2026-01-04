import { OmitType } from '@nestjs/mapped-types';
import { User } from 'src/users/models/user';

export class UserOutput extends OmitType(User, [
  'password',
  'currentRefreshToken',
] as const) {
  constructor(args: Partial<UserOutput>) {
    super();
    Object.assign(this, args);
  }
}
