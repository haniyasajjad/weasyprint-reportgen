import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportgenService } from './reportgen.service';
import { ReportgenController } from './reportgen.controller';
import { WeasyprintService } from './weasyprint/weasyprint.service';
import { DatafetchModule } from '../datafetch/datafetch.module';

@Module({
  imports: [DatafetchModule],
  controllers: [ReportgenController],
  providers: [ReportgenService, WeasyprintService],
  exports: [ReportgenService],
})
export class ReportgenModule {}
