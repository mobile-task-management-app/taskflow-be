export class TaskAttachmentOutput {
  id: number;

  name: string;

  size: number;

  extension: string;

  uploadUrl?: string;

  downloadUrl?: string;

  constructor(args: Partial<TaskAttachmentOutput>) {
    Object.assign(this, args);
  }
}
