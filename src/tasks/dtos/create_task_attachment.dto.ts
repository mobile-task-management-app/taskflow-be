import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTaskAttachmentRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsNumber()
  size: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  extension: string;
}
