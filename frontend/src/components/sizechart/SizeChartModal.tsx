import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SizeChartRow, ProductSizeChartResponse, SizeRecommendationResult } from '../../types';
import { X, Ruler, Sparkles, Check, ArrowRight, Info } from 'lucide-react';

interface SizeChartModalProps {
  productIdOrSlug: string | null;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  productIdOrSlug,
  productName,
  isOpen,
  onClose,
  onSelectSize,
}) => {
  if (!isOpen || !productIdOrSlug) return null;

  const [activeTab, setActiveTab] = useState<'chart' | 'recommend'>('chart');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ProductSizeChartResponse | null>(null);

  // Smart size recommendation state (BR-19)
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(64);
  const [fitPreference, setFitPreference] = useState<'FITTED' | 'REGULAR' | 'OVERSIZE'>('REGULAR');
  const [calculating, setCalculating] = useState(false);
  const [recommendation, setRecommendation] = useState<SizeRecommendationResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!productIdOrSlug) return;
    setLoading(true);
    axios
      .get(`/api/size-charts/product/${productIdOrSlug}`)
      .then((res) => {
        setChartData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching size chart:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productIdOrSlug]);

  const handleCalculateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await axios.post('/api/size-charts/recommend', {
        height: Number(height),
        weight: Number(weight),
        fitPreference,
        productId: productIdOrSlug,
      });
      setRecommendation(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base leading-snug">
                Bảng thông số kích thước (Size Chart)
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-md">
                {productName || chartData?.productName || 'Sản phẩm Thierlavier'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: Bảng đo vs Gợi ý size chuẩn */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-6 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chart'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Thông số đo chi tiết (cm)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recommend')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recommend'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý size thông minh</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
              <div className="w-7 h-7 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Đang tải bảng thông số kích cỡ...</span>
            </div>
          ) : activeTab === 'chart' ? (
            /* Tab 1: Formatted Table (POST-1 in UC-15) */
            <div className="space-y-4">
              {chartData?.isFallback && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Bảng size quy chuẩn danh mục:</span> Sản phẩm này áp dụng quy cách kích cỡ tiêu chuẩn của thương hiệu.
                  </div>
                </div>
              )}

              {chartData?.chart && chartData.chart.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Size</th>
                        {chartData.chart[0].length && <th className="py-3 px-4">Chiều dài</th>}
                        {chartData.chart[0].shoulder && <th className="py-3 px-4">Rộng vai</th>}
                        {chartData.chart[0].chest && <th className="py-3 px-4">Vòng ngực</th>}
                        {chartData.chart[0].sleeve && <th className="py-3 px-4">Dài tay</th>}
                        {chartData.chart[0].waist && <th className="py-3 px-4">Vòng eo</th>}
                        {chartData.chart[0].hips && <th className="py-3 px-4">Vòng mông</th>}
                        {chartData.chart[0].thigh && <th className="py-3 px-4">Rộng đùi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {chartData.chart.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-black text-slate-900 bg-slate-50/50">
                            {row.size}
                          </td>
                          {row.length && <td className="py-3 px-4 text-slate-600 font-medium">{row.length}</td>}
                          {row.shoulder && <td className="py-3 px-4 text-slate-600 font-medium">{row.shoulder}</td>}
                          {row.chest && <td className="py-3 px-4 text-slate-600 font-medium">{row.chest}</td>}
                          {row.sleeve && <td className="py-3 px-4 text-slate-600 font-medium">{row.sleeve}</td>}
                          {row.waist && <td className="py-3 px-4 text-slate-600 font-medium">{row.waist}</td>}
                          {row.hips && <td className="py-3 px-4 text-slate-600 font-medium">{row.hips}</td>}
                          {row.thigh && <td className="py-3 px-4 text-slate-600 font-medium">{row.thigh}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed rounded-2xl">
                  Chưa có thông số đo cho sản phẩm này.
                </div>
              )}

              {/* Measurement Guide */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 text-slate-600">
                <p className="font-bold text-slate-900">Hướng dẫn cách đo tại nhà:</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
                  <li><strong>Chiều dài áo:</strong> Đo từ điểm cao nhất của vai xuôi thẳng xuống viền lai áo.</li>
                  <li><strong>Vòng ngực:</strong> Dùng thước dây vòng qua điểm nở nhất của lồng ngực, giữ thước phẳng ngang.</li>
                  <li><strong>Rộng vai:</strong> Đo khoảng cách ngang từ mép vai trái sang mép vai phải sau lưng.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Tab 2: Smart Size Recommendation Tool (BR-19) */
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <h4 className="text-xs font-bold text-slate-900">
                    Thuật toán đối chiếu thông số cơ thể (Body Profile Matching)
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhập chiều cao, cân nặng và form dáng mong muốn để hệ thống tự động suy luận kích thước phù hợp nhất với phom dáng của bạn.
                </p>
              </div>

              <form onSubmit={handleCalculateRecommendation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Height */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Chiều cao:</span>
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
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>145 cm</span>
                      <span>200 cm</span>
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Cân nặng:</span>
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
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>40 kg</span>
                      <span>110 kg</span>
                    </div>
                  </div>
                </div>

                {/* Fit Preference */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Phong cách mặc mong muốn:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'FITTED', label: 'Ôm vừa (Fitted)', desc: 'Gọn gàng, vừa vặn' },
                      { id: 'REGULAR', label: 'Tiêu chuẩn (Regular)', desc: 'Thoải mái hàng ngày' },
                      { id: 'OVERSIZE', label: 'Rộng rãi (Oversize)', desc: 'Phom Streetwear rộng' },
                    ].map((fit) => (
                      <button
                        key={fit.id}
                        type="button"
                        onClick={() => setFitPreference(fit.id as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          fitPreference === fit.id
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs">{fit.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            fitPreference === fit.id ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {fit.desc}
                        </div>
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
                  <span>{calculating ? 'Đang phân tích...' : 'Xem gợi ý kích cỡ chuẩn'}</span>
                </button>
              </form>

              {/* Recommendation Result Card */}
              {recommendation && (
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-slate-800 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Kết quả suy luận kích cỡ:
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Độ chuẩn xác: {recommendation.confidenceScore}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-3xl font-black text-slate-900">
                      Size {recommendation.recommendedSize}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Form: {recommendation.fitPreference}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {recommendation.fitAdvice}
                  </p>

                  {onSelectSize && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSize(recommendation.recommendedSize);
                        onClose();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      <span>Chọn Size {recommendation.recommendedSize} cho sản phẩm này ngay</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Đơn vị đo: centimet (cm)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Đóng bảng size
          </button>
        </div>
      </div>
    </div>
  );
};

