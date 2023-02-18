import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}

export class RegenerateRefreshTokenBody {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
