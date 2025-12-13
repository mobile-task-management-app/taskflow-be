import { Expose } from 'class-transformer';

export class RefreshTokenPayload {
  @Expose({ name: 'user_id' })
  userId: number;
  constructor(args: Partial<RefreshTokenPayload>) {
    Object.assign(this, args);
  }
}
