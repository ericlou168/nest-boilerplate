import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';

import { E } from '@common';
import { PermissionEntity, RolesEntity, UsersEntity } from '@entities';
import { RolePermissionRepository, UserRepository } from '@repositories';

import {
  ChangePasswordBody,
  CreateUserBody,
  ListUserQuery,
  UpdateRoleBody,
  UpdateUserBody,
  UpdateUserStatusBody
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,

    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(RolePermissionRepository)
    private rolePermissionRepository: RolePermissionRepository

  ) { }

  async validateAccount(body: CreateUserBody) {
    const { roleId, phone } = body;
    const [role, account] = await Promise.all([
      this.roleRepository.findOne({ where: { id: roleId, status: E.StatusEnum.active } }),
      this.userRepository.findOneBy({ phone })
    ]);
    if (!role) throw new NotFoundException('Role not found');
    if (account) throw new ConflictException('Phone already existed');
  }

  async create(body: CreateUserBody) {
    await this.validateAccount(body);
    const userEntity = Object.assign(new UsersEntity(), body);
    await this.userRepository.manager.save(userEntity);
    return { message: 'ok' };
  }

  async findAll(query: ListUserQuery) {
    const { limit, offset, status } = query
    const [data, total] = await this.userRepository.findAndCount({
      select: ['id', 'phone', 'status', 'createdAt', 'updatedAt'],
      where: { status },
      skip: offset,
      take: limit
    })
    return { data: data, meta: { limit, offset, total } };
  }

  async getAccountPermission(id: number) {
    return this.userRepository.$getPermissionByUserId(id)
  }

  async updateUserGeneralInfo(id: number, body: UpdateUserBody) {
    const account = await this.userRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found');
    const profile = await this.userRepository.findOneBy({ id });
    Object.assign(profile, body);
    await this.userRepository.manager.save(profile);
    return { message: 'ok' };
  }

  async updateUserStatus(id: number, body: UpdateUserStatusBody, accountId: number) {
    const account = await this.userRepository.findOneBy({ id });
    if (!account) throw new NotFoundException('Account not found');
    if (account.id === accountId) throw new ConflictException('You cannot update self account status');
    Object.assign(account, body);
    await this.userRepository.$save(account);
    return { message: 'ok' };
  }

  async changePassword(id: number, body: ChangePasswordBody) {
    const userData = await this.userRepository.findOneBy({ id });
    if (!userData) throw new NotFoundException('user not found');
    const isMatch = await bcrypt.compare(body.currentPassword, userData.password);
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');
    Object.assign(userData, { password: await bcrypt.hash(body.newPassword, 10) });
    await this.userRepository.$save(userData);
    return { message: 'ok' };
  }

  async detail(id: number) {
    const userData = await this.userRepository.findOne({ relations: ['role'], where: { id } });
    if (!userData) throw new NotFoundException('User not found');
    const rolePermission = await this.rolePermissionRepository.findByRoleId(userData.roleId)
    const getPermissionId = rolePermission.map(item => item.permissionId);
    const permissions = await this.permissionRepository.find({
      select: ['id', 'name', 'title', 'action', 'subject'],
      where: { id: In(getPermissionId) }
    });
    Object.assign(userData, {
      firstName: userData ? userData.firstName : '',
      lastName: userData ? userData.lastName : '',
      image: userData ? userData.image : '',
      role: {
        id: userData ? userData.role.id : 0,
        name: userData ? userData.role.name : '',
        permission: permissions ? permissions : []
      }
    });
    return { data: userData };
  }

  async updateRole(body: UpdateRoleBody) {
    const userData = await this.userRepository.findOneBy({ id: body.id });
    if (!userData) throw new BadRequestException('User not found');
    const role = await this.roleRepository.findOneBy({ id: body.roleId });
    if (!role) throw new BadRequestException('Role not found');
    const profile = await this.userRepository.findOneBy({ id: userData.id });
    Object.assign(profile, { roleId: body.roleId });
    await this.userRepository.$save(profile);
    return { message: 'ok' };
  }
}
