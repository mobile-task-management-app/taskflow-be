import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserContextType } from 'src/common/types/user_context.type';
import { ProjectService } from 'src/projects/services/project.service';
import { ProjectRepository } from 'src/projects/repositories/project.repository';
import { ProjectStatus } from 'src/projects/models/project_status';

describe('ProjectService', () => {
  let service: ProjectService;
  let repository: jest.Mocked<ProjectRepository>;

  // Mock common data
  const mockUser: UserContextType = { id: 1 };
  const mockOtherUser: UserContextType = { id: 99 };

  const mockProject = {
    id: 101,
    name: 'Test Project',
    ownerId: 1, // Matches mockUser.id
    status: ProjectStatus.NOT_YET,
  };

  beforeEach(async () => {
    const mockProjectRepository = {
      createProject: jest.fn(),
      searchProject: jest.fn(),
      findProjectById: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      findProjectSummariesByOwnerId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useValue: mockProjectRepository },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get(ProjectRepository);
  });

  describe('createProject', () => {
    it('should create a project successfully', async () => {
      const input = { toCreateProject: jest.fn().mockReturnValue(mockProject) };
      repository.createProject.mockResolvedValue(mockProject as any);

      const result = await service.createProject(input as any, mockUser);

      expect(input.toCreateProject).toHaveBeenCalledWith(
        mockUser.id,
        ProjectStatus.NOT_YET,
      );
      expect(repository.createProject).toHaveBeenCalled();
      expect(result.id).toBe(mockProject.id);
    });
  });

  describe('updateProject', () => {
    const updateInput = {
      id: 101,
      toUpdateProject: jest.fn().mockReturnValue({ name: 'Updated' }),
    };

    it('should throw 404 if project does not exist', async () => {
      repository.findProjectById.mockResolvedValue(null);

      await expect(
        service.updateProject(updateInput as any, mockUser),
      ).rejects.toThrow(
        new HttpException('project not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw 403 if user is not the owner', async () => {
      repository.findProjectById.mockResolvedValue(mockProject as any);

      await expect(
        service.updateProject(updateInput as any, mockOtherUser),
      ).rejects.toThrow(
        new HttpException('permission denined', HttpStatus.FORBIDDEN),
      );
    });

    it('should update successfully if user is owner', async () => {
      repository.findProjectById.mockResolvedValue(mockProject as any);
      repository.updateProject.mockResolvedValue({
        ...mockProject,
        name: 'Updated',
      } as any);

      const result = await service.updateProject(updateInput as any, mockUser);

      expect(repository.updateProject).toHaveBeenCalledWith(
        mockProject.id,
        expect.any(Object),
      );
      expect(result.name).toBe('Updated');
    });
  });

  describe('getProjectById', () => {
    it('should return project if owner requests it', async () => {
      repository.findProjectById.mockResolvedValue(mockProject as any);

      const result = await service.getProjectById(101, mockUser);
      expect(result.id).toBe(101);
    });

    it('should throw 403 if non-owner tries to access', async () => {
      repository.findProjectById.mockResolvedValue(mockProject as any);

      await expect(service.getProjectById(101, mockOtherUser)).rejects.toThrow(
        new HttpException('permission denined', HttpStatus.FORBIDDEN),
      );
    });
  });

  describe('deleteProject', () => {
    it('should call delete on repository if authorized', async () => {
      repository.findProjectById.mockResolvedValue(mockProject as any);

      await service.deleteProject(101, mockUser);

      expect(repository.deleteProject).toHaveBeenCalledWith(101);
    });
  });

  describe('getUserProjectSummaries', () => {
    it('should return mapped summaries', async () => {
      const mockSummaries = [
        { id: 1, name: 'P1' },
        { id: 2, name: 'P2' },
      ];
      repository.findProjectSummariesByOwnerId.mockResolvedValue(
        mockSummaries as any,
      );

      const result = await service.getUserProjectSummaries(mockUser);

      expect(result).toHaveLength(2);
      expect(repository.findProjectSummariesByOwnerId).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });
});
