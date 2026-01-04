import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt_auth.guard';
import { UserService } from '../services/user.service';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import { UserResponseDTO } from '../dtos/user.dto';
import type { UserContextType } from 'src/common/types/user_context.type';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard) // Protect the route
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @RegisterAppResponseModels(UserResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(UserResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUserContext() userContext: UserContextType) {
    const output = await this.userService.getUserProfile(userContext);
    return new AppResponseDTO({
      success: true,
      message: 'get user profile success',
      data: new UserResponseDTO(output),
    });
  }
}
