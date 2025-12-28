import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectRepository } from 'src/projects/repositories/project.repository';
import { TaskRepository } from '../repositories/task.repository';
import { CreateProjectTaskInput } from './inputs/create_project_task.input';
import { TaskOutput } from './outputs/task.output';
import { UserContextType } from 'src/common/types/user_context.type';
import { PoolClient } from 'pg';
import { UpdateTask } from '../models/update_task';
import { Task } from '../models/task';
import { PgService } from 'src/common/pg/pg.service';
import { S3StorageService } from 'src/storage/services/s3_storage.service';
import { TaskAttachmentsUploadOutput } from './outputs/task_attachments_upload.output';

@Injectable()
export class ProjectTaskService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly taskRepo: TaskRepository,
    private readonly pgService: PgService,
    private readonly s3StorageService: S3StorageService,
  ) {}

  async createProjectTask(
    input: CreateProjectTaskInput,
    user: UserContextType,
  ): Promise<TaskOutput> {
    const project = await this.projectRepo.findProjectById(input.projectId);
    if (!project) {
      throw new HttpException('project not found', HttpStatus.NOT_FOUND);
    }
    if (project.ownerId !== user.id) {
      throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    }
    const callback = async (client: PoolClient) => {
      //create task
      const createTask = input.toCreateTask();
      const newTask = await this.taskRepo.createTask(createTask, client);
      //create attachment for task
      if (input.attachments.length === 0) {
        return newTask;
      }

      const attachments = input.attachments.map((attachment, idx) =>
        attachment.toAttachment(
          `tasks/${newTask.id}/attachments/${idx}/${newTask.id}_${idx}`,
        ),
      );
      const updateTaskAttachments = new UpdateTask({
        attachments,
      });
      const updatedTask = (await this.taskRepo.updateTask(
        newTask.id,
        updateTaskAttachments,
        client,
      )) as Task;
      return updatedTask;
    };
    const newTask = await this.pgService.executeTransaction(callback);
    // get presign url for attachment
    const urls = await Promise.all(
      newTask.attachments.map((attachment) =>
        this.s3StorageService.getPresignedUploadUrl(
          attachment.storageKey,
          attachment.getMimeType(),
        ),
      ),
    );
    return new TaskAttachmentsUploadOutput({
      ...newTask,
      attachmentUrls: urls,
    });
  }
}
