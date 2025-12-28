import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { CreateProjectInput } from './inputs/create_project.input';
import { UserContextType } from 'src/common/types/user_context.type';
import { CreateProjectOutput } from './outputs/create_project.output';
import { ProjectStatus } from '../models/project_status';
import { SearchProjectInput } from './inputs/search_project.input';
import { SearchProjectOutput } from './outputs/search_project.output';
import { UpdateProjectInput } from './inputs/update_project.input';
import { UpdateProjectOutput } from './outputs/update_project.output';
import { GetProjectByIdOutput } from './outputs/get_project_by_id.output';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(
    input: CreateProjectInput,
    user: UserContextType,
  ): Promise<CreateProjectOutput> {
    const createProjectData = input.toCreateProject(
      user.id,
      ProjectStatus.NOT_YET,
    );
    const newProject =
      await this.projectRepository.createProject(createProjectData);
    return new CreateProjectOutput({ ...newProject });
  }

  async searchProject(
    input: SearchProjectInput,
    user: UserContextType,
  ): Promise<SearchProjectOutput[]> {
    input.ownerId = user.id;
    const projects = await this.projectRepository.searchProject(input);
    return projects.map((project) => new SearchProjectOutput({ ...project }));
  }

  async updateProject(
    input: UpdateProjectInput,
    user: UserContextType,
  ): Promise<UpdateProjectOutput> {
    const project = await this.projectRepository.findProjectById(input.id);
    if (!project) {
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);
    }
    if (project.ownerId !== user.id) {
      throw new HttpException('permission denined', HttpStatus.FORBIDDEN);
    }
    const updateProjectData = input.toUpdateProject();
    const updatedProject = await this.projectRepository.updateProject(
      project.id,
      updateProjectData,
    );
    return new UpdateProjectOutput({ ...updatedProject });
  }
  async getProjectById(
    id: number,
    user: UserContextType,
  ): Promise<GetProjectByIdOutput> {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);
    }
    if (project.ownerId !== user.id) {
      throw new HttpException('permission denined', HttpStatus.FORBIDDEN);
    }
    return new GetProjectByIdOutput({ ...project });
  }

  async deleteProject(id: number, user: UserContextType) {
    const project = await this.projectRepository.findProjectById(id);
    if (!project) {
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);
    }
    if (project.ownerId !== user.id) {
      throw new HttpException('permission denined', HttpStatus.FORBIDDEN);
    }
    await this.projectRepository.deleteProject(id);
  }
}
