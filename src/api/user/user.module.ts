import { Module } from '@nestjs/common';

import { RolePermissionRepository, UserRepository } from '@repositories';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, RolePermissionRepository]
})
export class UserModule { }
