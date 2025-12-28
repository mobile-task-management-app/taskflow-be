import { TaskOutput } from './task.output';

export class TaskAttachmentsUploadOutput extends TaskOutput {
  attachmentUrls: string[];
  constructor(args: Partial<TaskAttachmentsUploadOutput>) {
    super(args);
    Object.assign(this, args);
  }
}
