import { ProjectSummary } from 'src/projects/models/project_summary';

export class ProjectSummaryOutput extends ProjectSummary {
  constructor(args: Partial<ProjectSummaryOutput>) {
    super();
    Object.assign(this, args);
  }
}
