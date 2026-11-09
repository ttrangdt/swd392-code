/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import { IsInt, Min } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  stockQty: number;
}

