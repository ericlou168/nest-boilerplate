import 'winston-daily-rotate-file';

import { Global, Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule as _WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file");

@Global()
@Module({
  imports: [
    _WinstonModule.forRoot({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike())
        }),
        new DailyRotateFile({
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '30d'
        })
      ]
    })
  ],
  exports: [_WinstonModule]
})
export class WinstonModule { }
