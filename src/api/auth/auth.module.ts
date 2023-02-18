import { Module } from '@nestjs/common';
import { RolePermissionRepository, UserRepository } from '@repositories';

import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, UserService, UserRepository]
})
export class AuthModule { }
