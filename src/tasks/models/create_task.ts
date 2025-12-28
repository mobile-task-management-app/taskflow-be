import { TaskStatus } from './task_status';
import { TaskPriority } from './task_priority';
import { TaskAttachment } from './task_attachment';

export class CreateTask {
  title: string;

  projectId: number;

  status: TaskStatus;

  priority: TaskPriority;

  categoryIds: number[];

  attachments: TaskAttachment[];

  startDate?: Date;

  endDate?: Date;

  description?: string;

  constructor(args: Partial<CreateTask>) {
    Object.assign(this, args);
  }
}
