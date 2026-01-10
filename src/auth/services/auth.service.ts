import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repositories/user.repository';
import { MailService } from 'src/mail/services/mail.service';
import { randomInt } from 'crypto';
import { UserConfirmSignRepository } from '../repositories/user_confirm_sign_up.repository';
import { SignUpVerification } from 'src/mail/models/sign_up_verfication';
import { CreateUser } from 'src/users/models/create_user';
import { PgService } from 'src/common/pg/pg.service';
import { PoolClient } from 'pg';
import { AccessTokenPayload } from '../models/access_token_payload';
import { RefreshTokenPayload } from '../models/refresh_token_payload';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';
import { SignUpInput } from './inputs/sign_up.input';
import { TokenOutput } from './outputs/token.output';
import { LogInInput } from './inputs/login.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userConfirmRepo: UserConfirmSignRepository,
    private readonly pgService: PgService,
    private readonly configService: ConfigService,
  ) {}

  genOtp(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += randomInt(0, 10).toString();
    }
    return otp;
  }
  async genToken(
    payload: AccessTokenPayload | RefreshTokenPayload,
    secret: string,
    expireIn: number, // seconds
  ) {
    if (expireIn <= 0) {
      throw new HttpException(
        'expireIn must be greater than 0',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const token = await this.jwtService.signAsync(instanceToPlain(payload), {
      secret,
      expiresIn: expireIn,
    });

    return token;
  }
  async signUp(input: SignUpInput) {
    const [existUser, existOtp] = await Promise.all([
      this.userRepo.findUserByEmail(input.email),
      this.userConfirmRepo.findByEmail(input.email),
    ]);
    if (existUser) {
      throw new HttpException('user email exist', HttpStatus.BAD_REQUEST);
    }
    if (existOtp) {
      throw new HttpException(
        'pending otp verification exist for this email',
        HttpStatus.BAD_REQUEST,
      );
    }
    const otp = this.genOtp();
    const createUserConfirm = input.toCreateUserConfirmSignUp({
      otp,
      expireAfter: 5 * 60 * 1000,
    });
    const userConfirm = await this.userConfirmRepo.create(createUserConfirm);
    const signUpVerification = new SignUpVerification({
      firstName: userConfirm.firstName,
      lastName: userConfirm.lastName,
      email: userConfirm.email,
      otp: userConfirm.otp,
    });
    return this.mailService.sendSignUpVerificationMail(
      userConfirm.email,
      signUpVerification,
    );
  }
  async verifyOtp(otp: string): Promise<TokenOutput> {
    const userConfirm = await this.userConfirmRepo.findByOtp(otp);
    if (!userConfirm) {
      throw new HttpException('otp invalid', HttpStatus.BAD_REQUEST);
    }
    const now = new Date();
    if (userConfirm.expireAt <= now) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    const createUser = new CreateUser({
      firstName: userConfirm.firstName,
      lastName: userConfirm.lastName,
      email: userConfirm.email,
      password: userConfirm.password,
      phoneNumber: userConfirm.phoneNumber,
      dateOfBirth: userConfirm.dateOfBirth,
    });
    const callback = async (client: PoolClient) => {
      let user = await this.userRepo.createUser(createUser, client);
      await this.userConfirmRepo.deleteByOtp(otp, client);
      const [accessToken, refreshToken] = await Promise.all([
        this.genToken(
          new AccessTokenPayload({ userId: user.id }),
          this.configService.get('jwt.accessToken.secret')!,
          this.configService.get('jwt.accessToken.expiresIn')!,
        ),
        this.genToken(
          new RefreshTokenPayload({ userId: user.id }),
          this.configService.get<string>('jwt.refreshToken.secret')!,
          this.configService.get<number>('jwt.refreshToken.expiresIn')!,
        ),
      ]);
      await this.userRepo.updateCurrentRefreshTokenByUserId(
        user.id,
        refreshToken,
        client,
      );
      return [accessToken, refreshToken];
    };
    const [accessToken, refreshToken] =
      await this.pgService.executeTransaction(callback);
    return new TokenOutput({
      accessToken,
      refreshToken,
    });
  }

  async logIn(input: LogInInput): Promise<TokenOutput> {
    const user = await this.userRepo.findUserByEmail(input.email);
    if (!user) {
      throw new HttpException(
        'invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!(await user.verifyPassword(input.password))) {
      throw new HttpException(
        'invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.genToken(
        new AccessTokenPayload({ userId: user.id }),
        this.configService.get('jwt.accessToken.secret')!,
        this.configService.get('jwt.accessToken.expiresIn')!,
      ),
      this.genToken(
        new RefreshTokenPayload({ userId: user.id }),
        this.configService.get<string>('jwt.refreshToken.secret')!,
        this.configService.get<number>('jwt.refreshToken.expiresIn')!,
      ),
    ]);
    await this.userRepo.updateCurrentRefreshTokenByUserId(
      user.id,
      refreshToken,
    );
    return new TokenOutput({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }
}
