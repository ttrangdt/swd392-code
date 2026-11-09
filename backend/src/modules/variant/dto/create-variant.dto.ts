import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty({ message: 'BR-24: Mã SKU là bắt buộc và phải là duy nhất' })
  sku: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  stockQty: number;
}

