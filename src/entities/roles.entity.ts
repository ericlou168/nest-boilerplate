import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { E } from '@common';

import { UsersEntity } from './users.entity';


@Entity('roles')
export class RolesEntity {
  S
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: E.StatusEnum
  })
  status: E.StatusEnum;

  @OneToMany(() => UsersEntity, users => users.role)
  users: Array<UsersEntity>;
}
