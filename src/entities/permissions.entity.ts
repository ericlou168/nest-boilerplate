import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { E } from '@common';

@Entity('permissions')
export class PermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  name: string;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column({ type: 'enum', enum: E.StatusEnum })
  status: E.StatusEnum;
}
