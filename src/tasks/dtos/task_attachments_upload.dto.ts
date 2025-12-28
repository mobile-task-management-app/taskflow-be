import { Expose } from 'class-transformer';
import { TaskResponseDTO } from './task.dto';

export class TaskAttachmentsUploadResponseDTO extends TaskResponseDTO {
  @Expose({ name: 'attachment_urls' })
  attachmentUrls: string[];
  constructor(args: Partial<TaskAttachmentsUploadResponseDTO>) {
    super(args);
    Object.assign(this, args);
  }
}
