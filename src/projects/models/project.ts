import { BaseModel } from 'src/common/models/base_model';
import { ProjectStatus } from './project_status';
import { Expose, Transform, Type } from 'class-transformer';

export class Project extends BaseModel {
  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose({ name: 'owner_id' })
  ownerId: number;

  @Expose()
  status: ProjectStatus;

  @Expose({ name: 'start_date' })
  @Type(() => Date)
  startDate?: Date;

  @Expose({ name: 'end_date' })
  @Type(() => Date)
  endDate?: Date;
}
