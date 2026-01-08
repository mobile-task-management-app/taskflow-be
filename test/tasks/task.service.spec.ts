import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TaskService } from 'src/tasks/services/task.service';
import { TaskRepository } from 'src/tasks/repositories/task.repository';
import { S3StorageService } from 'src/storage/services/s3_storage.service';
import { UserContextType } from 'src/common/types/user_context.type';
describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: jest.Mocked<TaskRepository>;
  let s3Service: jest.Mocked<S3StorageService>;

  const mockUser: UserContextType = { id: 1 };
  const mockTask = {
    id: 500,
    ownerId: 1,
    attachments: [{ storageKey: 'old-1', getMimeType: () => 'image/png' }],
  };

  beforeEach(async () => {
    const mockTaskRepo = {
      findTaskById: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      updateTaskAttachments: jest.fn(),
      searchTasks: jest.fn(),
    };
    const mockS3Service = {
      getPresignedUploadUrl: jest.fn(),
      getPresignedDownloadUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepository, useValue: mockTaskRepo },
        { provide: S3StorageService, useValue: mockS3Service },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get(TaskRepository);
    s3Service = module.get(S3StorageService);
  });

  describe('updateTask', () => {
    const updateInput = {
      id: 500,
      toUpdateTask: jest.fn().mockReturnValue({ title: 'New' }),
    };

    it('should throw 403 if user does not own the task', async () => {
      taskRepo.findTaskById.mockResolvedValue({
        ...mockTask,
        ownerId: 99,
      } as any);

      await expect(
        service.updateTask(updateInput as any, mockUser),
      ).rejects.toThrow(
        new HttpException('permission denied', HttpStatus.FORBIDDEN),
      );
    });

    it('should update task successfully', async () => {
      taskRepo.findTaskById.mockResolvedValue(mockTask as any);
      taskRepo.updateTask.mockResolvedValue({
        ...mockTask,
        title: 'New',
      } as any);

      const result = await service.updateTask(updateInput as any, mockUser);
      expect(result.title).toBe('New');
    });
  });

  describe('bulkAddTaskAttachments', () => {
    it('should append new attachments with correct indices', async () => {
      // 1. Arrange
      taskRepo.findTaskById.mockResolvedValue(mockTask as any);
      const newAttachmentInput = {
        toAttachment: jest.fn().mockReturnValue({
          storageKey: 'new-2',
          getMimeType: () => 'text/plain',
        }),
      };
      const input = { id: 500, attachments: [newAttachmentInput] };

      taskRepo.updateTaskAttachments.mockResolvedValue({ ...mockTask } as any);
      s3Service.getPresignedUploadUrl.mockResolvedValue('http://upload.url');

      // 2. Act
      await service.bulkAddTaskAttachments(input as any, mockUser);

      // 3. Assert: Verify index calculation (old length was 1, so new index should be 1 + 0 = 1)
      expect(newAttachmentInput.toAttachment).toHaveBeenCalledWith(500, 1);
      expect(taskRepo.updateTaskAttachments).toHaveBeenCalledWith(
        500,
        expect.arrayContaining([
          expect.objectContaining({ storageKey: 'old-1' }),
        ]),
      );
    });
  });

  describe('getTaskById', () => {
    it('should return task with download URLs for attachments', async () => {
      taskRepo.findTaskById.mockResolvedValue(mockTask as any);
      s3Service.getPresignedDownloadUrl.mockResolvedValue(
        'http://download.url',
      );

      const result = await service.getTaskById(500, mockUser);

      expect(s3Service.getPresignedDownloadUrl).toHaveBeenCalledWith('old-1');
      expect(result.attachments[0].downloadUrl).toBe('http://download.url');
    });
  });

  describe('searchTask', () => {
    it('should set ownerId from user context and search', async () => {
      const input = { search: 'test' };
      taskRepo.searchTasks.mockResolvedValue([]);

      await service.searchTask(input as any, mockUser);

      expect(input['ownerId']).toBe(mockUser.id);
      expect(taskRepo.searchTasks).toHaveBeenCalledWith(input);
    });
  });
});
