import React, { useState, useMemo } from 'react';
import { Category, ProductSummary } from '../../types';
import { FilterBar } from './FilterBar';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../common/EmptyState';

interface CatalogViewProps {
  products: ProductSummary[];
  categories: Category[];
  selectedCategory: string;
  selectedAudience: string;
  searchQuery: string;
  onFilterChange: (catId: string, aud: string, search: string) => void;
  onViewProductDetail: (id: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  categories,
  selectedCategory,
  selectedAudience,
  searchQuery,
  onFilterChange,
  onViewProductDetail,
}) => {
  const [sortBy, setSortBy] = useState<string>('default');

  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.basePrice - b.basePrice);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.basePrice - a.basePrice);
    }
    if (sortBy === 'stock-desc') {
      return list.sort((a, b) => b.totalStock - a.totalStock);
    }
    if (sortBy === 'stock-asc') {
      return list.sort((a, b) => a.totalStock - b.totalStock);
    }
    return list;
  }, [products, sortBy]);

  const handleResetFilters = () => {
    onFilterChange('', '', '');
    setSortBy('default');
  };

  const selectedCategoryName =
    categories.find((c) => c.id === selectedCategory)?.name || 'Tất cả sản phẩm';

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedAudience={selectedAudience}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onFilterChange={onFilterChange}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Grid Header & Counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
            {selectedCategoryName}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200/80 text-slate-700">
            {sortedProducts.length} sản phẩm
          </span>
          {selectedAudience && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {selectedAudience === 'MEN' ? 'Nam' : selectedAudience === 'WOMEN' ? 'Nữ' : 'Unisex'}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description={
            searchQuery
              ? `Không có kết quả nào khớp với "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
              : 'Hiện chưa có sản phẩm nào thuộc bộ lọc này.'
          }
          onReset={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetail={onViewProductDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
