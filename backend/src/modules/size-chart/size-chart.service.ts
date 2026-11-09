import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FitPreference, RecommendSizeDto } from './dto/recommend-size.dto';
import { UpdateSizeChartDto } from './dto/update-size-chart.dto';

export interface SizeChartRow {
  size: string;
  length?: string;
  chest?: string;
  shoulder?: string;
  sleeve?: string;
  waist?: string;
  hips?: string;
  thigh?: string;
}

@Injectable()
export class SizeChartService {
  constructor(private readonly prisma: PrismaService) {}

  // Standard category fallback size charts (UC-15 Alternative Flow 1.1)
  private readonly categoryFallbacks: Record<string, { title: string; chart: SizeChartRow[] }> = {
    'ao-tops': {
      title: 'Bảng Size Áo Chuẩn Thierlavier (Tops Fallback)',
      chart: [
        { size: 'S', length: '68 cm', shoulder: '48 cm', chest: '104 cm', sleeve: '21 cm', waist: '72-76 cm' },
        { size: 'M', length: '71 cm', shoulder: '51 cm', chest: '110 cm', sleeve: '22 cm', waist: '76-80 cm' },
        { size: 'L', length: '74 cm', shoulder: '54 cm', chest: '116 cm', sleeve: '23 cm', waist: '80-86 cm' },
        { size: 'XL', length: '77 cm', shoulder: '57 cm', chest: '122 cm', sleeve: '24 cm', waist: '86-92 cm' },
        { size: 'XXL', length: '80 cm', shoulder: '60 cm', chest: '128 cm', sleeve: '25 cm', waist: '92-98 cm' },
      ],
    },
    'quan-bottoms': {
      title: 'Bảng Size Quần Chuẩn Thierlavier (Bottoms Fallback)',
      chart: [
        { size: 'S', length: '98 cm', waist: '72-76 cm', hips: '96 cm', thigh: '58 cm' },
        { size: 'M', length: '101 cm', waist: '76-80 cm', hips: '100 cm', thigh: '60 cm' },
        { size: 'L', length: '104 cm', waist: '80-85 cm', hips: '104 cm', thigh: '62 cm' },
        { size: 'XL', length: '107 cm', waist: '85-90 cm', hips: '108 cm', thigh: '64 cm' },
        { size: 'XXL', length: '110 cm', waist: '90-96 cm', hips: '112 cm', thigh: '66 cm' },
      ],
    },
    'ao-khoac-outerwear': {
      title: 'Bảng Size Áo Khoác & Hoodie Thierlavier (Outerwear Fallback)',
      chart: [
        { size: 'S', length: '69 cm', shoulder: '50 cm', chest: '112 cm', sleeve: '60 cm', waist: '74-78 cm' },
        { size: 'M', length: '72 cm', shoulder: '53 cm', chest: '118 cm', sleeve: '62 cm', waist: '78-84 cm' },
        { size: 'L', length: '75 cm', shoulder: '56 cm', chest: '124 cm', sleeve: '64 cm', waist: '84-90 cm' },
        { size: 'XL', length: '78 cm', shoulder: '59 cm', chest: '130 cm', sleeve: '66 cm', waist: '90-96 cm' },
        { size: 'XXL', length: '81 cm', shoulder: '62 cm', chest: '136 cm', sleeve: '68 cm', waist: '96-102 cm' },
      ],
    },
    'phu-kien-accessories': {
      title: 'Bảng Thông Số Phụ Kiện (Accessories Fallback)',
      chart: [
        { size: 'Freesize', length: 'Tiêu chuẩn', chest: '-', shoulder: '-', waist: 'Co giãn tự do' },
      ],
    },
  };

  /**
   * UC-15: View Size Chart for Product
   * Normal Flow: Retrieves product-specific size chart
   * Alternative Flow 1.1: Fallback to category size chart if product lacks custom chart
   */
  async getProductSizeChart(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        isDeleted: false,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    const customChart = product.sizeChartJson as unknown as SizeChartRow[] | null;
    const hasCustomChart = Array.isArray(customChart) && customChart.length > 0;

    const categorySlug = product.category?.slug || 'ao-tops';
    const fallback = this.categoryFallbacks[categorySlug] || this.categoryFallbacks['ao-tops'];

    return {
      productId: product.id,
      productName: product.name,
      categoryName: product.category?.name,
      categorySlug,
      isFallback: !hasCustomChart,
      chartTitle: hasCustomChart
        ? `Bảng thông số kích thước: ${product.name}`
        : fallback.title,
      chart: hasCustomChart ? customChart : fallback.chart,
      measurementUnit: 'cm',
      note: hasCustomChart
        ? 'Thông số may đo đo thực tế của sản phẩm (sai số cho phép ±1-2cm).'
        : 'Sản phẩm áp dụng bảng size quy chuẩn của danh mục (Alternative Flow 1.1).',
    };
  }

