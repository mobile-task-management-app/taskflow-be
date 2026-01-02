import { CreateTaskAttachmentInput } from './create_task_attachment.input';

export class BulkAddTaskAttachmentInput {
  id: number;
  attachments: CreateTaskAttachmentInput[];

  constructor(args: Partial<BulkAddTaskAttachmentInput>) {
    Object.assign(this, args);
  }
}
