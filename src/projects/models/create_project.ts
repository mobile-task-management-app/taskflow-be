import { Expose } from 'class-transformer';
import { ProjectStatus } from './project_status';

export class CreateProject {
  @Expose()
  name: string;

  @Expose({ name: 'owner_id' })
  ownerId: number;

  @Expose()
  status: ProjectStatus;

  @Expose()
  description?: string;

  @Expose({ name: 'start_date' })
  startDate?: Date;

  @Expose({ name: 'end_date' })
  endDate?: Date;

  constructor(args: Partial<CreateProject>) {
    Object.assign(this, args);
  }
}
