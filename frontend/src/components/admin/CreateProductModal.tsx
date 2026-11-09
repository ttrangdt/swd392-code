import React, { useState, useEffect } from 'react';
import { Category, GenderTarget } from '../../types';
import { X, Plus, Check } from 'lucide-react';

interface CreateProductModalProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<void>;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  categories,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: 290000,
    originalPrice: 350000,
    audience: 'UNISEX' as GenderTarget,
    style: 'Streetwear Oversize',
    material: '100% Cotton Compact 280gsm',
    images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    categoryId: categories[0]?.id || '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const standardSizeChart = [
        { size: 'S', chest: '104 cm', length: '68 cm', shoulder: '48 cm', waist: '72-76 cm' },
        { size: 'M', chest: '110 cm', length: '71 cm', shoulder: '51 cm', waist: '76-80 cm' },
        { size: 'L', chest: '116 cm', length: '74 cm', shoulder: '54 cm', waist: '80-86 cm' },
        { size: 'XL', chest: '122 cm', length: '77 cm', shoulder: '57 cm', waist: '86-92 cm' },
      ];

      await onSubmit({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        basePrice: Number(formData.basePrice),
        originalPrice: Number(formData.originalPrice),
        audience: formData.audience,
        style: formData.style,
        material: formData.material,
        images: [formData.images],
        sizeChartJson: standardSizeChart,
        categoryId: formData.categoryId || categories[0]?.id,
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-black text-slate-900 text-base">
              Thêm sản phẩm mới
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Nhập các thuộc tính cơ bản của mẫu thiết kế thời trang
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên sản phẩm: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="VD: Áo Thun Nam Nữ Thierlavier Acid Wash"
              className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Đường dẫn (Slug): <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="ao-thun-nam-nu-thierlavier-acid-wash"
              className="w-full text-xs font-mono border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Danh mục:
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đối tượng khách hàng:
              </label>
              <select
                value={formData.audience}
                onChange={(e: any) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="UNISEX">Unisex (Nam & Nữ)</option>
                <option value="MEN">Nam</option>
                <option value="WOMEN">Nữ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giá bán (VNĐ): <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Giá gốc (VNĐ):
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full text-xs font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phong cách:
              </label>
              <input
                type="text"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                placeholder="VD: Streetwear Minimalist"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chất liệu vải:
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="VD: 100% Cotton 280gsm"
                className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL hình ảnh:
            </label>
            <input
              type="text"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô tả chi tiết:
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả sản phẩm..."
              className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50/80 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Đang tạo...' : 'Lưu sản phẩm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
