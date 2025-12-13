export class TokenOutput {
  accessToken: string;
  refreshToken: string;
  constructor(args: Partial<TokenOutput>) {
    Object.assign(this, args);
  }
}
