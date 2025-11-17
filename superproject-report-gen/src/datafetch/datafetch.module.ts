import { Module } from '@nestjs/common';
import { DatafetchService } from './datafetch.service';
import { DatafetchController } from './datafetch.controller';

@Module({
  controllers: [DatafetchController],
  providers: [DatafetchService],
})
export class DatafetchModule {}
