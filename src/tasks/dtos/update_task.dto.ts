import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority } from '../models/task_priority';
import { UpdateTaskInput } from '../services/inputs/update_task.input';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../models/task_status';

export class UpdateTaskRequestDTO {
  @Expose()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  title?: string;

  @Expose()
  @IsEnum(TaskPriority)
  @IsOptional()
  @ApiPropertyOptional({ enum: TaskPriority, enumName: 'TaskPriority' })
  priority?: TaskPriority;

  @Expose()
  @IsEnum(TaskStatus)
  @IsOptional()
  @ApiPropertyOptional({ enum: TaskStatus, enumName: 'TaskStatus' })
  status?: TaskStatus;

  @Expose({ name: 'category_ids' })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ name: 'category_ids', type: [Number] })
  categoryIds?: number[];

  @Expose({ name: 'start_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // Converts string input from JSON to Date object
  @ApiPropertyOptional({ name: 'start_date', type: Number })
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ name: 'end_date', type: Number })
  endDate?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  toUpdateTaskInput(taskId: number) {
    return new UpdateTaskInput({
      ...this,
      id: taskId,
    });
  }
}
