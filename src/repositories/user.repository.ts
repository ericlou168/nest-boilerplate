import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UsersEntity } from '@entities';
import { RawQuery } from '@lib/typeorm/typeorm.helper';


@Injectable()
export class UserRepository extends Repository<UsersEntity> {
  constructor(private dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager());
  }
  async $getPermissionByUserId(id: number) {
    const [result = null] = await RawQuery('../sql/user/get-permission-by-user.sql', this.dataSource, { id })
    return result
  }
}
