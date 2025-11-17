import { Module } from '@nestjs/common';
import { ReportgenService } from './reportgen.service';


@Module({
  controllers: [],
  providers: [ReportgenService],
})
export class ReportgenModule {}
