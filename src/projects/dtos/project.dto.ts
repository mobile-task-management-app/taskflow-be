import { Expose, Transform, Type } from 'class-transformer';
import { ProjectStatus } from '../models/project_status';

export class ProjectResponseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose({ name: 'owner_id' })
  ownerId: number;

  @Expose()
  status: ProjectStatus;

  @Expose({ name: 'start_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true, // Handles Class (Date) -> JSON (Unix Number)
    },
  )
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  endDate?: Date;

  @Expose({ name: 'created_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  @Transform(
    ({ value }) =>
      value instanceof Date ? Math.floor(value.getTime() / 1000) : value,
    {
      toPlainOnly: true,
    },
  )
  updatedAt: Date;

  constructor(args: Partial<ProjectResponseDTO>) {
    Object.assign(this, args);
  }
}
