import { Expose } from 'class-transformer';
import { ProjectResponseDTO } from './project.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectSummaryResponseDTO extends ProjectResponseDTO {
  @ApiProperty({ name: 'number_of_todo_tasks' })
  @Expose({ name: 'number_of_todo_tasks' })
  numberOfTodoTasks: number;

  @ApiProperty({ name: 'num_of_in_progress_tasks' })
  @Expose({ name: 'num_of_in_progress_tasks' })
  numOfInProgressTasks: number;

  @ApiProperty({ name: 'number_of_done_tasks' })
  @Expose({ name: 'number_of_done_tasks' })
  numberOfDoneTasks: number;

  @ApiProperty({ name: 'number_of_cancelled_tasks' })
  @Expose({ name: 'number_of_cancelled_tasks' })
  numberOfCancelledTasks: number;

  @ApiProperty({ name: 'total_tasks' })
  @Expose({ name: 'total_tasks' })
  totalTasks: number;
  constructor(args: Partial<ProjectSummaryResponseDTO>) {
    super(args);
    Object.assign(this, args);
  }
}
