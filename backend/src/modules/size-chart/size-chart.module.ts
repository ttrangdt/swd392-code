/**
 * -SE1990_NJ
 * -HE195077
 * -Version 1.0
 * -09/11/2026
 * -Copyright Notice
 */

import { Module } from '@nestjs/common';
import { SizeChartController } from './size-chart.controller';
import { SizeChartService } from './size-chart.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SizeChartController],
  providers: [SizeChartService],
  exports: [SizeChartService],
})
export class SizeChartModule {}

