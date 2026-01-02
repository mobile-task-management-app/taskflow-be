import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { PGQueryValue } from 'src/common/queries/pg.query';
import { parseRangeInput } from 'src/common/utils/queries.util';
import { TaskPriority } from 'src/tasks/models/task_priority';
import { TaskStatus } from 'src/tasks/models/task_status';
import { SearchProjectTaskInput } from '../services/inputs/search_project_task.input';
import { TaskResponseDTO } from './task.dto';

export class SearchProjectTaskRequestDTO {
  @Expose()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Expose()
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Expose({ name: 'category_id' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

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
  sort: string = 'created_at';

  @Expose()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  asc: boolean = false;

  constructor(args: Partial<SearchProjectTaskRequestDTO>) {
    Object.assign(this, args);
  }

  toSearchProjectTaskInput(projectId: number) {
    return new SearchProjectTaskInput({
      ...this,
      projectId: projectId,
    });
  }
}

export class SearchProjectTaskResponseDTO {
  @Expose()
  @Type(() => TaskResponseDTO)
  tasks: TaskResponseDTO[];
  constructor(args: Partial<SearchProjectTaskResponseDTO>) {
    Object.assign(this, args);
  }
}
