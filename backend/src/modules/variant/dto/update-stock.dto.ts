import { IsInt, Min } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  stockQty: number;
}

