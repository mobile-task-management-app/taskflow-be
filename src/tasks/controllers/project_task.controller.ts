import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CurrentUserContext } from 'src/common/decorators/user_context.decorator';
import { CreateProjectTaskRequestDTO } from '../dtos/create_project_task.dto';
import type { UserContextType } from 'src/common/types/user_context.type';
import { ProjectTaskService } from '../services/project_task.service';
import { AppResponseDTO } from 'src/common/dtos/app_response.dto';
import { TaskAttachmentsUploadResponseDTO } from '../dtos/task_attachments_upload.dto';
import { TaskAttachmentResponseDTO } from '../dtos/task_attachment.dto';

@Controller('projects/:id/tasks')
export class ProjectTaskController {
  constructor(private readonly projectTaskService: ProjectTaskService) {}

  @Post()
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
      data: new TaskAttachmentsUploadResponseDTO({
        ...output,
        attachments: output.attachments.map(
          (attachment) =>
            new TaskAttachmentResponseDTO({
              name: attachment.name,
              size: attachment.size,
              extension: attachment.extension,
            }),
        ),
      }),
    });
  }
}
