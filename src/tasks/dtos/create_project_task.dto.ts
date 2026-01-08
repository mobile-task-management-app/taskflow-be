import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  IsDate,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { TaskPriority } from '../models/task_priority';
import { CreateTaskAttachmentRequestDTO } from './create_task_attachment.dto';
import { CreateProjectTaskInput } from '../services/inputs/create_project_task.input';
import { CreateTaskAttachmentInput } from '../services/inputs/create_task_attachment.input';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../models/task_status';

export class CreateProjectTaskRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @Expose()
  @IsEnum(TaskPriority)
  @ApiProperty({ enum: TaskPriority, enumName: 'TaskPriority' })
  priority: TaskPriority;

  @Expose()
  @IsEnum(TaskStatus)
  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;

  @Expose({ name: 'category_ids' })
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiProperty({ name: 'category_ids', type: [Number] })
  categoryIds: number[];

  @Expose()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // Essential for nested validation
  @Type(() => CreateTaskAttachmentRequestDTO) // Tells transformer which class to use
  @ApiProperty({ type: [CreateTaskAttachmentRequestDTO] })
  attachments: CreateTaskAttachmentRequestDTO[];

  @Expose({ name: 'start_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date) // Converts string input from JSON to Date object
  @ApiPropertyOptional({ name: 'start_date', type: Number })
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ name: 'end_date', type: Number })
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  endDate?: Date;

  @Expose()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  toCreateTaskProjectInput(projectId: number): CreateProjectTaskInput {
    return new CreateProjectTaskInput({
      ...this,
      projectId: projectId,
      attachments:
        this.attachments?.map(
          (attachment) => new CreateTaskAttachmentInput({ ...attachment }),
        ) || [],
    });
  }
}
