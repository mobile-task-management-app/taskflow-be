import { Expose, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../models/project_status';

export class ProjectResponseDTO {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the project',
  })
  @Expose()
  id: number;

  @ApiProperty({
    example: 'Mobile App Revamp',
    description: 'Name of the project',
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    example: 'A project to update the UI/UX of our main app.',
    description: 'A brief description of the project',
  })
  @Expose()
  description?: string;

  @ApiProperty({
    name: 'owner_id',
    example: 123,
    description: 'The ID of the user who owns the project',
  })
  @Expose({ name: 'owner_id' })
  ownerId: number;

  @ApiProperty({
    enum: ProjectStatus,
    enumName: 'ProjectStatus',
    description: 'Current status of the project',
  })
  @Expose()
  status: ProjectStatus;

  @ApiPropertyOptional({
    name: 'start_date',
    type: Number,
    example: 1704345731,
    description: 'Project start date as a Unix timestamp (seconds)',
  })
  @Expose({ name: 'start_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  startDate?: Date;

  @ApiPropertyOptional({
    name: 'end_date',
    type: Number,
    example: 1706937731,
    description: 'Project end date as a Unix timestamp (seconds)',
  })
  @Expose({ name: 'end_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  endDate?: Date;

  @ApiProperty({
    name: 'created_at',
    type: Number,
    example: 1704067200,
    description: 'Creation timestamp',
  })
  @Expose({ name: 'created_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    type: Number,
    example: 1704153600,
    description: 'Last update timestamp',
  })
  @Expose({ name: 'updated_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    { toPlainOnly: true },
  )
  updatedAt: Date;

  constructor(args: Partial<ProjectResponseDTO>) {
    Object.assign(this, args);
  }
}
