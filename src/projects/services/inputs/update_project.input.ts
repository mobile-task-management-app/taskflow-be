import { ProjectStatus } from 'src/projects/models/project_status';
import { UpdateProject } from 'src/projects/models/update_project';

export class UpdateProjectInput {
  id: number;
  name?: string;

  description?: string;

  status: ProjectStatus;

  startDate?: Date;

  endDate?: Date;
  constructor(args: Partial<UpdateProjectInput>) {
    Object.assign(this, args);
  }

  toUpdateProject(): UpdateProject {
    return new UpdateProject({ ...this });
  }
}
