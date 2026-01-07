import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTaskAttachmentRequestDTO {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  size: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  extension: string;
}
