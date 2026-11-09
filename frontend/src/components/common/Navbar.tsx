import React from 'react';
import { ShoppingBag, Layers, Ruler } from 'lucide-react';

export type NavTab = 'catalog' | 'size-guide' | 'manage-products';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  productCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  productCount,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm">
              TL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900">
                  THIERLAVIER
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 tracking-wide uppercase">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Catalog & Bảng Kích Cỡ Thời Trang
              </p>
            </div>
          </div>

          {/* Clean Segmented Navigation */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => onTabChange('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-slate-700" />
              <span>Cửa hàng</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">
                {productCount}
              </span>
            </button>

            <button
              onClick={() => onTabChange('size-guide')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'size-guide'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Ruler className="w-3.5 h-3.5 text-slate-700" />
              <span>Bảng kích cỡ</span>
            </button>

            <button
              onClick={() => onTabChange('manage-products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'manage-products'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              <span>Quản lý sản phẩm</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
