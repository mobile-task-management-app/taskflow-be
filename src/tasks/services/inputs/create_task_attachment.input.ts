import { TaskAttachment } from 'src/tasks/models/task_attachment';

export class CreateTaskAttachmentInput {
  name: string;
  extension: string;
  size: number;

  constructor(args: Partial<CreateTaskAttachmentInput>) {
    Object.assign(this, args);
  }

  toAttachment(storageKey: string): TaskAttachment {
    return new TaskAttachment({
      ...this,
      storageKey: storageKey,
    });
  }
}
