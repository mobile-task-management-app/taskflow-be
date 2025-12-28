import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AddProjectRequestDTO } from '../dtos/add_project.dto';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import type { UserContextType } from 'src/common/types/user_context.type';
import { ProjectService } from '../services/project.service';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { UpdateProjectRequestDTO } from '../dtos/update_project.dto';
import {
  SearchProjectRequestDTO,
  SearchProjectResponseDTO,
} from '../dtos/search_project.dto';
import { ProjectResponseDTO } from '../dtos/project.dto';

@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async addProject(
    @Body() dto: AddProjectRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.projectService.createProject(
      dto.toCreateProjectInput(),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'create project success',
      data: new ProjectResponseDTO(output),
    });
  }
  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const input = dto.toUpdateProjectInput();
    input.id = id;
    const output = await this.projectService.updateProject(input, user);
    return new AppResponseDTO({
      success: true,
      message: 'update project success',
      data: new ProjectResponseDTO(output),
    });
  }
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getProjectById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.projectService.getProjectById(id, user);
    return new AppResponseDTO({
      success: true,
      message: 'update project success',
      data: new ProjectResponseDTO(output),
    });
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async searchProject(
    @Query() dto: SearchProjectRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.projectService.searchProject(
      dto.toSearchProjectInput(),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'search project success',
      data: new SearchProjectResponseDTO({
        projects: output.map((project) => new ProjectResponseDTO(project)),
      }),
    });
  }
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserContext() user: UserContextType,
  ) {
    await this.projectService.deleteProject(id, user);
    return new AppResponseDTO({
      success: true,
      message: 'delete project success',
    });
  }
}
