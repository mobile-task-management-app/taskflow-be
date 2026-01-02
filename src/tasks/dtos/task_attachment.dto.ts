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

  constructor(args: Partial<TaskAttachmentResponseDTO>) {
    Object.assign(this, args);
  }
}
