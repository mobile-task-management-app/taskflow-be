export class LogInInput {
  email: string;
  password: string;

  constructor(args: Partial<LogInInput>) {
    Object.assign(this, args);
  }
}
