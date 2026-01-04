import { OmitType } from '@nestjs/mapped-types';
import { Task } from 'src/tasks/models/task';
import { TaskAttachmentOutput } from './task_attachment.output';

export class TaskOutput extends OmitType(Task, ['attachments'] as const) {
  attachments: TaskAttachmentOutput[];
  constructor(args: Partial<TaskOutput>) {
    super();
    Object.assign(this, args);
  }
}
