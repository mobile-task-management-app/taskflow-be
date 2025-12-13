import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpRequestDTO } from '../dtos/sign_up.dto';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import {
  VerifyOtpRequestDTO,
  VerifyOtpResponseDTO,
} from '../dtos/verify_otp.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() dto: SignUpRequestDTO) {
    await this.authService.signUp(dto.toSignUpInput());

    return new AppResponseDTO({
      success: true,
      message: 'sign up success',
      data: null,
    });
  }
  @Post('/verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpRequestDTO) {
    const output = await this.authService.verifyOtp(dto.otp);
    return new AppResponseDTO({
      success: true,
      message: 'verify otp success',
      data: new VerifyOtpResponseDTO({
        ...output,
      }),
    });
  }
}
