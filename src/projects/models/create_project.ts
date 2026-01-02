import { ProjectStatus } from './project_status';
import { PGMetaData } from 'src/common/queries/pg.query';

export class CreateProject {
  @PGMetaData({})
  name: string;

  @PGMetaData({ column: 'owner_id' })
  ownerId: number;

  @PGMetaData({})
  status: ProjectStatus;

  @PGMetaData({})
  description?: string;

  @PGMetaData({ column: 'start_date' })
  startDate?: Date;

  @PGMetaData({ column: 'end_date' })
  endDate?: Date;

  constructor(args: Partial<CreateProject>) {
    Object.assign(this, args);
  }
}
