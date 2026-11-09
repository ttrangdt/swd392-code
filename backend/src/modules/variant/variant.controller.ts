import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  /**
   * BR-28: Lay danh sach cac bien the co nguy co het hang (< 10 sp)
   */
  @Get('low-stock-alerts')
  getLowStockAlerts() {
    return this.variantService.getLowStockAlerts();
  }

  /**
   * UC-18: Lay danh sach bien the cua san pham
   */
  @Get()
  getByProduct(@Query('productId') productId: string) {
    return this.variantService.getVariantsByProduct(productId);
  }

  /**
   * UC-18: Tao bien the moi (BR-24 SKU uniqueness)
   */
  @Post()
  createVariant(@Body() dto: CreateVariantDto) {
    return this.variantService.createVariant(dto);
  }

  /**
   * UC-18: Cap nhat so luong ton kho
   */
  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.variantService.updateStock(id, dto);
  }

  /**
   * UC-18: Xoa bien the
   */
  @Delete(':id')
  deleteVariant(@Param('id') id: string) {
    return this.variantService.deleteVariant(id);
  }
}

