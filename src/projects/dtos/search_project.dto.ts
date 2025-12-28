import { Expose, Transform, Type } from 'class-transformer';
import { IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { ProjectStatus } from 'src/projects/models/project_status';
import { type PGQueryValue } from 'src/common/queries/pg.query';
import { parseRangeInput } from 'src/common/utils/queries.util';
import { SearchProjectInput } from '../services/inputs/search_project.input';
import { ProjectResponseDTO } from './project.dto';

export class SearchProjectRequestDTO {
  @Expose()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Expose({ name: 'start_date' })
  @IsOptional()
  @Transform(({ value }) => parseRangeInput(value), { toClassOnly: true })
  startDate?: PGQueryValue<Date>;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @Transform(({ value }) => parseRangeInput(value), { toClassOnly: true })
  endDate?: PGQueryValue<Date>;

  @Expose()
  @IsOptional()
  @IsString()
  sort?: string = 'created_at';

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  asc?: boolean = false;

  toSearchProjectInput(): SearchProjectInput {
    return new SearchProjectInput({
      ...this,
    });
  }
}

export class SearchProjectResponseDTO {
  @Expose()
  @Type(() => ProjectResponseDTO)
  projects: ProjectResponseDTO[];
  constructor(args: Partial<SearchProjectResponseDTO>) {
    Object.assign(this, args);
  }
}
