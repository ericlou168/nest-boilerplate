import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RolePermissionEntity } from '@entities';

@Injectable()
export class RolePermissionRepository extends Repository<RolePermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(RolePermissionEntity, dataSource.createEntityManager());
  }
  async findByRoleId(roleId: number) {
    return this.dataSource.getRepository(RolePermissionEntity).find({ where: { roleId } })
  }
}
