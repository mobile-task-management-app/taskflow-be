import { PartialType } from '@nestjs/mapped-types';
import { CreateProject } from './create_project';

export class UpdateProject extends PartialType(CreateProject) {
  constructor(args: Partial<UpdateProject>) {
    super();
    Object.assign(this, args);
  }
}
