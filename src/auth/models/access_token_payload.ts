import { Expose } from 'class-transformer';

export class AccessTokenPayload {
  @Expose({ name: 'user_id' })
  userId: number;
  constructor(args: Partial<AccessTokenPayload>) {
    Object.assign(this, args);
  }
}
