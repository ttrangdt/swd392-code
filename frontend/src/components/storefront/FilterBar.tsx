/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React from 'react';
import { Category } from '../../types';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  selectedAudience: string;
  searchQuery: string;
  sortBy: string;
  onFilterChange: (catId: string, aud: string, search: string) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  selectedAudience,
  searchQuery,
  sortBy,
  onFilterChange,
  onSortChange,
  onReset,
}) => {
  const isFiltered = selectedCategory !== '' || selectedAudience !== '' || searchQuery !== '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, chất liệu vải, phong cách..."
            value={searchQuery}
            onChange={(e) =>
              onFilterChange(selectedCategory, selectedAudience, e.target.value)
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onFilterChange(selectedCategory, selectedAudience, '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 cursor-pointer"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/70 text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="stock-desc">Tồn kho nhiều nhất</option>
            <option value="stock-asc">Tồn kho ít nhất</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition border border-rose-200 cursor-pointer whitespace-nowrap"
            >
              Đặt lại
            </button>
          )}
        </div>
      </div>

      {/* Categories & Audience Pills */}
      <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Danh mục:
          </span>
          <button
            type="button"
            onClick={() => onFilterChange('', selectedAudience, searchQuery)}
            className={`text-xs px-3 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
              selectedCategory === ''
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onFilterChange(c.id, selectedAudience, searchQuery)}
              className={`text-xs px-3 py-1.5 rounded-xl transition-all font-semibold cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Audience Filter */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
          <span className="text-xs font-bold text-slate-500 px-2">
            Đối tượng:
          </span>
          {[
            { id: '', label: 'Tất cả' },
            { id: 'MEN', label: 'Nam' },
            { id: 'WOMEN', label: 'Nữ' },
            { id: 'UNISEX', label: 'Unisex' },
          ].map((aud) => (
            <button
              key={aud.id}
              type="button"
              onClick={() => onFilterChange(selectedCategory, aud.id, searchQuery)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all font-semibold cursor-pointer ${
                selectedAudience === aud.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {aud.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
