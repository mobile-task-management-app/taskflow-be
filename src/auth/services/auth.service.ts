import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/users/repositories/user.repository';
import { MailService } from 'src/mail/services/mail.service';
import { SignUpCommand } from './commands/sign_up.command';
import { randomInt } from 'crypto';
import { UserConfirmSignRepository } from '../repositories/user_confirm_sign_up.repository';
import { SignUpVerification } from 'src/mail/models/sign_up_verfication';
import { Token } from '../models/token';
import { CreateUser } from 'src/users/models/create_user';
import { PgService } from 'src/common/pg/pg.service';
import { PoolClient } from 'pg';
import { AccessTokenPayload } from '../models/access_token_payload';
import { RefreshTokenPayload } from '../models/refresh_token_payload';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

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
  async signUp(command: SignUpCommand) {
    const existUser = await this.userRepo.findUserByEmail(command.email);
    if (existUser) {
      throw new HttpException('user email exist', HttpStatus.BAD_REQUEST);
    }
    const otp = this.genOtp();
    const createUserConfirm = command.toCreateUSerConfirmSignUp({
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
  async verifyOtp(otp: string): Promise<Token> {
    const userConfirm = await this.userConfirmRepo.findByOtp(otp);
    if (!userConfirm) {
      throw new HttpException('otp invalid', HttpStatus.BAD_REQUEST);
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
      const user = await this.userRepo.createUser(createUser, client);
      await this.userConfirmRepo.deleteByOtp(otp, client);
      return user;
    };
    const user = await this.pgService.executeTransaction(callback);
    const [accessToken, refreshToken] = await Promise.all([
      this.genToken(
        new AccessTokenPayload({ userId: user.id }),
        this.configService.getOrThrow('jwt.accessToken.secret'),
        this.configService.getOrThrow('jwt.accessToken.expiresIn'),
      ),
      this.genToken(
        new RefreshTokenPayload({ userId: user.id }),
        this.configService.getOrThrow('jwt.refreshToken.secret'),
        this.configService.getOrThrow('jwt.refreshToken.expiresIn'),
      ),
    ]);
    return new Token({
      accessToken,
      refreshToken,
    });
  }
}
