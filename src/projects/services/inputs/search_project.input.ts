import {
  PGFilterMetaData,
  type PGQueryValue,
} from 'src/common/queries/pg.query';
import { ProjectStatus } from 'src/projects/models/project_status';

export class SearchProjectInput {
  @PGFilterMetaData({ column: 'status' })
  status?: ProjectStatus;

  @PGFilterMetaData({ column: 'start_date' })
  startDate?: PGQueryValue<Date>;

  @PGFilterMetaData({ column: 'end_date' })
  endDate?: PGQueryValue<Date>;

  @PGFilterMetaData({ column: 'owner_id' })
  ownerId?: number;

  // Sort and Asc are used for ORDER BY logic,
  // not the WHERE clause, so they usually don't need PG metadata.
  sort: string;
  asc: boolean;

  constructor(args: Partial<SearchProjectInput>) {
    Object.assign(this, args);
  }
}
