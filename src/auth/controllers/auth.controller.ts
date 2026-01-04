import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'; // Added ApiOperation and ApiTags
import { AuthService } from '../services/auth.service';
import { SignUpRequestDTO } from '../dtos/sign_up.dto';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { VerifyOtpRequestDTO } from '../dtos/verify_otp.dto';
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';
import { Public } from 'src/common/decorators/public.decorator';
import { TokenResponseDTO } from '../dtos/token.dto';
import { LogInRequestDTO } from '../dtos/log_in.dto';

@ApiTags('Authentication') // Groups all routes under "Authentication" in Swagger UI
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/sign-up')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a user account and triggers an OTP verification email/SMS.',
  })
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
  @ApiOperation({
    summary: 'Verify OTP code',
    description:
      'Validates the 6-digit code sent to the user and returns access tokens.',
  })
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
  @ApiOperation({
    summary: 'User Login',
    description:
      'Authenticates user credentials and returns a JWT token if successful.',
  })
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
