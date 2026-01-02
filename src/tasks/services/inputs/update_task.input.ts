import { TaskPriority } from 'src/tasks/models/task_priority';
import { TaskStatus } from 'src/tasks/models/task_status';
import { UpdateTask } from 'src/tasks/models/update_task';

export class UpdateTaskInput {
  id: number;
  title?: string;

  status?: TaskStatus;

  priority?: TaskPriority;

  categoryIds?: number[];

  startDate?: Date;

  endDate?: Date;

  description?: string;

  constructor(args: Partial<UpdateTaskInput>) {
    Object.assign(this, args);
  }
  toUpdateTask() {
    return new UpdateTask(this);
  }
}
