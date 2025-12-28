import { Project } from 'src/projects/models/project';

export class UpdateProjectOutput extends Project {
  constructor(args: Partial<UpdateProjectOutput>) {
    super();
    Object.assign(this, args);
  }
}
