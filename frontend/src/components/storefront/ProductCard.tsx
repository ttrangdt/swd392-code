/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React from 'react';
import { ProductSummary } from '../../types';
import { Eye, AlertTriangle, Box } from 'lucide-react';

interface ProductCardProps {
  product: ProductSummary;
  onViewDetail: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetail,
}) => {
  const discountPercent =
    product.originalPrice && product.originalPrice > product.basePrice
      ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      {/* Product Image Area */}
      <div>
        <div
          className="relative aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer"
          onClick={() => onViewDetail(product.id)}
        >
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Box className="w-10 h-10 stroke-[1.5]" />
              <span className="text-xs font-medium">Chưa có ảnh</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-start justify-between pointer-events-none">
            <div className="flex flex-col gap-1">
              <span className="bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                {product.audience}
              </span>
              {discountPercent && (
                <span className="bg-rose-500/95 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 items-end">
              {product.isOutOfStock ? (
                <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  Hết hàng
                </span>
              ) : product.hasLowStockVariant ? (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Sắp hết hàng
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {product.categoryName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {product.variantCount} biến thể
            </span>
          </div>

          <h3
            onClick={() => onViewDetail(product.id)}
            className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-emerald-700 transition cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-black text-slate-900 tracking-tight">
              {product.basePrice.toLocaleString('vi-VN')} đ
            </span>
            {product.originalPrice && product.originalPrice > product.basePrice && (
              <span className="text-xs text-slate-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')} đ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="p-4 pt-0">
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-3">
          <span>Tồn kho:</span>
          <span
            className={`font-bold ${
              product.totalStock === 0
                ? 'text-rose-600'
                : product.totalStock < 10
                ? 'text-amber-600'
                : 'text-slate-800'
            }`}
          >
            {product.totalStock} sản phẩm
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetail(product.id)}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Xem chi tiết</span>
        </button>
      </div>
    </div>
  );
};
