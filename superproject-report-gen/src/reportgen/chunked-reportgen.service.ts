import { Injectable, Logger } from '@nestjs/common';
import { WeasyprintService } from './weasyprint/weasyprint.service';
import { DatafetchService } from '../datafetch/datafetch.service';
import * as path from 'path';

/**
 * Chunked Report Generation Service
 * For datasets that are too large to fit in memory
 * Generates report in chunks (e.g., 1000 sections at a time)
 */
@Injectable()
export class ChunkedReportgenService {
  private readonly logger = new Logger(ChunkedReportgenService.name);

  constructor(
    private readonly weasyprintService: WeasyprintService,
    private readonly datafetchService: DatafetchService,
  ) {}

  /**
   * Generate report with chunking - processes 2-3 projects at a time
   * This keeps memory usage low even for massive datasets
   */
  async generateChunkedReport(
    sproid: string,
    projectsPerChunk: number = 3,
  ): Promise<{ success: boolean; pdfPath?: string; error?: string }> {
    const overallStart = Date.now();

    try {
      this.logger.log(`Starting CHUNKED report generation for: ${sproid}`);
      this.logger.log(`Processing ${projectsPerChunk} projects at a time`);

      // Get paginated generator
      const generator =
        await this.datafetchService.getSuperprojectReportDataPaginated(
          sproid,
          projectsPerChunk,
        );

      // Accumulate data chunks
      const allChunks: any[] = [];
      let chunkNumber = 0;

      for await (const chunk of generator) {
        chunkNumber++;
        this.logger.log(
          `Processing chunk ${chunkNumber}: ${chunk.projects.length} projects`,
        );
        allChunks.push(chunk);
      }

      // Merge all chunks into final data structure
      this.logger.log(`Merging ${allChunks.length} chunks...`);

      const finalData: {
        superproject: any;
        statistics: {
          totalProjects: number;
          totalSections: number;
          totalDefects: number;
        };
        projects: any[];
      } = {
        superproject: allChunks[0].superproject,
        statistics: {
          totalProjects: 0,
          totalSections: 0,
          totalDefects: 0,
        },
        projects: [],
      };

      // Merge chunks
      allChunks.forEach((chunk) => {
        finalData.projects.push(...chunk.projects);
        finalData.statistics.totalProjects += chunk.statistics.totalProjects;
        finalData.statistics.totalSections += chunk.statistics.totalSections;
        finalData.statistics.totalDefects += chunk.statistics.totalDefects;
      });

      this.logger.log(
        `Merged data: ${finalData.statistics.totalProjects} projects, ${finalData.statistics.totalSections} sections, ${finalData.statistics.totalDefects} defects`,
      );

      // Transform for PDF
      const pdfData = this.transformDataForPDF(finalData);

      // Generate PDF
      const filename = `superproject-chunked-${sproid}-${Date.now()}.pdf`;
      const result = await this.weasyprintService.generatePDFAuto(
        pdfData,
        filename,
      );

      const overallEnd = Date.now();
      const totalDuration = (overallEnd - overallStart) / 1000;

      this.logger.log(
        `Total chunked generation time: ${totalDuration.toFixed(2)}s`,
      );

      return {
        success: result.success,
        pdfPath: result.path,
        error: result.error,
      };
    } catch (error) {
      this.logger.error('Chunked report generation failed', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Transform data for PDF (same as batch mode)
   */
  private transformDataForPDF(reportData: any): any {
    return {
      superproject: reportData.superproject,
      statistics: reportData.statistics,
      projects: reportData.projects.map((projectData) => ({
        proid: projectData.project.proid,
        projectTitle: projectData.project.projectTitle,
        streetName: projectData.project.streetName,
        direction: projectData.project.direction,
        totalLanes: projectData.project.totalLanes,
        laneNumber: projectData.project.laneNumber,
        surveyDate: projectData.project.surveyDate,
        typeOfRoad: projectData.project.typeOfRoad,
        startingAddress: projectData.project.startingAddress,
        endingAddress: projectData.project.endingAddress,
        sections: projectData.sections.map((sectionData) => ({
          sectionId: sectionData.section.sectionId,
          tenMeterSectionId: sectionData.section.tenMeterSectionId,
          pci: sectionData.section.pci,
          cci: sectionData.section.cci,
          rci: sectionData.section.rci,
          distance: sectionData.section.distance,
          frame: sectionData.section.frame,
          defects: sectionData.defects.map((defect) => ({
            defectId: defect.defectId,
            defectType: defect.defectType,
            severity: defect.severity,
            length: defect.length,
            defectWidth: defect.defectWidth,
            area: defect.area,
            depth: defect.depth,
            volume: defect.volume,
            wheelPath: defect.wheelPath,
            defectName: defect.defectName,
          })),
        })),
      })),
    };
  }
}
