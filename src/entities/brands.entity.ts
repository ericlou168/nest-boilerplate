import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { E } from '@common';

@Entity('brands')
export class BrandsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  brandNameKh: string;

  @Column({ length: 255 })
  brandNameEn: string;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ type: 'enum', enum: E.StatusEnum, default: E.StatusEnum.active })
  status: E.StatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

