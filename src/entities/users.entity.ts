import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { E } from '@common';

import { RolesEntity } from './roles.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  firstName: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ length: 255 })
  image: string;

  @Column({ length: 255, unique: true })
  phone: string;

  @Column({ select: false })
  password: string;

  @Index()
  @Column({ type: 'integer', nullable: true })
  roleId!: number;

  @Column({ type: 'enum', enum: E.StatusEnum, default: E.StatusEnum.active })
  status: E.StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert() async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // Relationship
  @ManyToOne(() => RolesEntity, role => role.users, { nullable: false })
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: RolesEntity;
}

