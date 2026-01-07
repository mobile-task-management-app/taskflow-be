import { TaskPriority } from 'src/tasks/models/task_priority';
import { CreateTaskAttachmentInput } from './create_task_attachment.input';
import { CreateTask } from 'src/tasks/models/create_task';
import { TaskStatus } from 'src/tasks/models/task_status';

export class CreateProjectTaskInput {
  title: string;

  projectId: number;

  priority: TaskPriority;

  status: TaskStatus;

  categoryIds: number[];

  attachments: CreateTaskAttachmentInput[];

  startDate?: Date;

  endDate?: Date;

  description?: string;

  constructor(args: Partial<CreateProjectTaskInput>) {
    Object.assign(this, args);
  }

  toCreateTask(ownerId: number): CreateTask {
    return new CreateTask({
      ...this,
      attachments: [],
      ownerId,
    });
  }
}
