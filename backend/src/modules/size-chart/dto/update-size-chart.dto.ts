/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SizeMeasurementRowDto {
  size: string;
  length?: string;
  chest?: string;
  shoulder?: string;
  sleeve?: string;
  waist?: string;
  hips?: string;
  thigh?: string;
  legOpening?: string;
}

export class UpdateSizeChartDto {
  @IsArray()
  sizeChart: SizeMeasurementRowDto[];
}

