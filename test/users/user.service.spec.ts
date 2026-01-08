import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UserContextType } from 'src/common/types/user_context.type';
import { UserOutput } from 'src/users/services/outputs/user.output';
describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  // Mock Data
  const mockUserContext: UserContextType = {
    id: 1,
  };
  const mockUserEntity = {
    id: 1,
    name: 'John Doe',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    // Create a mock repository with the findUserById method
    const mockUserRepository = {
      findUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('should return a UserOutput when user exists', async () => {
      // Arrange: Mock the repo to return a user
      repository.findUserById.mockResolvedValue(mockUserEntity as any);

      // Act
      const result = await service.getUserProfile(mockUserContext);

      // Assert
      expect(repository.findUserById).toHaveBeenCalledWith(mockUserContext.id);
      expect(result).toBeInstanceOf(UserOutput);
      expect(result.id).toBe(mockUserEntity.id);
    });

    it('should throw HttpException (404) when user is not found', async () => {
      // Arrange: Mock the repo to return null
      repository.findUserById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserProfile(mockUserContext)).rejects.toThrow(
        new HttpException('user not found', HttpStatus.NOT_FOUND),
      );

      expect(repository.findUserById).toHaveBeenCalledWith(mockUserContext.id);
    });
  });
});
