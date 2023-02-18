import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from '@api/api.module';
import { JwtModule } from '@lib/jwt';
import { TypeOrmModule } from '@lib/typeorm';
import { WinstonModule } from '@lib/winston';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule,
    JwtModule,
    ApiModule,
    WinstonModule
  ]
})
export class AppModule { }
