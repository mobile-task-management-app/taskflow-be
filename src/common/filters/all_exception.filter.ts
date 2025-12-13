import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AppResponseDTO } from '../dtos/app_response.dto';

@Catch(Error)
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.message || 'internal server error';

    this.logger.error(
      `unexpected Error ${status}: ${message}`,
      exception?.stack,
    );

    const errorResponse = new AppResponseDTO({
      success: false,
      message,
      data: null,
    });
    return response.status(status).json(errorResponse);
  }
}
