import { Project } from 'src/projects/models/project';

export class CreateProjectOutput extends Project {
  constructor(args: Partial<CreateProjectOutput>) {
    super();
    Object.assign(this, args);
  }
}
