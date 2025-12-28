import { PartialType } from '@nestjs/mapped-types';
import { CreateTask } from './create_task';

export class UpdateTask extends PartialType(CreateTask) {
  constructor(args: Partial<UpdateTask>) {
    super();
    Object.assign(this, args);
  }
}
