import { TaskAttachment } from 'src/tasks/models/task_attachment';

export class CreateTaskAttachmentInput {
  id: number;
  name: string;
  extension: string;
  size: number;

  constructor(args: Partial<CreateTaskAttachmentInput>) {
    Object.assign(this, args);
  }

  toAttachment(taskId: number, attachmentId: number): TaskAttachment {
    return new TaskAttachment({
      ...this,
      id: attachmentId,
      storageKey: `tasks/${taskId}/attachments/${attachmentId}/${taskId}_${attachmentId}.${this.extension}`,
    });
  }
}
