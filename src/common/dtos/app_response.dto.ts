import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AppResponseDTO<T = any> {
  @Expose()
  @ApiProperty({ type: Boolean })
  success: boolean;

  @Expose()
  @ApiProperty({ type: String })
  message: string;

  @Expose()
  @ApiProperty({ nullable: true })
  data: T | null;

  constructor(options: Partial<AppResponseDTO<T>>) {
    this.success = options.success ?? true;
    this.message = options.message ?? '';
    this.data = options.data ?? null;
  }
}
