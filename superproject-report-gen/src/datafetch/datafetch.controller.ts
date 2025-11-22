import { Controller, Get, Param } from '@nestjs/common';
import { DatafetchService } from './datafetch.service';

@Controller('datafetch')
export class DatafetchController {
  constructor(private readonly datafetchService: DatafetchService) {}

  // Fetch full report
  @Get('report/:sproid')
  getReport(@Param('sproid') sproid: string) {
    return this.datafetchService.getSuperprojectReportData(sproid);
  }

  // Fetch statistics only
  @Get('stats/:sproid')
  getStats(@Param('sproid') sproid: string) {
    return this.datafetchService.getSuperprojectStatistics(sproid);
  }
}
