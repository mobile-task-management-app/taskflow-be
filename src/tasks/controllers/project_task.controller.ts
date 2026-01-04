import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import { CreateProjectTaskRequestDTO } from '../dtos/create_project_task.dto';
import type { UserContextType } from 'src/common/types/user_context.type';
import { ProjectTaskService } from '../services/project_task.service';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { TaskAttachmentsUploadResponseDTO } from '../dtos/task_attachments_upload.dto';
import {
  SearchProjectTaskRequestDTO,
  SearchProjectTaskResponseDTO,
} from '../dtos/search_project_task.dto';
import { TaskResponseDTO } from '../dtos/task.dto';
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';

@ApiTags('Project Tasks')
@ApiBearerAuth()
@Controller('projects/:id/tasks')
export class ProjectTaskController {
  constructor(private readonly projectTaskService: ProjectTaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task within a project' })
  @ApiParam({ name: 'id', description: 'The ID of the project', type: Number })
  @ApiBody({ type: CreateProjectTaskRequestDTO })
  @RegisterAppResponseModels(TaskAttachmentsUploadResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TaskAttachmentsUploadResponseDTO),
  })
  @HttpCode(HttpStatus.CREATED)
  async createProjectTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProjectTaskRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.projectTaskService.createProjectTask(
      dto.toCreateTaskProjectInput(id),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'create task success',
      data: new TaskAttachmentsUploadResponseDTO(output),
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Search and filter tasks within a specific project',
  })
  @ApiParam({ name: 'id', description: 'The ID of the project', type: Number })
  @RegisterAppResponseModels(SearchProjectTaskResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(SearchProjectTaskResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async searchProjectTasks(
    @Param('id', ParseIntPipe) id: number,
    @Query() queries: SearchProjectTaskRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const tasks = await this.projectTaskService.searchProjectTask(
      queries.toSearchProjectTaskInput(id),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'search project tasks success',
      data: new SearchProjectTaskResponseDTO({
        tasks: tasks.map((task) => new TaskResponseDTO(task)),
      }),
    });
  }
}
