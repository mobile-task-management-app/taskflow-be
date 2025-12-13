import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserContextType } from '../types/user_context.type';

export const CurrentUserContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserContextType => {
    const request: Request = ctx.switchToHttp().getRequest();
    console.log('Request user:', request['user']);
    return request['user'] as UserContextType;
  },
);
