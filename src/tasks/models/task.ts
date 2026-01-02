import { Expose, Type } from 'class-transformer';
import { BaseModel } from 'src/common/models/base_model';
import { TaskStatus } from './task_status';
import { TaskPriority } from './task_priority';
import { TaskAttachment } from './task_attachment';

export class Task extends BaseModel {
  @Expose()
  title: string;

  @Expose({ name: 'owner_id' })
  ownerId: number;

  @Expose({ name: 'project_id' })
  projectId: number;

  @Expose()
  status: TaskStatus;

  @Expose()
  priority: TaskPriority;

  @Expose({ name: 'category_ids' })
  categoryIds: number[];

  @Expose()
  @Type(() => TaskAttachment)
  attachments: TaskAttachment[];

  @Expose({ name: 'start_date' })
  @Type(() => Date)
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @Type(() => Date)
  endDate?: Date;

  @Expose()
  description?: string;
}
