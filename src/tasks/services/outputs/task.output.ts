import { Task } from 'src/tasks/models/task';

export class TaskOutput extends Task {
  constructor(args: Partial<TaskOutput>) {
    super();
    Object.assign(this, args);
  }
}
