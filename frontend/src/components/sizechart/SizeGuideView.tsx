/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Category, ProductSummary, CategoryFallbackChart, SizeRecommendationResult } from '../../types';
import { Ruler, Sparkles, Check, Info, Shirt, Layers, ArrowRight } from 'lucide-react';

interface SizeGuideViewProps {
  categories: Category[];
  products: ProductSummary[];
  onViewProductDetail: (productId: string) => void;
}

export const SizeGuideView: React.FC<SizeGuideViewProps> = ({
  categories,
  products,
  onViewProductDetail,
}) => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('ao-tops');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [categoryFallbacks, setCategoryFallbacks] = useState<CategoryFallbackChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customProductChart, setCustomProductChart] = useState<any>(null);

  // Recommendation engine state (BR-19)
  const [height, setHeight] = useState<number>(172);
  const [weight, setWeight] = useState<number>(65);
  const [fitPreference, setFitPreference] = useState<'FITTED' | 'REGULAR' | 'OVERSIZE'>('OVERSIZE');
  const [calculating, setCalculating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<SizeRecommendationResult | null>(null);

  // Load category fallback charts (UC-15 Alternative Flow 1.1)
  useEffect(() => {
    axios
      .get('/api/size-charts/categories')
      .then((res) => {
        setCategoryFallbacks(res.data);
      })
      .catch((err) => {
        console.error('Error loading fallback size charts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // When a product is selected, load product-specific size chart
  useEffect(() => {
    if (!selectedProductId) {
      setCustomProductChart(null);
      return;
    }
    axios
      .get(`/api/size-charts/product/${selectedProductId}`)
      .then((res) => {
        setCustomProductChart(res.data);
      })
      .catch((err) => {
        console.error('Error fetching product size chart:', err);
      });
  }, [selectedProductId]);

  const handleCalculateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await axios.post('/api/size-charts/recommend', {
        height: Number(height),
        weight: Number(weight),
        fitPreference,
        productId: selectedProductId || undefined,
        categorySlug: selectedCategorySlug,
      });
      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const currentCategoryFallback =
    categoryFallbacks.find((c) => c.categorySlug === selectedCategorySlug) || categoryFallbacks[0];

  const activeChart = customProductChart?.chart || currentCategoryFallback?.chart || [];
  const activeTitle = customProductChart?.chartTitle || currentCategoryFallback?.title || 'Bảng thông số kích cỡ';

  const categoryProducts = products.filter((p) => {
    const cat = categories.find((c) => c.id === p.categoryId);
    return cat?.slug === selectedCategorySlug;
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-slate-900 text-white">
              <Ruler className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Bảng Thông Số Kích Thước & Hướng Dẫn Chọn Size
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Tra cứu thông số may đo chi tiết (dài, rộng vai, vòng ngực, vòng eo) cho từng dòng sản phẩm và sử dụng công cụ đối chiếu cơ thể thông minh để chọn chuẩn size.
          </p>
        </div>

        {/* Quick Category Chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { slug: 'ao-tops', label: 'Áo (Tops)' },
            { slug: 'quan-bottoms', label: 'Quần (Bottoms)' },
            { slug: 'ao-khoac-outerwear', label: 'Áo Khoác (Outerwear)' },
            { slug: 'phu-kien-accessories', label: 'Phụ Kiện' },
          ].map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setSelectedProductId('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategorySlug === cat.slug
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Size Table on Left, Smart Recommendation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Formatted Measurement Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            {/* Table Header & Product Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">{activeTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đơn vị tính: <strong>centimet (cm)</strong> · Sai số may đo cho phép: ±1-2cm
                </p>
              </div>

              {/* Optional Product Specific Filter */}
              {categoryProducts.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Theo sản phẩm:
                  </span>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">Bảng chuẩn danh mục</option>
                    {categoryProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* The Formatted Table */}
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                Đang tải thông số kích thước...
              </div>
            ) : activeChart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Chưa có bảng kích thước cho danh mục này.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Kích cỡ (Size)</th>
                      {activeChart[0].length && <th className="py-3.5 px-4">Chiều dài</th>}
                      {activeChart[0].shoulder && <th className="py-3.5 px-4">Rộng vai</th>}
                      {activeChart[0].chest && <th className="py-3.5 px-4">Vòng ngực</th>}
                      {activeChart[0].sleeve && <th className="py-3.5 px-4">Dài tay</th>}
                      {activeChart[0].waist && <th className="py-3.5 px-4">Vòng eo</th>}
                      {activeChart[0].hips && <th className="py-3.5 px-4">Vòng mông</th>}
                      {activeChart[0].thigh && <th className="py-3.5 px-4">Rộng đùi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeChart.map((row: any, idx: number) => {
                      const isRecommended = recommendation?.recommendedSize === row.size;

                      return (
                        <tr
                          key={idx}
                          className={`transition ${
                            isRecommended
                              ? 'bg-emerald-50/80 font-bold'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                            <span>{row.size}</span>
                            {isRecommended && (
                              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                                Phù hợp bạn
                              </span>
                            )}
                          </td>
                          {row.length && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.length}</td>}
                          {row.shoulder && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.shoulder}</td>}
                          {row.chest && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.chest}</td>}
                          {row.sleeve && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.sleeve}</td>}
                          {row.waist && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.waist}</td>}
                          {row.hips && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.hips}</td>}
                          {row.thigh && <td className="py-3.5 px-4 text-slate-600 font-medium">{row.thigh}</td>}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* How to measure guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <span className="font-bold text-slate-900 block mb-1">1. Vòng ngực:</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Thước dây quấn quanh điểm nở nhất của ngực, thả lỏng ngực tự nhiên không siết chặt.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <span className="font-bold text-slate-900 block mb-1">2. Chiều dài áo:</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đo từ gáy hoặc đỉnh vai xuống tới ngang hông để đạt độ phủ phom mong muốn.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                <span className="font-bold text-slate-900 block mb-1">3. Rộng vai:</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Đo ngang qua điểm nối giữa vai và cánh tay. Phom oversize có độ vai rộng hơn thông thường.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Smart Size Recommendation Tool (BR-19) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm">Gợi ý kích cỡ thông minh</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Đối chiếu chiều cao, cân nặng và dáng người
                </p>
              </div>
            </div>

            <form onSubmit={handleCalculateRecommendation} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Chiều cao của bạn:</span>
                  <span className="font-mono text-slate-900">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="145"
                  max="200"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>145 cm</span>
                  <span>200 cm</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Cân nặng của bạn:</span>
                  <span className="font-mono text-slate-900">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="110"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>40 kg</span>
                  <span>110 kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Phong cách mặc ưu tiên:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'FITTED', label: 'Ôm vừa' },
                    { id: 'REGULAR', label: 'Tiêu chuẩn' },
                    { id: 'OVERSIZE', label: 'Rộng rãi' },
                  ].map((fit) => (
                    <button
                      key={fit.id}
                      type="button"
                      onClick={() => setFitPreference(fit.id as any)}
                      className={`py-2 px-2 rounded-xl border text-center transition cursor-pointer text-xs font-bold ${
                        fitPreference === fit.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {fit.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={calculating}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{calculating ? 'Đang phân tích...' : 'Tìm size phù hợp'}</span>
              </button>
            </form>

            {/* Recommendation Result */}
            {recommendation && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Kích cỡ khuyến nghị:
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                    Độ tin cậy: {recommendation.confidenceScore}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-3xl font-black text-white">
                    Size {recommendation.recommendedSize}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    (Form: {recommendation.fitPreference})
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {recommendation.fitAdvice}
                </p>
              </div>
            )}
          </div>

          {/* Quick link to Products */}
          {categoryProducts.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                Sản phẩm nổi bật thuộc danh mục này:
              </h4>
              <div className="space-y-2">
                {categoryProducts.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onViewProductDetail(p.id)}
                    className="p-2.5 rounded-xl border border-slate-200/70 hover:border-slate-300 flex items-center justify-between gap-3 transition cursor-pointer hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {p.basePrice.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

