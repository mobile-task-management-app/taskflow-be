import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ProjectResponseDTO } from './project.dto';
import { CreateProjectInput } from '../services/inputs/create_project.input';

export class AddProjectRequestDTO {
  @Expose()
  @IsNotEmpty() // Makes field REQUIRED
  @IsString()
  name: string;

  @Expose()
  @IsOptional() // Makes field OPTIONAL
  @IsString()
  description?: string;

  @Expose({ name: 'start_date' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  endDate?: Date;
  toCreateProjectInput(): CreateProjectInput {
    return new CreateProjectInput({ ...this });
  }
}
