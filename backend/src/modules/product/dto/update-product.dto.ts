import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GenderTarget } from '@prisma/client';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsEnum(GenderTarget)
  @IsOptional()
  audience?: GenderTarget;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsOptional()
  sizeChartJson?: any;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  categoryId?: string;
}

