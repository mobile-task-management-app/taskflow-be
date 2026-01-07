import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from '../repositories/task.repository';
import { UpdateTaskInput } from './inputs/update_task.input';
import { UserContextType } from 'src/common/types/user_context.type';
import { TaskOutput } from './outputs/task.output';
import { BulkAddTaskAttachmentInput } from './inputs/bulk_add_task_attachments.input';
import { S3StorageService } from 'src/storage/services/s3_storage.service';
import { TaskAttachmentOutput } from './outputs/task_attachment.output';
import { SearchTaskInput } from './inputs/search_task.input';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly s3StorageService: S3StorageService,
  ) {}

  async updateTask(
    input: UpdateTaskInput,
    user: UserContextType,
  ): Promise<TaskOutput> {
    const task = await this.taskRepo.findTaskById(input.id);
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    if (task.ownerId !== user.id) {
      throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    }
    const updateTask = input.toUpdateTask();
    const updatedTask = await this.taskRepo.updateTask(input.id, updateTask);
    return new TaskOutput(updatedTask);
  }
  async deleteTask(id: number, user: UserContextType) {
    const task = await this.taskRepo.findTaskById(id);
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    if (task.ownerId !== user.id) {
      throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    }
    await this.taskRepo.deleteTask(id);
  }

  async bulkAddTaskAttachments(
    input: BulkAddTaskAttachmentInput,
    user: UserContextType,
  ) {
    const task = await this.taskRepo.findTaskById(input.id);
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    if (task.ownerId !== user.id) {
      throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    }
    const newAttachments = input.attachments.map((attachment, idx) =>
      attachment.toAttachment(task.id, idx + task.attachments.length),
    );
    const newTasks = await this.taskRepo.updateTaskAttachments(task.id, [
      ...task.attachments,
      ...newAttachments,
    ]);
    const attachments = await Promise.all(
      newAttachments.map(async (attachment) => {
        const uploadUrl = await this.s3StorageService.getPresignedUploadUrl(
          attachment.storageKey,
          attachment.getMimeType(),
        );
        return new TaskAttachmentOutput({
          ...attachment,
          uploadUrl,
        });
      }),
    );
    return new TaskOutput({
      ...newTasks,
      attachments,
    });
  }

  async getTaskById(id: number, user: UserContextType): Promise<TaskOutput> {
    const task = await this.taskRepo.findTaskById(id);
    if (!task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    if (task.ownerId !== user.id) {
      throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    }
    const attachments = await Promise.all(
      task.attachments.map(async (attachment) => {
        const downloadUrl = await this.s3StorageService.getPresignedDownloadUrl(
          attachment.storageKey,
        );
        return new TaskAttachmentOutput({
          ...attachment,
          downloadUrl,
        });
      }),
    );
    return new TaskOutput({
      ...task,
      attachments,
    });
  }

  async searchTask(
    input: SearchTaskInput,
    user: UserContextType,
  ): Promise<TaskOutput[]> {
    input.ownerId = user.id;
    const tasks = await this.taskRepo.searchTasks(input);
    return tasks.map((task) => new TaskOutput(task));
  }
}
