import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from 'src/projects/models/project_status';
import { type PGQueryValue } from 'src/common/queries/pg.query';
import { parseRangeInput } from 'src/common/utils/queries.util';
import { SearchProjectInput } from '../services/inputs/search_project.input';
import { ProjectResponseDTO } from './project.dto';

export class SearchProjectRequestDTO {
  @ApiPropertyOptional({
    enum: ProjectStatus,
    description: 'Filter projects by their current status',
  })
  @Expose()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    name: 'start_date',
    description:
      'Filter by start date. Supports single Unix timestamp or range (min,max)',
    example: '1704345731,1706937731',
    type: String,
  })
  @Expose({ name: 'start_date' })
  @IsOptional()
  @Transform(({ value }) => parseRangeInput(value), { toClassOnly: true })
  startDate?: PGQueryValue<Date>;

  @ApiPropertyOptional({
    name: 'end_date',
    description:
      'Filter by end date. Supports single Unix timestamp or range (min,max)',
    example: '1704345731',
    type: String,
  })
  @Expose({ name: 'end_date' })
  @IsOptional()
  @Transform(({ value }) => parseRangeInput(value), { toClassOnly: true })
  endDate?: PGQueryValue<Date>;

  @ApiPropertyOptional({
    example: 'name',
    default: 'created_at',
    description: 'The field to sort the results by',
  })
  @Expose()
  @IsOptional()
  @IsString()
  sort?: string = 'created_at';

  @ApiPropertyOptional({
    example: true,
    default: false,
    description: 'Sort order: true for ascending, false for descending',
  })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  asc?: boolean = false;

  toSearchProjectInput(): SearchProjectInput {
    return new SearchProjectInput({ ...this });
  }
}

export class SearchProjectResponseDTO {
  @ApiProperty({
    type: [ProjectResponseDTO], // Important for nested array documentation
    description: 'List of projects matching the search criteria',
  })
  @Expose()
  @Type(() => ProjectResponseDTO)
  projects: ProjectResponseDTO[];

  constructor(args: Partial<SearchProjectResponseDTO>) {
    Object.assign(this, args);
  }
}
