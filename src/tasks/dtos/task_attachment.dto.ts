import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TaskAttachmentResponseDTO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  size: number;

  @Expose()
  @ApiProperty()
  extension: string;

  @Expose({ name: 'download_url' })
  @ApiPropertyOptional({ name: 'download_url' })
  downloadUrl?: string;

  @Expose({ name: 'upload_url' })
  @ApiPropertyOptional({ name: 'upload_url' })
  uploadUrl?: string;

  constructor(args: Partial<TaskAttachmentResponseDTO>) {
    Object.assign(this, args);
  }
}
