import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatafetchService } from './datafetch.service';
import { DatafetchController } from './datafetch.controller';
import { Superproject } from '../database/entities/superproject.entity';
import { Project } from '../database/entities/project.entity';
import { Section } from '../database/entities/section.entity';
import { Defect } from '../database/entities/defect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Superproject, Project, Section, Defect])],
  controllers: [DatafetchController],
  providers: [DatafetchService],
  exports: [DatafetchService],
})
export class DatafetchModule {}
