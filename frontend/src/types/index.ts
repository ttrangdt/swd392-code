/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

export type GenderTarget = 'MEN' | 'WOMEN' | 'UNISEX';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Variant {
  id: string;
  productId: string;
  color: string;
  size: string;
  sku: string;
  price: number | null;
  stockQty: number;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
}

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

export interface ProductSizeChartResponse {
  productId: string;
  productName: string;
  categoryName?: string;
  categorySlug: string;
  isFallback: boolean;
  chartTitle: string;
  chart: SizeChartRow[];
  measurementUnit: string;
  note: string;
}

export interface CategoryFallbackChart {
  categorySlug: string;
  title: string;
  chart: SizeChartRow[];
}

export interface SizeRecommendationResult {
  recommendedSize: string;
  fitPreference: 'FITTED' | 'REGULAR' | 'OVERSIZE';
  height: number;
  weight: number;
  isBorderline: boolean;
  fitAdvice: string;
  confidenceScore: string;
  ruleApplied: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  originalPrice: number | null;
  audience: GenderTarget;
  categoryName: string;
  categoryId: string;
  thumbnail: string | null;
  totalStock: number;
  isOutOfStock: boolean;
  hasLowStockVariant: boolean;
  isActive: boolean;
  variantCount: number;
  createdAt?: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  style: string;
  material: string;
  images: string[];
  sizeChart: SizeChartRow[] | null;
  variants: Variant[];
}
