import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { E, PaginationDto } from '@common';


export class CreateUserBody {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  phone: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  image: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  lastName: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ type: 'number' })
  roleId: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  password: string;
}

export class ListUserQuery extends PaginationDto {
  @IsOptional()
  @IsEnum(E.StatusEnum)
  @ApiPropertyOptional({ type: 'enum', enum: E.StatusEnum })
  status: E.StatusEnum;

}

export class UpdateUserBody {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  phone: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  image: string;
}

export class UpdateUserStatusParam {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
}

export class UpdateUserStatusBody {
  @IsNotEmpty()
  @IsEnum(E.StatusEnum)
  @ApiPropertyOptional({ type: 'enum', enum: E.StatusEnum })
  status: E.StatusEnum;
}

export class UpdateUserEmailParam {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
}

export class UpdateUserEmailBody {
  @IsNotEmpty()
  @IsEmail()
  @ApiPropertyOptional()
  email: string;
}

export class ChangePasswordBody {
  @IsNotEmpty()
  @ApiPropertyOptional()
  currentPassword: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  newPassword: string;
}

export class DeleteAccountParam {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string;
}

export class UpdateRoleBody {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  roleId: number;
}

