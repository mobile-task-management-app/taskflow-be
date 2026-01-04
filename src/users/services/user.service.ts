import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserContextType } from 'src/common/types/user_context.type';
import { UserOutput } from './outputs/user.output';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async getUserProfile(userContext: UserContextType): Promise<UserOutput> {
    const user = await this.userRepo.findUserById(userContext.id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return new UserOutput(user);
  }
}
