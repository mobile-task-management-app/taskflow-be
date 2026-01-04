import {
  PGFilterMetaData,
  type PGQueryValue,
} from 'src/common/queries/pg.query';
import { TaskPriority } from 'src/tasks/models/task_priority';
import { TaskStatus } from 'src/tasks/models/task_status';

export class SearchProjectTaskInput {
  @PGFilterMetaData({ column: 'project_id' })
  projectId: number;

  @PGFilterMetaData({ column: 'status' })
  status?: TaskStatus;

  @PGFilterMetaData({ column: 'priority' })
  priority?: TaskPriority;

  @PGFilterMetaData({
    column: 'category_ids',
    isArrayField: true,
  })
  categoryId?: number;

  @PGFilterMetaData({ column: 'start_date' })
  startDate?: PGQueryValue<Date>;

  @PGFilterMetaData({ column: 'end_date' })
  endDate?: PGQueryValue<Date>;

  sort: string;
  asc: boolean;

  constructor(args: Partial<SearchProjectTaskInput>) {
    Object.assign(this, args);
  }
}
