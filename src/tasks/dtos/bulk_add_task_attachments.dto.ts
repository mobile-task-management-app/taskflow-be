import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateTaskAttachmentRequestDTO } from './create_task_attachment.dto';
import { BulkAddTaskAttachmentInput } from '../services/inputs/bulk_add_task_attachments.input';
import { CreateTaskAttachmentInput } from '../services/inputs/create_task_attachment.input';

export class BulkAddTaskAttachmentsRequestDTO {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true }) // Essential for nested validation
  @Type(() => CreateTaskAttachmentRequestDTO) // Tells transformer which class to use
  attachments: CreateTaskAttachmentRequestDTO[];

  toBulkAddTaskAttachmentsInput(taskId: number) {
    return new BulkAddTaskAttachmentInput({
      id: taskId,
      attachments:
        this.attachments?.map(
          (attachment) => new CreateTaskAttachmentInput({ ...attachment }),
        ) || [],
    });
  }
}
