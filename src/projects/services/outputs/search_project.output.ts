import { Project } from 'src/projects/models/project';

export class SearchProjectOutput extends Project {
  constructor(args: Partial<SearchProjectOutput>) {
    super();
    Object.assign(this, args);
  }
}
