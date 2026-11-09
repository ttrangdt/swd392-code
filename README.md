<!--
-SE1990_NJ
-HE195077
-Version 1.0
-09/11/2026
-Copyright Notice
-->

# Thierlavier FSMS - Module Đinh Thị Thu Trang (Product Discovery & Catalog)

Dự án này là phân hệ độc lập của **Đinh Thị Thu Trang** trong đồ án SWD392 (FSMS), thực thi hoàn chỉnh **5 Use Cases** theo tài liệu `UC-Trang.docx`, `UC_Business Rule.xlsx`, và `Group 5 - Course Project Report - G5.docx`:

## 5 Use Cases Được Triển Khai:
1. **UC-11: View Product List (Xem danh sách sản phẩm - Storefront)**:
   - Duyệt sản phẩm theo danh mục (Áo, Quần, Áo khoác, Phụ kiện) và đối tượng (Nam, Nữ, Unisex).
   - Ràng buộc **BR-20**: Các sản phẩm phân loại là "Unisex" sẽ tự động hiển thị trong cả danh mục thời trang Nam và Nữ.
   - Ràng buộc **BR-29**: Tự động dán nhãn "HẾT HÀNG (Out of Stock)" nếu tổng số lượng tồn kho của tất cả các biến thể bằng 0.
2. **UC-12: Search Products (Tìm kiếm sản phẩm - Storefront)**:
   - Tìm kiếm sản phẩm thời gian thực theo từ khóa khớp với tên sản phẩm, mô tả, chất liệu vải, hoặc phong cách thời trang.
3. **UC-14: View Product Details (Xem chi tiết sản phẩm - Storefront)**:
   - Hiển thị trang chi tiết sản phẩm (PDP): Thư viện ảnh, mô tả, chất liệu, phong cách, giá bán, giá gốc.
   - Bảng phân loại biến thể màu sắc và kích cỡ với trạng thái tồn kho thực tế của từng biến thể.
   - Tích hợp nút xem nhanh Bảng kích cỡ (Size Chart) và công cụ suy luận size (UC-15).
4. **UC-15: View Size Chart (Bảng thông số kích thước & Gợi ý Size thông minh - Storefront / PDP)**:
   - **Bảng kích cỡ chi tiết**: Hiển thị bảng thông số may đo (chiều dài, rộng vai, vòng ngực, dài tay, vòng eo, vòng mông/đùi) theo từng size (S, M, L, XL, XXL) cho sản phẩm đang xem.
   - **Cơ chế Fallback theo danh mục (Alternative Flow 1.1)**: Nếu sản phẩm chưa có bảng size riêng, hệ thống tự động tải bảng size quy chuẩn của danh mục (Áo, Quần, Áo khoác, Phụ kiện).
   - **Thuật toán Gợi ý Size chuẩn (BR-19)**: Đối chiếu thông số nhân trắc học của khách hàng (Chiều cao cm, Cân nặng kg, Form dáng mong muốn: Ôm vừa / Tiêu chuẩn / Rộng rãi) với giới hạn bảng size để suy luận size tối ưu kèm lời khuyên độ vừa vặn và tự động chọn size trên PDP.
5. **UC-17: Manage Products (Quản lý sản phẩm - Admin/Staff CRUD)**:
   - Thêm sản phẩm mới với đầy đủ thuộc tính, phân loại đối tượng (BR-20), danh mục, giá cả và thông số bảng size.
   - Xem và cập nhật danh sách Master Products.
   - Xóa mềm sản phẩm tuân thủ **BR-36 (Soft Delete Data)**: Sản phẩm không bị xóa cứng khỏi cơ sở dữ liệu mà được đánh dấu `isDeleted = true` để bảo toàn dữ liệu lịch sử.

## Cấu hình Môi trường & Database:
- Database: PostgreSQL với cơ sở dữ liệu riêng biệt `fsms_trang`.
- Backend Port: `3002` (API: `http://localhost:3002/api`)
- Frontend Port: `5175` (`http://localhost:5175`)

## Hướng dẫn Chạy:

### 1. Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run start:dev
```

### 2. Frontend:
```bash
cd frontend
npm install
npm run dev
```
Giao diện hoạt động tại: `http://localhost:5175`