  /**
   * UC-15: Danh sach tat ca bang size tieu chuan theo danh muc
   */
  async getAllCategoryFallbacks() {
    return Object.entries(this.categoryFallbacks).map(([slug, data]) => ({
      categorySlug: slug,
      title: data.title,
      chart: data.chart,
    }));
  }

  /**
   * BR-19: Smart Size Recommendation Engine (Inference Algorithm)
   * The system automatically determines the Suggested Size by comparing
   * the customer's Body Profile (height, weight, fit) with the Size Chart.
   */
  async recommendSize(dto: RecommendSizeDto) {
    const { height, weight, fitPreference = FitPreference.REGULAR, chest, waist, productId } = dto;

    // Base BMI and size scoring
    // S:  150-165 cm, 45-55 kg
    // M:  162-172 cm, 55-65 kg
    // L:  168-179 cm, 65-76 kg
    // XL: 175-186 cm, 75-86 kg
    // XXL: 182-195 cm, 85-98 kg
    let baseScore = 0; // 1: S, 2: M, 3: L, 4: XL, 5: XXL

    if (height < 162 && weight < 54) {
      baseScore = 1; // S
    } else if (height <= 170 && weight <= 64) {
      baseScore = 2; // M
    } else if (height <= 178 && weight <= 75) {
      baseScore = 3; // L
    } else if (height <= 185 && weight <= 86) {
      baseScore = 4; // XL
    } else {
      baseScore = 5; // XXL
    }

    // Border evaluation (Alternative Flow / Exception 1.0.E1 in UC-Trang.docx)
    let isBorderline = false;
    let borderlineSizes: [string, string] = ['M', 'L'];

    if ((height >= 168 && height <= 172) || (weight >= 63 && weight <= 66)) {
      isBorderline = true;
      borderlineSizes = ['M', 'L'];
    } else if ((height >= 176 && height <= 180) || (weight >= 74 && weight <= 77)) {
      isBorderline = true;
      borderlineSizes = ['L', 'XL'];
    } else if ((height >= 160 && height <= 164) || (weight >= 53 && weight <= 56)) {
      isBorderline = true;
      borderlineSizes = ['S', 'M'];
    }

    // Apply Fit Preference (BR-19)
    if (fitPreference === FitPreference.OVERSIZE) {
      baseScore = Math.min(5, baseScore + 1);
    } else if (fitPreference === FitPreference.FITTED) {
      baseScore = Math.max(1, baseScore - 1);
    }

    const sizeLabels = ['S', 'M', 'L', 'XL', 'XXL'];
    const recommendedSize = sizeLabels[baseScore - 1] || 'L';

    // Detailed advice
    let fitAdvice = '';
    if (fitPreference === FitPreference.OVERSIZE) {
      fitAdvice = `Với chiều cao ${height}cm, cân nặng ${weight}kg và sở thích mặc rộng rãi (Oversize), Size ${recommendedSize} sẽ mang lại độ rủ vai và phom áo streetwear chuẩn nhất.`;
    } else if (fitPreference === FitPreference.FITTED) {
      fitAdvice = `Với form dáng ôm sát vừa người (Fitted), Size ${recommendedSize} giúp tôn dáng gọn gàng, không bị chùng vải.`;
    } else {
      fitAdvice = `Size ${recommendedSize} là kích thước chuẩn xác nhất theo bảng thông số nhân trắc học của Thierlavier.`;
    }

    if (isBorderline) {
      fitAdvice += ` Lưu ý: Số đo của bạn đang tiệm cận giữa Size ${borderlineSizes[0]} và ${borderlineSizes[1]}; nếu thích phom thoải mái hãy chọn ${borderlineSizes[1]}.`;
    }

    return {
      recommendedSize,
      fitPreference,
      height,
      weight,
      isBorderline,
      fitAdvice,
      confidenceScore: isBorderline ? '88%' : '96%',
      ruleApplied: 'BR-19: Smart Size Inference Engine',
    };
  }

  /**
   * UC-17 & UC-15: Cap nhat bang size cho san pham
   */
  async updateProductSizeChart(productId: string, dto: UpdateSizeChartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.isDeleted) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        sizeChartJson: dto.sizeChart as any,
      },
    });

    return {
      success: true,
      message: `Đã cập nhật bảng thông số kích cỡ cho sản phẩm "${product.name}"`,
      sizeChart: dto.sizeChart,
    };
  }
}
