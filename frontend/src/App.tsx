/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import React from 'react';
import { useStoreData } from './hooks/useStoreData';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { CatalogView } from './components/storefront/CatalogView';
import { SizeGuideView } from './components/sizechart/SizeGuideView';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { ProductManagement } from './components/admin/ProductManagement';

export default function App() {
  const {
    activeTab,
    setActiveTab,
    categories,
    products,
    adminProducts,
    loading,
    toast,
    closeToast,
    selectedCategory,
    selectedAudience,
    searchQuery,
    selectedProductDetails,
    detailModalOpen,
    handleFilterChange,
    handleOpenProductDetail,
    handleCloseProductDetail,
    handleCreateProduct,
    handleSoftDeleteProduct,
    navigateToSizeGuide,
  } = useStoreData();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={closeToast} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        productCount={products.length}
      />

      {/* Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400">
              Đang tải dữ liệu sản phẩm...
            </p>
          </div>
        ) : (
          <>
            {/* TAB 1: CỬA HÀNG (UC-11, UC-12, UC-14) */}
            {activeTab === 'catalog' && (
              <CatalogView
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                selectedAudience={selectedAudience}
                searchQuery={searchQuery}
                onFilterChange={handleFilterChange}
                onViewProductDetail={handleOpenProductDetail}
              />
            )}

            {/* TAB 2: BẢNG KÍCH CỠ & GỢI Ý SIZE (UC-15 - BR-19) */}
            {activeTab === 'size-guide' && (
              <SizeGuideView
                categories={categories}
                products={products}
                onViewProductDetail={handleOpenProductDetail}
              />
            )}

            {/* TAB 3: QUẢN LÝ SẢN PHẨM (UC-17) */}
            {activeTab === 'manage-products' && (
              <ProductManagement
                products={adminProducts}
                categories={categories}
                onCreateProduct={handleCreateProduct}
                onSoftDeleteProduct={handleSoftDeleteProduct}
                onViewSizeChart={(id) => {
                  handleOpenProductDetail(id);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetails}
        isOpen={detailModalOpen}
        onClose={handleCloseProductDetail}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">THIERLAVIER STUDIO</span>
            <span>—</span>
            <span>Hệ thống phân phối và quản lý sản phẩm thời trang.</span>
          </div>
          <div className="text-[11px] text-slate-400">
            © 2026 Thierlavier. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
