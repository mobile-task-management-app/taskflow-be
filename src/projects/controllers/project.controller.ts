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
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
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
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';
import { GetUserProjectSummariesResponseDTO } from '../dtos/get_user_project_summaries.dto';
import { ProjectSummaryResponseDTO } from '../dtos/project_summary.dto';

@ApiTags('Projects')
@Controller('/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: AddProjectRequestDTO })
  @RegisterAppResponseModels(ProjectResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(ProjectResponseDTO),
  })
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
  @ApiOperation({ summary: 'Update an existing project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateProjectRequestDTO })
  @RegisterAppResponseModels(ProjectResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(ProjectResponseDTO),
  })
  @HttpCode(HttpStatus.OK) // Typically updates are OK (200) or No Content (204)
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

  @Get('/summaries')
  @ApiOperation({ summary: 'Get project summaries for a user' })
  @RegisterAppResponseModels(GetUserProjectSummariesResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(GetUserProjectSummariesResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async getUserProjectSummaries(@CurrentUserContext() user: UserContextType) {
    const output = await this.projectService.getUserProjectSummaries(user);
    return new AppResponseDTO({
      success: true,
      message: 'get project summaries success',
      data: new GetUserProjectSummariesResponseDTO({
        projectSummaries: output.map(
          (projectSummary) => new ProjectSummaryResponseDTO(projectSummary),
        ),
      }),
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get project details by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @RegisterAppResponseModels(ProjectResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(ProjectResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async getProjectById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.projectService.getProjectById(id, user);
    return new AppResponseDTO({
      success: true,
      message: 'get project success',
      data: new ProjectResponseDTO(output),
    });
  }

  @Get('')
  @ApiOperation({ summary: 'Search and filter projects' })
  @RegisterAppResponseModels(SearchProjectResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(SearchProjectResponseDTO),
  })
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
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiOkResponse({ type: AppResponseDTO })
  @HttpCode(HttpStatus.OK) // If returning a message, use OK. If returning nothing, use NO_CONTENT
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
