import { Body, Controller, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthPermissions } from 'src/common/decorators/admin-auth.decorator';

import {
  ChangePasswordBody,
  CreateUserBody,
  ListUserQuery,
  UpdateRoleBody,
  UpdateUserBody,
  UpdateUserStatusBody,
  UpdateUserStatusParam
} from './user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly accountService: UserService) { }

  @Post()
  @ApiBearerAuth()
  @AuthPermissions('CREATE_USER_ACCOUNT')
  @ApiOperation({ summary: 'create new user account' })
  create(@Body() body: CreateUserBody) {
    return this.accountService.create(body);
  }

  @Put('profile')
  @ApiBearerAuth()
  @AuthPermissions('UPDATE_ADMIN_ACCOUNT_INFO')
  @ApiOperation({ summary: 'update admin account info' })
  async updateAccountInfo(@Request() request, @Body() body: UpdateUserBody) {
    return await this.accountService.updateUserGeneralInfo(request.authUser.id || null, body);
  }

  @Get()
  @ApiBearerAuth()
  @AuthPermissions('LIST_ADMIN_ACCOUNT')
  @ApiOperation({ summary: 'list admin account' })
  async findAll(@Query() query: ListUserQuery) {
    return await this.accountService.findAll(query);
  }

  @Put('status/:id')
  @ApiBearerAuth()
  @AuthPermissions('UPDATE_ADMIN_ACCOUNT_STATUS')
  @ApiOperation({ summary: 'update  admin account status, except own account' })
  async updateAnyAccountStatus(
    @Request() request,
    @Body() body: UpdateUserStatusBody,
    @Param() { id }: UpdateUserStatusParam
  ) {
    return await this.accountService.updateUserStatus(+id || null, body, request.authUser.id || null);
  }

  @Put('change-password')
  @ApiBearerAuth()
  @AuthPermissions('CHANGE_ADMIN_PASSWORD')
  @ApiOperation({ summary: 'change own account password' })
  async changePassword(@Request() request, @Body() body: ChangePasswordBody) {
    return await this.accountService.changePassword(request.authUser.id || null, body);
  }

  @Get('me')
  @ApiBearerAuth()
  @AuthPermissions('GET_MY_USER_ACCOUNT')
  @ApiOperation({ summary: 'get  admin account detail' })
  async detail(@Request() request) {
    return await this.accountService.detail(request.authUser.id || null);
  }

  @Put('update-role')
  @ApiBearerAuth()
  @AuthPermissions('UPDATE_ADMIN_ACCOUNT_ROLE')
  @ApiOperation({ summary: 'update admin account role' })
  async updateAdminRole(@Body() body: UpdateRoleBody) {
    return await this.accountService.updateRole(body);
  }
}
