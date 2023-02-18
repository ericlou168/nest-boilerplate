import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional, ApiPropertyOptions } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { IsPhoneNumber } from '../validators/is-phone-number.validator';

type IsArrayOpt = { type?: unknown; format?: string };

// ===========================================
// OPTIONAL
// ===========================================
export const IsOptionalBoolean = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional(options), IsBoolean()); // prettier-ignore
export const IsOptionalISO8601 = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional({ format: 'date-time', ...options }), IsISO8601()); // prettier-ignore
export const IsOptionalNumber = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional(options), IsNumber()); // prettier-ignore
export const IsOptionalString = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional(options), IsString()); // prettier-ignore
export const IsOptionalUrl = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional(options), IsUrl()); // prettier-ignore
export const IsOptionalEmail = (options?: ApiPropertyOptions) => applyDecorators(IsOptional(), ApiPropertyOptional(options), IsEmail({}, { message: 'Please provide a valid email address.' })); // prettier-ignore

export const IsOptionalArray = (e: IsArrayOpt) => applyDecorators(IsOptional(), ApiPropertyOptional(e), IsArray()); // prettier-ignore
export const IsOptionalEnum = (e: object) => applyDecorators(IsOptional(), ApiPropertyOptional({ type: String, enum: e }), IsEnum(e)); // prettier-ignore
export const IsOptionalIn = (e: unknown[]) => applyDecorators(IsOptional(), ApiPropertyOptional({ type: String, enum: e }), IsIn(e)); // prettier-ignore
export const IsOptionalDateString = () => applyDecorators(IsOptional(), ApiPropertyOptional({ type: String, format: 'date-time' }), IsDateString()); // prettier-ignore
export const IsOptionalArrayNumber = () => applyDecorators(IsOptional(), ApiPropertyOptional({ type: Number, isArray: true }), IsArray(), IsNumber({}, { each: true })); // prettier-ignore
export const IsOptionalArrayString = () => applyDecorators(IsOptional(), ApiPropertyOptional({ type: String, isArray: true }), IsArray(), IsString({ each: true })); // prettier-ignore

// ===========================================
// NOT EMPTY
// ===========================================
export const IsNotEmptyBoolean = (options?: ApiPropertyOptions) => applyDecorators(IsNotEmpty(), ApiProperty(options), IsBoolean()); // prettier-ignore
export const IsNotEmptyISO8601 = (options?: ApiPropertyOptions) => applyDecorators(IsNotEmpty(), ApiProperty({ format: 'date-time', ...options }), IsISO8601()); // prettier-ignore
export const IsNotEmptyNumber = (options?: ApiPropertyOptions) => applyDecorators(IsNotEmpty(), ApiProperty(options), IsNumber()); // prettier-ignore
export const IsNotEmptyString = (options?: ApiPropertyOptions) => applyDecorators(IsNotEmpty(), ApiProperty(options), IsString()); // prettier-ignore
export const IsNotEmptyEmail = (options?: ApiPropertyOptions) => applyDecorators(IsNotEmpty(), ApiProperty(options), IsEmail({}, { message: 'Please provide a valid email address.' })); // prettier-ignore

export const IsNotEmptyEnum = (e: object) => applyDecorators(IsNotEmpty(), ApiProperty({ type: String, enum: e }), IsEnum(e)); // prettier-ignore
export const IsNotEmptyIn = (e: unknown[]) => applyDecorators(IsNotEmpty(), ApiProperty({ type: String, enum: e }), IsIn(e)); // prettier-ignore
export const IsNotEmptyDateString = () => applyDecorators(IsNotEmpty(), ApiProperty({ type: String, format: 'date-time' }), IsDateString()); // prettier-ignore
export const IsNotEmptyArrayNumber = () => applyDecorators(IsNotEmpty(), ApiProperty({ type: Number, isArray: true }), IsArray(), IsNumber({}, { each: true })); // prettier-ignore
export const IsNotEmptyPhoneNumber = (options?: ApiPropertyOptions) =>
  applyDecorators(
    // ! NOTE: do not changing any lines in this decorator
    Transform(({ value }) => parsePhoneNumberFromString(value)),
    IsPhoneNumber(),
    IsNotEmpty(),
    ApiProperty({ type: String, ...options })
  );

// ===========================================
// OTHERS
// ===========================================
export const IsArrayType = <T>(e: new () => T, minSize = 1) =>
  applyDecorators(
    ArrayMinSize(minSize),
    ValidateNested(),
    Type(() => e),
    ApiProperty({ isArray: true, type: e })
  );
