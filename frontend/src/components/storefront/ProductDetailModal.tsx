/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React, { useState, useEffect } from 'react';
import { ProductDetail } from '../../types';
import { SizeChartModal } from '../sizechart/SizeChartModal';
import { X, Check, AlertTriangle, Ruler, Box, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: ProductDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'sizechart'>('info');
  const [imageError, setImageError] = useState(false);
  const [sizeChartModalOpen, setSizeChartModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sizeChartModalOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, sizeChartModalOpen]);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const images = product.images.length > 0 ? product.images : [product.thumbnail || ''];

  const handleSelectRecommendedSize = (size: string) => {
    const matched = product.variants.find((v) => v.size.toUpperCase() === size.toUpperCase());
    if (matched) {
      setSelectedVariantId(matched.id);
    }
  };

  return (
    <>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      >
        <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-800 bg-slate-200/80 px-2.5 py-1 rounded-lg">
                {product.categoryName}
              </span>
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {product.audience}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Gallery */}
            <div className="space-y-3">
              <div className="aspect-[4/5] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-inner">
                {images[selectedImageIndex] && !imageError ? (
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <Box className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs font-medium">Chưa có ảnh</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  {product.isOutOfStock ? (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
                      Hết hàng
                    </span>
                  ) : product.hasLowStockVariant ? (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Sắp hết hàng
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-slate-900'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Information & Variants */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {product.basePrice.toLocaleString('vi-VN')} đ
                    </span>
                    {product.originalPrice && product.originalPrice > product.basePrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-Tabs: Info vs Size Chart */}
                <div className="flex border-b border-slate-200 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('info')}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeSubTab === 'info'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Thông tin & Biến thể
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('sizechart')}
                    className={`pb-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                      activeSubTab === 'sizechart'
                        ? 'border-slate-900 text-slate-900'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Bảng kích cỡ
                  </button>
                </div>

                {activeSubTab === 'info' ? (
                  <div className="space-y-4">
                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">
                          Phong cách:
                        </span>
                        <span className="font-bold text-slate-800">{product.style || 'Streetwear'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">
                          Chất liệu vải:
                        </span>
                        <span className="font-bold text-slate-800">
                          {product.material || '100% Cotton'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 mb-1">Mô tả sản phẩm:</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                      </p>
                    </div>

                    {/* Variant Selection */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Chọn biến thể:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSizeChartModalOpen(true)}
                          className="text-xs font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 underline cursor-pointer"
                        >
                          <Ruler className="w-3.5 h-3.5" />
                          <span>Xem bảng size & gợi ý</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {product.variants.map((v) => {
                          const isSelected = selectedVariantId === v.id;
                          const isOut = v.stockQty <= 0;
                          const isLow = v.stockQty > 0 && v.stockQty < 10;

                          return (
                            <div
                              key={v.id}
                              onClick={() => setSelectedVariantId(v.id)}
                              className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-slate-900 bg-slate-50 shadow-xs'
                                  : 'border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                    isSelected
                                      ? 'border-slate-900 bg-slate-900 text-white'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  {isSelected && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <span className="font-bold text-slate-900">
                                  {v.color} · Size: <span className="font-black">{v.size}</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isOut ? (
                                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    Hết hàng
                                  </span>
                                ) : isLow ? (
                                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                                    Còn {v.stockQty} sản phẩm
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                    Còn {v.stockQty} sản phẩm
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Size Chart Section */
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>Thông số đo chuẩn (cm) cho sản phẩm này.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSizeChartModalOpen(true)}
                        className="font-bold text-slate-900 underline flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gợi ý size</span>
                      </button>
                    </div>

                    {product.sizeChart && product.sizeChart.length > 0 ? (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Size</th>
                              <th className="py-2.5 px-3">Ngực</th>
                              <th className="py-2.5 px-3">Dài</th>
                              <th className="py-2.5 px-3">Vai</th>
                              <th className="py-2.5 px-3">Eo</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {product.sizeChart.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="py-2.5 px-3 font-black text-slate-900 bg-slate-50/50">
                                  {row.size}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">{row.chest}</td>
                                <td className="py-2.5 px-3 text-slate-600">{row.length}</td>
                                <td className="py-2.5 px-3 text-slate-600">{row.shoulder}</td>
                                <td className="py-2.5 px-3 text-slate-600">{row.waist}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                        Chưa có thông số kích cỡ cho sản phẩm này.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Tổng tồn kho: <strong>{product.totalStock}</strong> cái
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Size Chart Modal */}
      <SizeChartModal
        productIdOrSlug={product.id}
        productName={product.name}
        isOpen={sizeChartModalOpen}
        onClose={() => setSizeChartModalOpen(false)}
        onSelectSize={handleSelectRecommendedSize}
      />
    </>
  );
};
