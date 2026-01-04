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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { UpdateTaskRequestDTO } from '../dtos/update_task.dto';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import type { UserContextType } from 'src/common/types/user_context.type';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { TaskResponseDTO } from '../dtos/task.dto';
import { BulkAddTaskAttachmentsRequestDTO } from '../dtos/bulk_add_task_attachments.dto';
import { TaskAttachmentsUploadResponseDTO } from '../dtos/task_attachments_upload.dto';
import {
  getAppResponseSchema,
  RegisterAppResponseModels,
} from 'src/common/utils/swagger.util';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Patch('/:id')
  @ApiOperation({ summary: 'Update task details' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the task',
    type: Number,
  })
  @ApiBody({ type: UpdateTaskRequestDTO })
  @RegisterAppResponseModels(TaskResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TaskResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.taskService.updateTask(
      data.toUpdateTaskInput(id),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'update task success',
      data: new TaskResponseDTO(output),
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiParam({ name: 'id', type: Number })
  @RegisterAppResponseModels(TaskResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TaskResponseDTO),
  })
  @HttpCode(HttpStatus.OK)
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.taskService.getTaskById(id, user);
    return new AppResponseDTO({
      success: true,
      message: 'get task by id success',
      data: new TaskResponseDTO(output),
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: AppResponseDTO })
  @HttpCode(HttpStatus.OK)
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUserContext() user: UserContextType,
  ) {
    await this.taskService.deleteTask(id, user);
    return new AppResponseDTO({
      success: true,
      message: 'delete task success',
    });
  }

  @Post('/:id/attachments/bulk')
  @ApiOperation({
    summary: 'Request presigned URLs for bulk file uploads',
    description:
      'Call this before uploading files to S3. Returns S3 PUT URLs for the mobile app.',
  })
  @ApiParam({
    name: 'id',
    description: 'The task ID to attach files to',
    type: Number,
  })
  @ApiBody({ type: BulkAddTaskAttachmentsRequestDTO })
  @RegisterAppResponseModels(TaskAttachmentsUploadResponseDTO)
  @ApiOkResponse({
    schema: getAppResponseSchema(TaskAttachmentsUploadResponseDTO),
  })
  @HttpCode(HttpStatus.CREATED)
  async bulkAddTaskAttchments(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: BulkAddTaskAttachmentsRequestDTO,
    @CurrentUserContext() user: UserContextType,
  ) {
    const output = await this.taskService.bulkAddTaskAttachments(
      data.toBulkAddTaskAttachmentsInput(id),
      user,
    );
    return new AppResponseDTO({
      success: true,
      message: 'bulk add task attachments success',
      data: new TaskAttachmentsUploadResponseDTO(output),
    });
  }
}
