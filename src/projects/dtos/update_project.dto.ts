import { OmitType, PartialType } from '@nestjs/mapped-types';
import { AddProjectRequestDTO } from './add_project.dto';
import { ProjectStatus } from '../models/project_status';
import { Expose } from 'class-transformer';
import { IsOptional, IsEnum } from 'class-validator';
import { ProjectResponseDTO } from './project.dto';
import { UpdateProjectInput } from '../services/inputs/update_project.input';

export class UpdateProjectRequestDTO extends PartialType(AddProjectRequestDTO) {
  @Expose()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
  toUpdateProjectInput(): UpdateProjectInput {
    return new UpdateProjectInput({ ...this });
  }
}
