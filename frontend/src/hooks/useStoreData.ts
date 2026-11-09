/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Category,
  ProductSummary,
  ProductDetail,
} from '../types';
import { NavTab } from '../components/common/Navbar';

export function useStoreData() {
  const [activeTab, setActiveTab] = useState<NavTab>('catalog');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [adminProducts, setAdminProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Filters (UC-11 & UC-12)
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAudience, setSelectedAudience] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // PDP Modal (UC-14)
  const [selectedProductDetails, setSelectedProductDetails] = useState<ProductDetail | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // 1. Initial Data Fetching (UC-11)
  const loadStorefrontData = useCallback(async () => {
    try {
      const [catsRes, prodsRes] = await Promise.all([
        axios.get('/api/categories'),
        axios.get('/api/products'),
      ]);
      setCategories(catsRes.data);
      setProducts(prodsRes.data);
    } catch (err: any) {
      console.error(err);
      showToast('Lỗi khi tải dữ liệu sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadAdminProducts = useCallback(async () => {
    try {
      const res = await axios.get('/api/products/admin/all');
      setAdminProducts(res.data);
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi tải danh sách quản lý sản phẩm', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadStorefrontData();
  }, [loadStorefrontData]);

  useEffect(() => {
    if (activeTab === 'manage-products') {
      loadAdminProducts();
    }
  }, [activeTab, loadAdminProducts]);

  // 2. Filter & Search Handlers (UC-11 & UC-12)
  const handleFilterChange = useCallback(
    async (catId: string, aud: string, search: string) => {
      setSelectedCategory(catId);
      setSelectedAudience(aud);
      setSearchQuery(search);

      try {
        if (search && search.trim() !== '') {
          const res = await axios.get(`/api/products/search?q=${encodeURIComponent(search.trim())}`);
          let filtered = res.data;
          if (catId) filtered = filtered.filter((p: any) => p.categoryId === catId);
          if (aud) {
            if (aud === 'MEN')
              filtered = filtered.filter((p: any) => p.audience === 'MEN' || p.audience === 'UNISEX');
            else if (aud === 'WOMEN')
              filtered = filtered.filter((p: any) => p.audience === 'WOMEN' || p.audience === 'UNISEX');
            else if (aud === 'UNISEX')
              filtered = filtered.filter((p: any) => p.audience === 'UNISEX');
          }
          setProducts(filtered);
        } else {
          const params = new URLSearchParams();
          if (catId) params.append('categoryId', catId);
          if (aud) params.append('audience', aud);
          const res = await axios.get(`/api/products?${params.toString()}`);
          setProducts(res.data);
        }
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Lỗi khi lọc sản phẩm', 'error');
      }
    },
    [showToast]
  );

  // 3. View Product Detail (UC-14)
  const handleOpenProductDetail = useCallback(async (id: string) => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setSelectedProductDetails(res.data);
      setDetailModalOpen(true);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Lỗi khi tải chi tiết sản phẩm', 'error');
    }
  }, [showToast]);

  const handleCloseProductDetail = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedProductDetails(null);
  }, []);

  // 4. Create Product (UC-17)
  const handleCreateProduct = useCallback(
    async (productData: any) => {
      try {
        await axios.post('/api/products/admin', productData);
        showToast('Tạo sản phẩm mới thành công!', 'success');
        loadAdminProducts();
        loadStorefrontData();
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Lỗi khi tạo sản phẩm', 'error');
        throw err;
      }
    },
    [loadAdminProducts, loadStorefrontData, showToast]
  );

  // 5. Soft Delete Product (UC-17 & BR-36)
  const handleSoftDeleteProduct = useCallback(
    async (id: string, name: string) => {
      if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"?`)) {
        return;
      }

      try {
        await axios.delete(`/api/products/admin/${id}`);
        showToast('Đã xóa sản phẩm thành công!', 'success');
        loadAdminProducts();
        loadStorefrontData();
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Lỗi khi xóa sản phẩm', 'error');
      }
    },
    [loadAdminProducts, loadStorefrontData, showToast]
  );

  const navigateToSizeGuide = useCallback(() => {
    setActiveTab('size-guide');
  }, []);

  return {
    activeTab,
    setActiveTab,
    categories,
    products,
    adminProducts,
    loading,
    toast,
    showToast,
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
  };
}
