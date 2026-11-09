-- -SE1990_NJ
-- -HE195077
-- -Version 1.0
-- -09/11/2026
-- -Copyright Notice

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, name, slug, description, "isActive", "createdAt", "updatedAt") VALUES ('d0f4314b-9b11-4703-8af2-9f17a83705c0', 'Áo (Tops)', 'ao-tops', 'Áo thun, áo polo, áo sơ mi streetwear phom dáng rộng rãi hiện đại.', true, '2026-11-08 23:33:00.186', '2026-11-08 23:33:00.186');
INSERT INTO public.categories (id, name, slug, description, "isActive", "createdAt", "updatedAt") VALUES ('1ca9073b-6cb0-4bb8-92da-f6e23cdc51bc', 'Quần (Bottoms)', 'quan-bottoms', 'Quần jeans, cargo pants, quần túi hộp và shorts thể thao năng động.', true, '2026-11-08 23:33:00.189', '2026-11-08 23:33:00.189');
INSERT INTO public.categories (id, name, slug, description, "isActive", "createdAt", "updatedAt") VALUES ('5c4eaf4e-5be6-40f3-ae82-5e6ad66467c0', 'Áo Khoác (Outerwear)', 'ao-khoac-outerwear', 'Varsity jacket, hoodie, bomber và windbreaker thời thượng.', true, '2026-11-08 23:33:00.189', '2026-11-08 23:33:00.189');
INSERT INTO public.categories (id, name, slug, description, "isActive", "createdAt", "updatedAt") VALUES ('77e39bbb-efc2-417c-abf9-bb74a8b3ec6a', 'Phụ Kiện (Accessories)', 'phu-kien-accessories', 'Mũ len, nón lưỡi trai, túi đeo chéo và vớ thời trang.', true, '2026-11-08 23:33:00.19', '2026-11-08 23:33:00.19');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.products (id, name, slug, description, "basePrice", "originalPrice", audience, style, material, images, "sizeChartJson", "isActive", "isDeleted", "createdAt", "updatedAt", "categoryId") VALUES ('dcf00ecc-8ce0-4fe9-a539-eeb4612c2a16', 'Áo Thun Thierlavier Boxy Fit Heavyweight', 'ao-thun-thierlavier-boxy-fit-heavyweight', '100% Cotton 280gsm đanh mịn, cổ bo dệt viền 2 kim không giãn nhão, phom dáng drop-shoulder boxy hiện đại.', 350000, 420000, 'UNISEX', 'Streetwear / Oversize', '100% Cotton Compact 280gsm', '{https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop,https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop}', '[{"size": "S", "chest": "104 cm", "waist": "72-76 cm", "length": "68 cm", "shoulder": "48 cm"}, {"size": "M", "chest": "110 cm", "waist": "76-80 cm", "length": "71 cm", "shoulder": "51 cm"}, {"size": "L", "chest": "116 cm", "waist": "80-86 cm", "length": "74 cm", "shoulder": "54 cm"}, {"size": "XL", "chest": "122 cm", "waist": "86-92 cm", "length": "77 cm", "shoulder": "57 cm"}]', true, false, '2026-11-08 23:33:00.191', '2026-11-08 23:33:00.191', 'd0f4314b-9b11-4703-8af2-9f17a83705c0');
INSERT INTO public.products (id, name, slug, description, "basePrice", "originalPrice", audience, style, material, images, "sizeChartJson", "isActive", "isDeleted", "createdAt", "updatedAt", "categoryId") VALUES ('8b8ffd5b-84f5-460a-b0e2-216c2f184b74', 'Quần Cargo Nam Thierlavier Tactical Khaki', 'quan-cargo-nam-thierlavier-tactical-khaki', 'Chất vải Kaki Twill co giãn nhẹ, phối 6 túi hộp đa dụng cùng khóa bấm kim loại phong cách techwear.', 580000, 690000, 'MEN', 'Tactical / Techwear', 'Kaki Cotton Twill 100%', '{https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop}', '[{"size": "S", "chest": "104 cm", "waist": "72-76 cm", "length": "68 cm", "shoulder": "48 cm"}, {"size": "M", "chest": "110 cm", "waist": "76-80 cm", "length": "71 cm", "shoulder": "51 cm"}, {"size": "L", "chest": "116 cm", "waist": "80-86 cm", "length": "74 cm", "shoulder": "54 cm"}, {"size": "XL", "chest": "122 cm", "waist": "86-92 cm", "length": "77 cm", "shoulder": "57 cm"}]', true, false, '2026-11-08 23:33:00.197', '2026-11-08 23:33:00.197', '1ca9073b-6cb0-4bb8-92da-f6e23cdc51bc');
INSERT INTO public.products (id, name, slug, description, "basePrice", "originalPrice", audience, style, material, images, "sizeChartJson", "isActive", "isDeleted", "createdAt", "updatedAt", "categoryId") VALUES ('575f6216-8474-485e-b161-97da4a7ef213', 'Áo Hoodie Nữ Thierlavier Crop Zip', 'ao-hoodie-nu-thierlavier-crop-zip', 'Nỉ bông chân cua 380gsm dày ấm mịn màng, form lửng cá tính tôn dáng kết hợp khóa zip 2 chiều.', 480000, 550000, 'WOMEN', 'Y2K / Sporty Streetwear', 'Nỉ Da Cá 100% Cotton', '{https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop}', '[{"size": "S", "chest": "104 cm", "waist": "72-76 cm", "length": "68 cm", "shoulder": "48 cm"}, {"size": "M", "chest": "110 cm", "waist": "76-80 cm", "length": "71 cm", "shoulder": "51 cm"}, {"size": "L", "chest": "116 cm", "waist": "80-86 cm", "length": "74 cm", "shoulder": "54 cm"}, {"size": "XL", "chest": "122 cm", "waist": "86-92 cm", "length": "77 cm", "shoulder": "57 cm"}]', true, false, '2026-11-08 23:33:00.2', '2026-11-08 23:33:00.2', '5c4eaf4e-5be6-40f3-ae82-5e6ad66467c0');
INSERT INTO public.products (id, name, slug, description, "basePrice", "originalPrice", audience, style, material, images, "sizeChartJson", "isActive", "isDeleted", "createdAt", "updatedAt", "categoryId") VALUES ('b095102f-74ef-401a-8e89-c0d0b73a466a', 'Áo Khoác Varsity Thierlavier Wool-Leather Club', 'ao-khoac-varsity-thierlavier-wool-leather-club', 'Áo khoác bóng chày dạ phối tay da tổng hợp PU mềm mịn cao cấp, thêu xù logo mặt trước và sau lưng.', 920000, 1100000, 'UNISEX', 'Varsity / Retro American', 'Dạ ép lông cừu phối tay da PU', '{https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop}', '[{"size": "S", "chest": "104 cm", "waist": "72-76 cm", "length": "68 cm", "shoulder": "48 cm"}, {"size": "M", "chest": "110 cm", "waist": "76-80 cm", "length": "71 cm", "shoulder": "51 cm"}, {"size": "L", "chest": "116 cm", "waist": "80-86 cm", "length": "74 cm", "shoulder": "54 cm"}, {"size": "XL", "chest": "122 cm", "waist": "86-92 cm", "length": "77 cm", "shoulder": "57 cm"}]', true, false, '2026-11-08 23:33:00.202', '2026-11-08 23:33:00.202', '5c4eaf4e-5be6-40f3-ae82-5e6ad66467c0');
INSERT INTO public.products (id, name, slug, description, "basePrice", "originalPrice", audience, style, material, images, "sizeChartJson", "isActive", "isDeleted", "createdAt", "updatedAt", "categoryId") VALUES ('10994c0e-9cfa-4bc1-85df-8221b616fc13', 'Mũ Len Thierlavier Ribbed Beanie (Mẫu hết hàng)', 'mu-len-thierlavier-ribbed-beanie-het-hang', 'Mẫu nón len dệt kim gân nổi co giãn 4 chiều mềm mại.', 160000, 190000, 'UNISEX', 'Minimal Streetwear', 'Acrylic dệt len rib', '{https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop}', '[{"size": "S", "chest": "104 cm", "waist": "72-76 cm", "length": "68 cm", "shoulder": "48 cm"}, {"size": "M", "chest": "110 cm", "waist": "76-80 cm", "length": "71 cm", "shoulder": "51 cm"}, {"size": "L", "chest": "116 cm", "waist": "80-86 cm", "length": "74 cm", "shoulder": "54 cm"}, {"size": "XL", "chest": "122 cm", "waist": "86-92 cm", "length": "77 cm", "shoulder": "57 cm"}]', true, false, '2026-11-08 23:33:00.203', '2026-11-08 23:33:00.203', '77e39bbb-efc2-417c-abf9-bb74a8b3ec6a');


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('28928fb1-974f-48f6-9ed8-3304850121e8', 'dcf00ecc-8ce0-4fe9-a539-eeb4612c2a16', 'Đen Washed (Washed Black)', 'M', 'TL-TEE-WBLK-M', NULL, 25, '2026-11-08 23:33:00.191', '2026-11-08 23:33:00.191');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('dd953ab5-6294-40f1-adff-9ff9aa52f4e5', 'dcf00ecc-8ce0-4fe9-a539-eeb4612c2a16', 'Đen Washed (Washed Black)', 'L', 'TL-TEE-WBLK-L', NULL, 18, '2026-11-08 23:33:00.191', '2026-11-08 23:33:00.191');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('940d745a-a18d-4697-96eb-bd25fc840a7b', 'dcf00ecc-8ce0-4fe9-a539-eeb4612c2a16', 'Trắng Kem (Off-White)', 'M', 'TL-TEE-OWHT-M', NULL, 7, '2026-11-08 23:33:00.191', '2026-11-08 23:33:00.191');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('47977a8b-19ee-48ef-b1fb-7651846bf6d3', 'dcf00ecc-8ce0-4fe9-a539-eeb4612c2a16', 'Trắng Kem (Off-White)', 'L', 'TL-TEE-OWHT-L', NULL, 0, '2026-11-08 23:33:00.191', '2026-11-08 23:33:00.191');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('4b8cb5ea-a397-463e-a8a9-a6594d019d4d', '8b8ffd5b-84f5-460a-b0e2-216c2f184b74', 'Xanh Rêu (Army Green)', 'M', 'TL-CARGO-GRN-M', NULL, 15, '2026-11-08 23:33:00.197', '2026-11-08 23:33:00.197');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('b2407c02-8958-4daa-977d-29c76d96031f', '8b8ffd5b-84f5-460a-b0e2-216c2f184b74', 'Xanh Rêu (Army Green)', 'L', 'TL-CARGO-GRN-L', NULL, 5, '2026-11-08 23:33:00.197', '2026-11-08 23:33:00.197');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('0a27cdb5-b0f2-4991-b6e6-1030d3e289e5', '8b8ffd5b-84f5-460a-b0e2-216c2f184b74', 'Đen (Black)', 'M', 'TL-CARGO-BLK-M', NULL, 20, '2026-11-08 23:33:00.197', '2026-11-08 23:33:00.197');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('cafac1e3-b131-4cf9-a68b-5531bfb05f9f', '8b8ffd5b-84f5-460a-b0e2-216c2f184b74', 'Đen (Black)', 'L', 'TL-CARGO-BLK-L', NULL, 12, '2026-11-08 23:33:00.197', '2026-11-08 23:33:00.197');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('ba97a03e-3157-4fad-beb2-890cdba35d62', '575f6216-8474-485e-b161-97da4a7ef213', 'Xám Tiêu (Heather Grey)', 'S', 'TL-CROP-GRY-S', NULL, 8, '2026-11-08 23:33:00.2', '2026-11-08 23:33:00.2');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('5a5be9fb-12a1-491c-a67c-ddedf2c169ef', '575f6216-8474-485e-b161-97da4a7ef213', 'Xám Tiêu (Heather Grey)', 'M', 'TL-CROP-GRY-M', NULL, 14, '2026-11-08 23:33:00.2', '2026-11-08 23:33:00.2');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('db90c9da-4998-4bbd-bb06-ec6a9429f733', '575f6216-8474-485e-b161-97da4a7ef213', 'Hồng Pastel (Baby Pink)', 'S', 'TL-CROP-PNK-S', NULL, 4, '2026-11-08 23:33:00.2', '2026-11-08 23:33:00.2');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('18681ab3-237a-4034-8199-57409c165896', 'b095102f-74ef-401a-8e89-c0d0b73a466a', 'Xanh Navy (Navy Blue)', 'M', 'TL-VAR-NVY-M', NULL, 6, '2026-11-08 23:33:00.202', '2026-11-08 23:33:00.202');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('7529ddf7-12fc-4320-8438-b75608cf0518', 'b095102f-74ef-401a-8e89-c0d0b73a466a', 'Xanh Navy (Navy Blue)', 'L', 'TL-VAR-NVY-L', NULL, 11, '2026-11-08 23:33:00.202', '2026-11-08 23:33:00.202');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('960d45ed-e7a5-4c8e-8d26-b8968ca72848', 'b095102f-74ef-401a-8e89-c0d0b73a466a', 'Đen Phối Kem (Black/Cream)', 'L', 'TL-VAR-BCR-L', NULL, 15, '2026-11-08 23:33:00.202', '2026-11-08 23:33:00.202');
INSERT INTO public.product_variants (id, "productId", color, size, sku, price, "stockQty", "createdAt", "updatedAt") VALUES ('05385d1a-0189-4394-bc5e-7bc055225af3', '10994c0e-9cfa-4bc1-85df-8221b616fc13', 'Nâu Đất (Mocha Brown)', 'Freesize', 'TL-BEAN-MOC-FS', NULL, 0, '2026-11-08 23:33:00.203', '2026-11-08 23:33:00.203');


--
-- PostgreSQL database dump complete
--

