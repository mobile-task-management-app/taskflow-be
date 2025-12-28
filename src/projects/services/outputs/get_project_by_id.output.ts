import { Project } from 'src/projects/models/project';

export class GetProjectByIdOutput extends Project {
  constructor(args: Partial<GetProjectByIdOutput>) {
    super();
    Object.assign(this, args);
  }
}
