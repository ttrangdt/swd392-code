/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SizeChartService } from './size-chart.service';
import { RecommendSizeDto } from './dto/recommend-size.dto';
import { UpdateSizeChartDto } from './dto/update-size-chart.dto';

@Controller('size-charts')
export class SizeChartController {
  constructor(private readonly sizeChartService: SizeChartService) {}

  /**
   * UC-15: Xem danh sach tat ca cac bang size quy chuan theo danh muc
   */
  @Get('categories')
  getAllCategoryFallbacks() {
    return this.sizeChartService.getAllCategoryFallbacks();
  }

  /**
   * UC-15: Xem bang size chi tiet cua mot san pham (co fallback ve danh muc neu san pham chua cau hinh rieng)
   */
  @Get('product/:idOrSlug')
  getProductSizeChart(@Param('idOrSlug') idOrSlug: string) {
    return this.sizeChartService.getProductSizeChart(idOrSlug);
  }

  /**
   * BR-19: Goi y size thong minh dua tren chieu cao, can nang va so thich form dang (Fitted / Regular / Oversize)
   */
  @Post('recommend')
  recommendSize(@Body() dto: RecommendSizeDto) {
    return this.sizeChartService.recommendSize(dto);
  }

  /**
   * UC-17 & UC-15: Admin/Staff cap nhat bang size rieng cho san pham
   */
  @Put('product/:id')
  updateProductSizeChart(
    @Param('id') id: string,
    @Body() dto: UpdateSizeChartDto,
  ) {
    return this.sizeChartService.updateProductSizeChart(id, dto);
  }
}

