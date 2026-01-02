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

export class UpdateTaskRequestDTO {
  @Expose()
  @IsString()
  @IsOptional()
  title?: string;

  @Expose()
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @Expose({ name: 'category_ids' })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @Expose({ name: 'start_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // Converts string input from JSON to Date object
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  toUpdateTaskInput(taskId: number) {
    return new UpdateTaskInput({
      ...this,
      id: taskId,
    });
  }
}
