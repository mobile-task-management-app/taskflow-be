import { Expose, Transform, Type } from 'class-transformer';
import { TaskResponseDTO } from './task.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { PGQueryValue } from 'src/common/queries/pg.query';
import { parseRangeInput } from 'src/common/utils/queries.util';
import { TaskPriority } from '../models/task_priority';
import { TaskStatus } from '../models/task_status';
import { SearchTaskInput } from '../services/inputs/search_task.input';

export class SearchTaskRequestDTO {
  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter tasks by their current status',
  })
  @Expose()
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    description: 'Filter tasks by their priority',
  })
  @Expose()
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    name: 'category_id',
    type: Number,
    description: 'Filter by category ID',
  })
  @Expose({ name: 'category_id' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

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
    example: 'created_at',
    default: 'created_at',
    description: 'The field to sort the results by',
  })
  @Expose()
  @IsOptional()
  @IsString()
  sort: string = 'created_at';

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Sort order: true for ascending, false for descending',
  })
  @Expose()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  asc: boolean = false;

  constructor(args: Partial<SearchTaskRequestDTO>) {
    Object.assign(this, args);
  }

  toSearchTaskInput() {
    return new SearchTaskInput({
      ...this,
    });
  }
}

export class SearchTaskResponseDTO {
  @Expose()
  @Type(() => TaskResponseDTO)
  @ApiProperty({ type: [TaskResponseDTO] })
  tasks: TaskResponseDTO[];
  constructor(args: Partial<SearchTaskResponseDTO>) {
    Object.assign(this, args);
  }
}
