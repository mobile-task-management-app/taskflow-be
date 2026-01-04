import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'; // Use @nestjs/swagger version
import { AddProjectRequestDTO } from './add_project.dto';
import { ProjectStatus } from '../models/project_status';
import { Expose } from 'class-transformer';
import { IsOptional, IsEnum } from 'class-validator';
import { UpdateProjectInput } from '../services/inputs/update_project.input';

export class UpdateProjectRequestDTO extends PartialType(AddProjectRequestDTO) {
  @ApiPropertyOptional({
    enum: ProjectStatus,
    description: 'Update the current status of the project',
    example: ProjectStatus.NOT_YET,
  })
  @Expose()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  toUpdateProjectInput(): UpdateProjectInput {
    return new UpdateProjectInput({ ...this });
  }
}
