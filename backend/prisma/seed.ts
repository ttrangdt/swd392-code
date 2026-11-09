import { PrismaClient, GenderTarget } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed Trang DB] Starting data population for Trang Module (Product Catalog & Inventory)...');

  // Xoa du lieu cu
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Tao cac danh muc san pham (Categories)
  const catTops = await prisma.category.create({
    data: {
      name: 'Áo (Tops)',
      slug: 'ao-tops',
      description: 'Áo thun, áo polo, áo sơ mi streetwear phom dáng rộng rãi hiện đại.',
    },
  });

  const catBottoms = await prisma.category.create({
    data: {
      name: 'Quần (Bottoms)',
      slug: 'quan-bottoms',
      description: 'Quần jeans, cargo pants, quần túi hộp và shorts thể thao năng động.',
    },
  });

  const catOuterwear = await prisma.category.create({
    data: {
      name: 'Áo Khoác (Outerwear)',
      slug: 'ao-khoac-outerwear',
      description: 'Varsity jacket, hoodie, bomber và windbreaker thời thượng.',
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Phụ Kiện (Accessories)',
      slug: 'phu-kien-accessories',
      description: 'Mũ len, nón lưỡi trai, túi đeo chéo và vớ thời trang.',
    },
  });

  // Size chart chung
  const standardSizeChart = [
    { size: 'S', chest: '104 cm', length: '68 cm', shoulder: '48 cm', waist: '72-76 cm' },
    { size: 'M', chest: '110 cm', length: '71 cm', shoulder: '51 cm', waist: '76-80 cm' },
    { size: 'L', chest: '116 cm', length: '74 cm', shoulder: '54 cm', waist: '80-86 cm' },
    { size: 'XL', chest: '122 cm', length: '77 cm', shoulder: '57 cm', waist: '86-92 cm' },
  ];

  // 2. Tao san pham
  // San pham 1: Unisex Boxy T-Shirt (BR-20: xuat hien ca Men va Women)
  await prisma.product.create({
    data: {
      name: 'Áo Thun Thierlavier Boxy Fit Heavyweight',
      slug: 'ao-thun-thierlavier-boxy-fit-heavyweight',
      description: '100% Cotton 280gsm đanh mịn, cổ bo dệt viền 2 kim không giãn nhão, phom dáng drop-shoulder boxy hiện đại.',
      basePrice: 350000,
      originalPrice: 420000,
      audience: GenderTarget.UNISEX, // BR-20
      style: 'Streetwear / Oversize',
      material: '100% Cotton Compact 280gsm',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
      ],
      sizeChartJson: standardSizeChart,
      categoryId: catTops.id,
      variants: {
        create: [
          { color: 'Đen Washed (Washed Black)', size: 'M', sku: 'TL-TEE-WBLK-M', stockQty: 25 },
          { color: 'Đen Washed (Washed Black)', size: 'L', sku: 'TL-TEE-WBLK-L', stockQty: 18 },
          { color: 'Trắng Kem (Off-White)', size: 'M', sku: 'TL-TEE-OWHT-M', stockQty: 7 }, // BR-28: Low Stock Alert (<10)
          { color: 'Trắng Kem (Off-White)', size: 'L', sku: 'TL-TEE-OWHT-L', stockQty: 0 }, // BR-29: Out of stock
        ],
      },
    },
  });

  // San pham 2: Men Cargo Pant
  await prisma.product.create({
    data: {
      name: 'Quần Cargo Nam Thierlavier Tactical Khaki',
      slug: 'quan-cargo-nam-thierlavier-tactical-khaki',
      description: 'Chất vải Kaki Twill co giãn nhẹ, phối 6 túi hộp đa dụng cùng khóa bấm kim loại phong cách techwear.',
      basePrice: 580000,
      originalPrice: 690000,
      audience: GenderTarget.MEN,
      style: 'Tactical / Techwear',
      material: 'Kaki Cotton Twill 100%',
      images: [
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop',
      ],
      sizeChartJson: standardSizeChart,
      categoryId: catBottoms.id,
      variants: {
        create: [
          { color: 'Xanh Rêu (Army Green)', size: 'M', sku: 'TL-CARGO-GRN-M', stockQty: 15 },
          { color: 'Xanh Rêu (Army Green)', size: 'L', sku: 'TL-CARGO-GRN-L', stockQty: 5 }, // BR-28: Low Stock (<10)
          { color: 'Đen (Black)', size: 'M', sku: 'TL-CARGO-BLK-M', stockQty: 20 },
          { color: 'Đen (Black)', size: 'L', sku: 'TL-CARGO-BLK-L', stockQty: 12 },
        ],
      },
    },
  });

  // San pham 3: Women Cropped Hoodie
  await prisma.product.create({
    data: {
      name: 'Áo Hoodie Nữ Thierlavier Crop Zip',
      slug: 'ao-hoodie-nu-thierlavier-crop-zip',
      description: 'Nỉ bông chân cua 380gsm dày ấm mịn màng, form lửng cá tính tôn dáng kết hợp khóa zip 2 chiều.',
      basePrice: 480000,
      originalPrice: 550000,
      audience: GenderTarget.WOMEN,
      style: 'Y2K / Sporty Streetwear',
      material: 'Nỉ Da Cá 100% Cotton',
      images: [
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop',
      ],
      sizeChartJson: standardSizeChart,
      categoryId: catOuterwear.id,
      variants: {
        create: [
          { color: 'Xám Tiêu (Heather Grey)', size: 'S', sku: 'TL-CROP-GRY-S', stockQty: 8 }, // BR-28 (<10)
          { color: 'Xám Tiêu (Heather Grey)', size: 'M', sku: 'TL-CROP-GRY-M', stockQty: 14 },
          { color: 'Hồng Pastel (Baby Pink)', size: 'S', sku: 'TL-CROP-PNK-S', stockQty: 4 }, // BR-28 (<10)
        ],
      },
    },
  });

  // San pham 4: Unisex Varsity Jacket
  await prisma.product.create({
    data: {
      name: 'Áo Khoác Varsity Thierlavier Wool-Leather Club',
      slug: 'ao-khoac-varsity-thierlavier-wool-leather-club',
      description: 'Áo khoác bóng chày dạ phối tay da tổng hợp PU mềm mịn cao cấp, thêu xù logo mặt trước và sau lưng.',
      basePrice: 920000,
      originalPrice: 1100000,
      audience: GenderTarget.UNISEX, // BR-20
      style: 'Varsity / Retro American',
      material: 'Dạ ép lông cừu phối tay da PU',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop',
      ],
      sizeChartJson: standardSizeChart,
      categoryId: catOuterwear.id,
      variants: {
        create: [
          { color: 'Xanh Navy (Navy Blue)', size: 'M', sku: 'TL-VAR-NVY-M', stockQty: 6 }, // BR-28 (<10)
          { color: 'Xanh Navy (Navy Blue)', size: 'L', sku: 'TL-VAR-NVY-L', stockQty: 11 },
          { color: 'Đen Phối Kem (Black/Cream)', size: 'L', sku: 'TL-VAR-BCR-L', stockQty: 15 },
        ],
      },
    },
  });

  // San pham 5: Unisex Beanie Cap (Het hang toan bo bien the de test BR-29)
  await prisma.product.create({
    data: {
      name: 'Mũ Len Thierlavier Ribbed Beanie (Mẫu hết hàng)',
      slug: 'mu-len-thierlavier-ribbed-beanie-het-hang',
      description: 'Mẫu nón len dệt kim gân nổi co giãn 4 chiều mềm mại.',
      basePrice: 160000,
      originalPrice: 190000,
      audience: GenderTarget.UNISEX,
      style: 'Minimal Streetwear',
      material: 'Acrylic dệt len rib',
      images: [
        'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop',
      ],
      sizeChartJson: standardSizeChart,
      categoryId: catAccessories.id,
      variants: {
        create: [
          { color: 'Nâu Đất (Mocha Brown)', size: 'Freesize', sku: 'TL-BEAN-MOC-FS', stockQty: 0 }, // BR-29
        ],
      },
    },
  });

  console.log('[Seed Trang DB] Success! Populated:');
  console.log(`- 4 Categories (Tops, Bottoms, Outerwear, Accessories)`);
  console.log(`- 5 Products with full attributes, size charts, low-stock & out-of-stock cases`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

