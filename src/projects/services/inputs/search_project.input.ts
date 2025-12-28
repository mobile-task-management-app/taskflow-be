import { Expose, Transform } from 'class-transformer';
import { ProjectStatus } from 'src/projects/models/project_status';
import { type PGQueryValue } from 'src/common/queries/pg.query';
import { parseRangeInput } from 'src/common/utils/queries.util';

export class SearchProjectInput {
  @Expose()
  status?: ProjectStatus;

  @Expose({ name: 'start_date' })
  startDate?: PGQueryValue<Date>;

  @Expose({ name: 'end_date' })
  endDate?: PGQueryValue<Date>;

  @Expose({ name: 'owner_id' })
  ownerId?: number;

  sort: string;

  asc: boolean;

  constructor(args: Partial<SearchProjectInput>) {
    Object.assign(this, args);
  }
}
