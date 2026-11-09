import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GenderTarget } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * UC-11: Xem danh sach san pham theo danh muc va doi tuong (Nam/Nu/Unisex)
   * BR-20: San pham "UNISEX" tu dong xuat hien ca trong danh muc Men va Women!
   * BR-29: Tinh toan trang thai "Out of Stock" neu tong ton kho cac bien the bang 0.
   */
  async getProductList(categoryId?: string, audience?: string) {
    const whereClause: any = {
      isActive: true,
      isDeleted: false, // BR-36: Chi lay san pham chua bi soft delete
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // BR-20 logic: Neu chon MEN -> lay MEN va UNISEX. Neu chon WOMEN -> lay WOMEN va UNISEX.
    if (audience) {
      const upperAudience = audience.toUpperCase();
      if (upperAudience === 'MEN') {
        whereClause.audience = { in: [GenderTarget.MEN, GenderTarget.UNISEX] };
      } else if (upperAudience === 'WOMEN') {
        whereClause.audience = { in: [GenderTarget.WOMEN, GenderTarget.UNISEX] };
      } else if (upperAudience === 'UNISEX') {
        whereClause.audience = GenderTarget.UNISEX;
      }
    }

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.formatProductSummary(p));
  }

  /**
   * UC-12: Tim kiem san pham theo tu khoa (keyword search)
   */
  async searchProducts(keyword: string) {
    if (!keyword || keyword.trim() === '') {
      return this.getProductList();
    }

    const term = keyword.trim().toLowerCase();

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { style: { contains: term, mode: 'insensitive' } },
          { material: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.formatProductSummary(p));
  }

  /**
   * UC-14: Xem chi tiet san pham (Product Detail Page - PDP)
   */
  async getProductDetails(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isDeleted: false,
      },
      include: {
        category: true,
        variants: {
          orderBy: { size: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('San pham khong ton tai hoac da bi go bo.');
    }

    const summary = this.formatProductSummary(product);

    return {
      ...summary,
      description: product.description,
      style: product.style,
      material: product.material,
      images: product.images,
      sizeChart: product.sizeChartJson,
      variants: product.variants.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        sku: v.sku,
        price: v.price ?? product.basePrice,
        stockQty: v.stockQty,
        isOutOfStock: v.stockQty <= 0, // BR-29
        isLowStock: v.stockQty > 0 && v.stockQty < 10, // BR-28
      })),
    };
  }

  /**
   * UC-17: Quan ly san pham - Lay toan bo danh sach cho Admin (CRUD)
   */
  async getAllProductsForAdmin() {
    const products = await this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) => this.formatProductSummary(p));
  }

  /**
   * UC-17: Quan ly san pham - Tao moi san pham
   */
  async createProduct(dto: CreateProductDto) {
    // Kiem tra trung slug
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug san pham "${dto.slug}" da ton tai.`);
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        basePrice: dto.basePrice,
        originalPrice: dto.originalPrice,
        audience: dto.audience,
        style: dto.style,
        material: dto.material,
        images: dto.images ?? [],
        sizeChartJson: dto.sizeChartJson,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return this.formatProductSummary(product);
  }

  /**
   * UC-17: Quan ly san pham - Cap nhat san pham
   */
  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.isDeleted) {
      throw new NotFoundException('San pham khong ton tai.');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" da duoc su dung.`);
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        basePrice: dto.basePrice,
        originalPrice: dto.originalPrice,
        audience: dto.audience,
        style: dto.style,
        material: dto.material,
        images: dto.images,
        sizeChartJson: dto.sizeChartJson,
        isActive: dto.isActive,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return this.formatProductSummary(updated);
  }

  /**
   * UC-17: Quan ly san pham - Xoa mem san pham (Soft Delete - BR-36)
   */
  async softDeleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('San pham khong ton tai.');
    }

    // BR-36: Không xóa cứng khỏi cơ sở dữ liệu, chỉ đánh dấu isDeleted = true
    await this.prisma.product.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });

    return {
      success: true,
      message: `BR-36: Đã xóa mềm sản phẩm "${product.name}" an toàn thành công.`,
    };
  }

  /**
   * Helper format san pham voi cac Business Rules:
   * - BR-29: Kiem tra Out of Stock toan bo
   * - BR-28: Kiem tra canh bao Low Stock
   */
  private formatProductSummary(p: any) {
    const totalStock = p.variants.reduce((acc: number, v: any) => acc + v.stockQty, 0);
    const isOutOfStock = totalStock <= 0; // BR-29
    const hasLowStockVariant = p.variants.some((v: any) => v.stockQty > 0 && v.stockQty < 10); // BR-28

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: p.basePrice,
      originalPrice: p.originalPrice,
      audience: p.audience,
      categoryName: p.category?.name,
      categoryId: p.categoryId,
      thumbnail: p.images[0] || null,
      images: p.images,
      totalStock,
      isOutOfStock, // BR-29
      hasLowStockVariant, // BR-28
      isActive: p.isActive,
      variantCount: p.variants.length,
      createdAt: p.createdAt,
    };
  }
}

