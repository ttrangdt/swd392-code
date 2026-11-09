import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum FitPreference {
  FITTED = 'FITTED',
  REGULAR = 'REGULAR',
  OVERSIZE = 'OVERSIZE',
}

export class RecommendSizeDto {
  @IsNumber()
  @Min(100)
  @Max(220)
  height: number; // cm

  @IsNumber()
  @Min(30)
  @Max(150)
  weight: number; // kg

  @IsOptional()
  @IsEnum(FitPreference)
  fitPreference?: FitPreference = FitPreference.REGULAR;

  @IsOptional()
  @IsNumber()
  chest?: number; // cm

  @IsOptional()
  @IsNumber()
  waist?: number; // cm

  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;
}

