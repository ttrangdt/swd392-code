/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class VariantService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * UC-18: Tao bien the moi kem kiem tra tinh duy nhat cua SKU (BR-24)
   */
  async createVariant(dto: CreateVariantDto) {
    const { productId, color, size, sku, price, stockQty } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product || product.isDeleted) {
      throw new NotFoundException('San pham khong ton tai.');
    }

    // BR-24: Kiem tra tinh duy nhat cua ma SKU
    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: sku.trim() },
    });
    if (existingSku) {
      throw new ConflictException(
        `BR-24: Mã SKU "${sku}" đã tồn tại trong hệ thống. Mỗi biến thể phải có một mã SKU duy nhất.`,
      );
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        color,
        size,
        sku: sku.trim(),
        price,
        stockQty,
      },
      include: { product: true },
    });

    return {
      ...variant,
      isLowStock: variant.stockQty < 10, // BR-28
      isOutOfStock: variant.stockQty <= 0, // BR-29
    };
  }

  /**
   * UC-18: Lay danh sach bien the cua 1 san pham
   */
  async getVariantsByProduct(productId: string) {
    const variants = await this.prisma.productVariant.findMany({
      where: { productId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return variants.map((v) => ({
      ...v,
      isLowStock: v.stockQty > 0 && v.stockQty < 10, // BR-28
      isOutOfStock: v.stockQty <= 0, // BR-29
    }));
  }

  /**
   * UC-18: Cap nhat so luong ton kho (Restock / Adjust)
   */
  async updateStock(variantId: string, dto: UpdateStockDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Biến thể không tồn tại.');
    }

    const updated = await this.prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQty: dto.stockQty },
      include: { product: true },
    });

    return {
      ...updated,
      isLowStock: updated.stockQty > 0 && updated.stockQty < 10, // BR-28
      isOutOfStock: updated.stockQty <= 0, // BR-29
    };
  }

  /**
   * UC-18: Xoa bien the
   */
  async deleteVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException('Biến thể không tồn tại.');
    }

    await this.prisma.productVariant.delete({
      where: { id: variantId },
    });

    return { success: true, message: `Đã xóa biến thể ${variant.sku}.` };
  }

  /**
   * BR-28: Canh bao het hang / sap het hang tren Dashboard (< 10 units)
   */
  async getLowStockAlerts() {
    const variants = await this.prisma.productVariant.findMany({
      where: {
        stockQty: { lt: 10 },
        product: { isDeleted: false },
      },
      include: {
        product: true,
      },
      orderBy: { stockQty: 'asc' },
    });

    return variants.map((v) => ({
      id: v.id,
      productName: v.product.name,
      color: v.color,
      size: v.size,
      sku: v.sku,
      stockQty: v.stockQty,
      alertLevel: v.stockQty === 0 ? 'HẾT HÀNG (Out of Stock)' : 'SẮP HẾT HÀNG (Low Stock Alert)',
    }));
  }
}

