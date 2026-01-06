import { Expose } from 'class-transformer';
import { Project } from './project';

export class ProjectSummary extends Project {
  @Expose({ name: 'number_of_todo_tasks' })
  numberOfTodoTasks: number;
  @Expose({ name: 'num_of_in_progress_tasks' })
  numOfInProgressTasks: number;
  @Expose({ name: 'number_of_done_tasks' })
  numberOfDoneTasks: number;
  @Expose({ name: 'number_of_cancelled_tasks' })
  numberOfCancelledTasks: number;
  @Expose({ name: 'total_tasks' })
  totalTasks: number;
}
