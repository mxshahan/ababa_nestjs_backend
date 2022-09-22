import { SetMetadata } from '@nestjs/common';

export const UseRoles = (...roles: string[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('IS_PUBLIC', true);
