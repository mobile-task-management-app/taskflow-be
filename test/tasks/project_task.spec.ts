import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProjectTaskService } from 'src/tasks/services/project_task.service';
import { ProjectRepository } from 'src/projects/repositories/project.repository';
import { TaskRepository } from 'src/tasks/repositories/task.repository';
import { UserContextType } from 'src/common/types/user_context.type';
import { PgService } from 'src/common/pg/pg.service';
import { S3StorageService } from 'src/storage/services/s3_storage.service';

describe('ProjectTaskService', () => {
  let service: ProjectTaskService;
  let projectRepo: jest.Mocked<ProjectRepository>;
  let taskRepo: jest.Mocked<TaskRepository>;
  let pgService: jest.Mocked<PgService>;
  let s3StorageService: jest.Mocked<S3StorageService>;

  const mockUser: UserContextType = { id: 1 };
  const mockProject = { id: 10, ownerId: 1 };
  const mockTask = {
    id: 100,
    attachments: [{ storageKey: 'key1', getMimeType: () => 'image/png' }],
  };

  beforeEach(async () => {
    const mockProjectRepo = { findProjectById: jest.fn() };
    const mockTaskRepo = {
      createTask: jest.fn(),
      updateTaskAttachments: jest.fn(),
      searchTasks: jest.fn(),
    };
    const mockPgService = { executeTransaction: jest.fn() };
    const mockS3Service = { getPresignedUploadUrl: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectTaskService,
        { provide: ProjectRepository, useValue: mockProjectRepo },
        { provide: TaskRepository, useValue: mockTaskRepo },
        { provide: PgService, useValue: mockPgService },
        { provide: S3StorageService, useValue: mockS3Service },
      ],
    }).compile();

    service = module.get<ProjectTaskService>(ProjectTaskService);
    projectRepo = module.get(ProjectRepository);
    taskRepo = module.get(TaskRepository);
    pgService = module.get(PgService);
    s3StorageService = module.get(S3StorageService);
  });

  describe('createProjectTask', () => {
    const mockInput = {
      projectId: 10,
      attachments: [
        { toAttachment: jest.fn().mockReturnValue({ storageKey: 'key1' }) },
      ],
      toCreateTask: jest.fn().mockReturnValue({ title: 'New Task' }),
    };

    it('should throw 404 if project not found', async () => {
      projectRepo.findProjectById.mockResolvedValue(null);
      await expect(
        service.createProjectTask(mockInput as any, mockUser),
      ).rejects.toThrow(
        new HttpException('project not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw 403 if user is not the owner', async () => {
      projectRepo.findProjectById.mockResolvedValue({
        id: 10,
        ownerId: 99,
      } as any);
      await expect(
        service.createProjectTask(mockInput as any, mockUser),
      ).rejects.toThrow(
        new HttpException('permission denied', HttpStatus.FORBIDDEN),
      );
    });

    it('should create task with attachments and return presigned URLs', async () => {
      // 1. Arrange
      projectRepo.findProjectById.mockResolvedValue(mockProject as any);

      // Mock Transaction: immediately execute the callback
      pgService.executeTransaction.mockImplementation(
        async (cb) => await cb({} as any),
      );

      taskRepo.createTask.mockResolvedValue({ id: 100 } as any);
      taskRepo.updateTaskAttachments.mockResolvedValue(mockTask as any);
      s3StorageService.getPresignedUploadUrl.mockResolvedValue(
        'https://s3.url/upload',
      );

      // 2. Act
      const result = await service.createProjectTask(
        mockInput as any,
        mockUser,
      );

      // 3. Assert
      expect(pgService.executeTransaction).toHaveBeenCalled();
      expect(taskRepo.createTask).toHaveBeenCalled();
      expect(s3StorageService.getPresignedUploadUrl).toHaveBeenCalledWith(
        'key1',
        'image/png',
      );
      expect(result.attachments[0].uploadUrl).toBe('https://s3.url/upload');
    });
  });

  describe('searchProjectTask', () => {
    it('should return mapped TaskOutput list', async () => {
      projectRepo.findProjectById.mockResolvedValue(mockProject as any);
      taskRepo.searchTasks.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);

      const result = await service.searchProjectTask(
        { projectId: 10 } as any,
        mockUser,
      );

      expect(result).toHaveLength(2);
      expect(taskRepo.searchTasks).toHaveBeenCalled();
    });
  });
});
