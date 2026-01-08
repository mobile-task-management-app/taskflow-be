import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UserConfirmSignRepository } from 'src/auth/repositories/user_confirm_sign_up.repository';
import { MailService } from 'src/mail/services/mail.service';
import { PgService } from 'src/common/pg/pg.service';
import { SignUpInput } from 'src/auth/services/inputs/sign_up.input';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<UserRepository>;
  let userConfirmRepo: jest.Mocked<UserConfirmSignRepository>;
  let mailService: jest.Mocked<MailService>;
  let pgService: jest.Mocked<PgService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Define Mock Objects
    const mockUserRepo = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateCurrentRefreshTokenByUserId: jest.fn(),
    };
    const mockUserConfirmRepo = {
      create: jest.fn(),
      findByOtp: jest.fn(),
      deleteByOtp: jest.fn(),
    };
    const mockMailService = { sendSignUpVerificationMail: jest.fn() };
    const mockPgService = { executeTransaction: jest.fn() };
    const mockJwtService = { signAsync: jest.fn() };
    const mockConfigService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: UserConfirmSignRepository, useValue: mockUserConfirmRepo },
        { provide: MailService, useValue: mockMailService },
        { provide: PgService, useValue: mockPgService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(UserRepository);
    userConfirmRepo = module.get(UserConfirmSignRepository);
    mailService = module.get(MailService);
    pgService = module.get(PgService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  describe('signUp', () => {
    const signUpInput = new SignUpInput({});
    signUpInput.email = 'test@example.com';
    // Assuming toCreateUserConfirmSignUp is a method on the input
    signUpInput.toCreateUserConfirmSignUp = jest.fn().mockReturnValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      otp: '123456',
    });

    it('should throw error if user already exists', async () => {
      userRepo.findUserByEmail.mockResolvedValue({ id: '1' } as any);

      await expect(service.signUp(signUpInput)).rejects.toThrow(
        new HttpException('user email exist', HttpStatus.BAD_REQUEST),
      );
    });

    it('should create a confirmation record and send an email', async () => {
      userRepo.findUserByEmail.mockResolvedValue(null);
      const mockConfirm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        otp: '123456',
      };
      userConfirmRepo.create.mockResolvedValue(mockConfirm as any);

      await service.signUp(signUpInput);

      expect(userConfirmRepo.create).toHaveBeenCalled();
      expect(mailService.sendSignUpVerificationMail).toHaveBeenCalledWith(
        mockConfirm.email,
        expect.any(Object),
      );
    });
  });

  describe('genToken', () => {
    it('should throw error if expireIn is 0 or less', async () => {
      await expect(service.genToken({} as any, 'secret', 0)).rejects.toThrow(
        new HttpException(
          'expireIn must be greater than 0',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });

    it('should return a signed token', async () => {
      jwtService.signAsync.mockResolvedValue('signed-token');
      const token = await service.genToken({ userId: 1 }, 'secret', 3600);
      expect(token).toBe('signed-token');
    });
  });

  describe('verifyOtp', () => {
    it('should throw error if OTP is invalid', async () => {
      userConfirmRepo.findByOtp.mockResolvedValue(null);
      await expect(service.verifyOtp('wrong-otp')).rejects.toThrow(
        'otp invalid',
      );
    });

    it('should throw error if OTP is expired', async () => {
      userConfirmRepo.findByOtp.mockResolvedValue({
        expireAt: new Date(Date.now() - 1000),
      } as any);
      await expect(service.verifyOtp('expired-otp')).rejects.toThrow(
        'OTP expired',
      );
    });

    it('should execute transaction and return tokens if OTP is valid', async () => {
      // Mock valid user confirmation
      const mockConfirm = {
        firstName: 'John',
        email: 'test@example.com',
        expireAt: new Date(Date.now() + 10000),
      };
      userConfirmRepo.findByOtp.mockResolvedValue(mockConfirm as any);

      // Mock the transaction wrapper to simply execute the callback
      pgService.executeTransaction.mockImplementation(
        async (cb) => await cb({} as any),
      );

      // Mock internal methods
      userRepo.createUser.mockResolvedValue({ id: 'user-1' } as any);
      configService.get.mockReturnValue('secret-or-time');
      jwtService.signAsync.mockResolvedValue('token-string');

      const result = await service.verifyOtp('valid-otp');

      expect(result.accessToken).toBe('token-string');
      expect(pgService.executeTransaction).toHaveBeenCalled();
      expect(userRepo.updateCurrentRefreshTokenByUserId).toHaveBeenCalled();
    });
  });
});
