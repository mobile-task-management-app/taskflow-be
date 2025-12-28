import { Module } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { ProjectTaskService } from './services/project_task.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { StorageModule } from 'src/storage/storage.module';
import { ProjectTaskController } from './controllers/project_task.controller';

@Module({
  providers: [TaskRepository, ProjectTaskService],
  imports: [ProjectsModule, StorageModule],
  exports: [TaskRepository, ProjectTaskService],
  controllers: [ProjectTaskController],
})
export class TasksModule {}
