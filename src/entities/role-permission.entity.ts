import { Entity, PrimaryColumn } from 'typeorm';

@Entity('roles_permissions')
export class RolePermissionEntity {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  permissionId: number;
}
