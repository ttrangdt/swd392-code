import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * UC-11: Xem danh sach san pham (ho tro filter category va audience Men/Women/Unisex - BR-20)
   */
  @Get()
  getProductList(
    @Query('categoryId') categoryId?: string,
    @Query('audience') audience?: string,
  ) {
    return this.productService.getProductList(categoryId, audience);
  }

  /**
   * UC-12: Tim kiem san pham theo tu khoa
   */
  @Get('search')
  searchProducts(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }

  /**
   * UC-17: Danh sach san pham cho Admin
   */
  @Get('admin/all')
  getAllForAdmin() {
    return this.productService.getAllProductsForAdmin();
  }

  /**
   * UC-14: Xem chi tiet san pham (PDP)
   */
  @Get(':idOrSlug')
  getProductDetails(@Param('idOrSlug') idOrSlug: string) {
    return this.productService.getProductDetails(idOrSlug);
  }

  /**
   * UC-17: Tao moi san pham (Admin CRUD)
   */
  @Post('admin')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  /**
   * UC-17: Cap nhat san pham (Admin CRUD)
   */
  @Put('admin/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(id, dto);
  }

  /**
   * UC-17: Xoa mem san pham (Admin CRUD - BR-36 Soft Delete)
   */
  @Delete('admin/:id')
  softDeleteProduct(@Param('id') id: string) {
    return this.productService.softDeleteProduct(id);
  }
}

