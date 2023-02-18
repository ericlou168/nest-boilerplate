import { SetMetadata } from '@nestjs/common';

export const AuthPermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
