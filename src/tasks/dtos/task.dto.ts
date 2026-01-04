import { Expose, Transform, Type } from 'class-transformer';
import { TaskStatus } from '../models/task_status';
import { TaskPriority } from '../models/task_priority';
import { TaskAttachmentResponseDTO } from './task_attachment.dto';

export class TaskResponseDTO {
  @Expose()
  id: number;

  @Expose({ name: 'owner_id' })
  ownerId: number;

  @Expose()
  title: string;

  @Expose({ name: 'project_id' })
  projectId: number;

  @Expose()
  status: TaskStatus;

  @Expose()
  priority: TaskPriority;

  @Expose({ name: 'category_ids' })
  categoryIds: number[];

  @Expose()
  @Type(() => TaskAttachmentResponseDTO)
  attachments: TaskAttachmentResponseDTO[];

  @Expose({ name: 'start_date' })
  @Type(() => Date)
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @Type(() => Date)
  endDate?: Date;

  @Expose()
  description?: string;

  @Expose({ name: 'created_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  updatedAt: Date;

  constructor(args: Partial<TaskResponseDTO>) {
    Object.assign(this, args);
    this.attachments = args.attachments!.map(
      (attachment) => new TaskAttachmentResponseDTO(attachment),
    );
  }
}
