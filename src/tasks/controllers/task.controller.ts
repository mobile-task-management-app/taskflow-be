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
import { TaskService } from '../services/task.service';
import { UpdateTaskRequestDTO } from '../dtos/update_task.dto';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import type { UserContextType } from 'src/common/types/user_context.type';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { TaskResponseDTO } from '../dtos/task.dto';
import { BulkAddTaskAttachmentsRequestDTO } from '../dtos/bulk_add_task_attachments.dto';
import { TaskAttachmentsUploadResponseDTO } from '../dtos/task_attachments_upload.dto';

@Controller('/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Patch('/:id')
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.CREATED)
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
  @HttpCode(HttpStatus.NO_CONTENT)
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
