export class Token {
  accessToken: string;
  refreshToken: string;
  constructor(args: Partial<Token>) {
    Object.assign(this, args);
  }
}
