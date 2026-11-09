import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { GenderTarget } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  originalPrice?: number;

  @IsEnum(GenderTarget)
  audience: GenderTarget;

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

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

