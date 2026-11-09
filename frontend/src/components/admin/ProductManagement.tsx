/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React, { useState, useMemo } from 'react';
import { Category, ProductSummary } from '../../types';
import { CreateProductModal } from './CreateProductModal';
import { SizeChartModal } from '../sizechart/SizeChartModal';
import {
  Plus,
  Trash2,
  Ruler,
  Search,
  Package,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface ProductManagementProps {
  products: ProductSummary[];
  categories: Category[];
  onCreateProduct: (productData: any) => Promise<void>;
  onSoftDeleteProduct: (id: string, name: string) => Promise<void>;
  onViewSizeChart: (productId: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  categories,
  onCreateProduct,
  onSoftDeleteProduct,
  onViewSizeChart,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sizeModalProductId, setSizeModalProductId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory ? p.categoryId === filterCategory : true;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, filterCategory]);

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => p.isOutOfStock).length;
  const lowStockCount = products.filter((p) => p.hasLowStockVariant).length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.totalStock, 0);

  const selectedProductForSize = products.find((p) => p.id === sizeModalProductId);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tổng sản phẩm</span>
            <Layers className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Trong danh mục</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tổng tồn kho</span>
            <Package className="w-4 h-4 text-slate-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalInventoryUnits}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Tất cả biến thể</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Sắp hết hàng</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{lowStockCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Dưới 10 sản phẩm</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Hết hàng</span>
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          </div>
          <div className="text-2xl font-black text-rose-600">{outOfStockCount}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Số lượng = 0</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Action Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Danh sách sản phẩm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý thông tin, phân loại danh mục, giá bán và cấu hình bảng kích cỡ.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc đường dẫn sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Danh mục:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">Danh mục</th>
                <th className="py-3 px-4">Giá bán</th>
                <th className="py-3 px-4">Tồn kho</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Không tìm thấy sản phẩm nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    {/* Product Name & Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-13 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {p.thumbnail ? (
                            <img
                              src={p.thumbnail}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                            {p.name}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400 truncate">
                            /{p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & Audience */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {p.categoryName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {p.audience}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 text-sm">
                        {p.basePrice.toLocaleString('vi-VN')} đ
                      </span>
                      {p.originalPrice && p.originalPrice > p.basePrice && (
                        <span className="text-[11px] text-slate-400 line-through block">
                          {p.originalPrice.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">
                        {p.totalStock} cái
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {p.variantCount} biến thể
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {p.isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          Hết hàng
                        </span>
                      ) : p.hasLowStockVariant ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Sắp hết hàng
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          Đang bán
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSizeModalProductId(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
                          title="Xem thông số bảng size"
                        >
                          <Ruler className="w-3.5 h-3.5 text-slate-600" />
                          <span>Bảng Size</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSoftDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                          title="Xóa sản phẩm này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Product */}
      <CreateProductModal
        categories={categories}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={onCreateProduct}
      />

      {/* Modal View Size Chart for Product */}
      <SizeChartModal
        productIdOrSlug={sizeModalProductId}
        productName={selectedProductForSize?.name}
        isOpen={!!sizeModalProductId}
        onClose={() => setSizeModalProductId(null)}
      />
    </div>
  );
};
