import { Module } from '@nestjs/common';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

@Module({
  providers: [ProjectRepository, ProjectService],
  exports: [ProjectRepository, ProjectService],
  controllers: [ProjectController],
})
export class ProjectsModule {}
