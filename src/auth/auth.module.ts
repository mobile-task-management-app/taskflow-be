import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './services/auth.service';
import { MailModule } from 'src/mail/mail.module';
import { UserConfirmSignRepository } from './repositories/user_confirm_sign_up.repository';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessToken.secret', { infer: true }),
        signOptions: {
          expiresIn: config.get<number>('jwt.accessToken.expiresIn', {
            infer: true,
          }),
        },
      }),
    }),
  ],
  providers: [AuthService, UserConfirmSignRepository],
  exports: [AuthService, UserConfirmSignRepository],
  controllers: [AuthController],
})
export class AuthModule {}
