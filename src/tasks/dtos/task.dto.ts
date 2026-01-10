import { Expose, Transform, Type } from 'class-transformer';
import { TaskStatus } from '../models/task_status';
import { TaskPriority } from '../models/task_priority';
import { TaskAttachmentResponseDTO } from './task_attachment.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskResponseDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose({ name: 'owner_id' })
  @ApiProperty({ name: 'owner_id' })
  ownerId: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose({ name: 'project_id' })
  @ApiProperty({ name: 'project_id' })
  projectId: number;

  @Expose()
  @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
  status: TaskStatus;

  @Expose()
  @ApiProperty({ enum: TaskPriority, enumName: 'TaskPriority' })
  priority: TaskPriority;

  @Expose({ name: 'category_ids' })
  @ApiProperty({ name: 'category_ids', type: [Number] })
  categoryIds: number[];

  @Expose()
  @Type(() => TaskAttachmentResponseDTO)
  @ApiProperty({ type: [TaskAttachmentResponseDTO] })
  attachments: TaskAttachmentResponseDTO[];

  @ApiPropertyOptional({
    name: 'start_date',
    type: Number,
    example: 1704345731,
    description: 'Project start date as a Unix timestamp (seconds)',
  })
  @Expose({ name: 'start_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  startDate?: Date;

  @ApiPropertyOptional({
    name: 'end_date',
    type: Number,
    example: 1706937731,
    description: 'Project end date as a Unix timestamp (seconds)',
  })
  @Expose({ name: 'end_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  endDate?: Date;

  @Expose()
  @ApiProperty()
  description?: string;

  @Expose({ name: 'created_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  @ApiProperty({ name: 'created_at', type: Number })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  @ApiProperty({ name: 'updated_at', type: Number })
  updatedAt: Date;

  constructor(args: Partial<TaskResponseDTO>) {
    Object.assign(this, args);
    this.attachments =
      args.attachments?.map(
        (attachment) => new TaskAttachmentResponseDTO(attachment),
      ) || [];
  }
}
