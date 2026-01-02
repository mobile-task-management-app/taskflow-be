import { Expose, Type } from 'class-transformer';
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

export class CreateProjectTaskRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Expose({ name: 'category_ids' })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @Expose()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true }) // Essential for nested validation
  @Type(() => CreateTaskAttachmentRequestDTO) // Tells transformer which class to use
  attachments: CreateTaskAttachmentRequestDTO[];

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
