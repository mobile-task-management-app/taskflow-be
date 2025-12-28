import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpRequestDTO } from '../dtos/sign_up.dto';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { VerifyOtpRequestDTO } from '../dtos/verify_otp.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenResponseDTO } from '../dtos/token.dto';
import { LogInRequestDTO } from '../dtos/log_in.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @ApiBody({ type: SignUpRequestDTO })
  @ApiOkResponse({ type: AppResponseDTO })
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpRequestDTO) {
    await this.authService.signUp(dto.toSignUpInput());

    return new AppResponseDTO({
      success: true,
      message: 'sign up success',
      data: null,
    });
  }

  @Public()
  @Post('/verify-otp')
  @ApiBody({ type: VerifyOtpRequestDTO })
  @RegisterAppResponseModels(TokenResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TokenResponseDTO),
  })
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(@Body() dto: VerifyOtpRequestDTO) {
    const output = await this.authService.verifyOtp(dto.otp);
    return new AppResponseDTO({
      success: true,
      message: 'verify otp success',
      data: new TokenResponseDTO({
        ...output,
      }),
    });
  }

  @Public()
  @Post('/log-in')
  @ApiBody({ type: LogInRequestDTO })
  @RegisterAppResponseModels(TokenResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TokenResponseDTO),
  })
  @HttpCode(HttpStatus.CREATED)
  async logIn(@Body() dto: LogInRequestDTO) {
    const output = await this.authService.logIn(dto.toLogInInput());
    return new AppResponseDTO({
      success: true,
      message: 'log in success',
      data: new TokenResponseDTO({
        ...output,
      }),
    });
  }
}
