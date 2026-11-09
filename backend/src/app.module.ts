import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { VariantModule } from './modules/variant/variant.module';
import { SizeChartModule } from './modules/size-chart/size-chart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CategoryModule,
    ProductModule,
    VariantModule,
    SizeChartModule,
  ],
})
export class AppModule {}
