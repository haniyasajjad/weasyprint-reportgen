import { Module } from '@nestjs/common';
import { ReportgenService } from './reportgen.service';
import { ReportgenController } from './reportgen.controller';

@Module({
  controllers: [ReportgenController],
  providers: [ReportgenService],
})
export class ReportgenModule {}
