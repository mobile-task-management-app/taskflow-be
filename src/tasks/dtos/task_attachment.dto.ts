import { Expose } from 'class-transformer';

export class TaskAttachmentResponseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  size: number;

  @Expose()
  extension: string;

  @Expose({ name: 'download_url' })
  downloadUrl?: string;

  @Expose({ name: 'upload_url' })
  uploadUrl?: string;

  constructor(args: Partial<TaskAttachmentResponseDTO>) {
    Object.assign(this, args);
  }
}
