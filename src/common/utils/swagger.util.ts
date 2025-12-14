import { getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { AppResponseDTO } from '../dtos/app_response.dto';
import { Type } from '@nestjs/common';

/**
 * Helper function to generate Swagger schema for AppResponseDTO with a specific data type
 * Usage: @ApiOkResponse({ schema: getAppResponseSchema(YourDTO) })
 * @param dataDTO The DTO class to use as the data type
 * @returns Object with schema definition and decorator helper
 */
export function getAppResponseSchema(dataDTO: Type<any>) {
  return {
    allOf: [
      { $ref: getSchemaPath(AppResponseDTO) },
      {
        properties: {
          data: { $ref: getSchemaPath(dataDTO) },
        },
      },
    ],
  };
}

/**
 * Helper decorator to register DTOs with Swagger
 * Usage: @RegisterAppResponseModels(YourDTO)
 */
export function RegisterAppResponseModels(...dtosToAdd: Type<any>[]) {
  return ApiExtraModels(AppResponseDTO, ...dtosToAdd);
}
