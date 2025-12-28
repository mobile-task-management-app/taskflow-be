import { CreateProject } from 'src/projects/models/create_project';
import { ProjectStatus } from 'src/projects/models/project_status';

export class CreateProjectInput {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;

  constructor(args: Partial<CreateProjectInput>) {
    Object.assign(this, args);
  }

  toCreateProject(ownerId: number, status: ProjectStatus): CreateProject {
    return new CreateProject({
      ...this,
      ownerId: ownerId,
      status: status,
    });
  }
}
