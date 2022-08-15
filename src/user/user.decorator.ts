import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.schema';

const getCurrentUserByContext = (context: ExecutionContext): User => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: undefined, contenxt: ExecutionContext) =>
    getCurrentUserByContext(contenxt),
);
