import { Injectable, Logger } from '@nestjs/common';
import { WeasyprintService } from './weasyprint/weasyprint.service';
import { DatafetchService } from '../datafetch/datafetch.service';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface ReportGenerationResult {
  success: boolean;
  pdfPath?: string;
  statistics?: {
    totalProjects: number;
    totalSections: number;
    totalDefects: number;
    dataFetchDuration: number;
    pdfGenerationDuration: number;
    totalDuration: number;
  };
  error?: string;
}

export interface BenchmarkResult {
  approach: 'weasyprint' | 'typst';
  sproid: string;
  timing: {
    dataFetchMs: number;
    pdfGenerationMs: number;
    totalMs: number;
  };
  memory: {
    beforeMB: number;
    afterMB: number;
    peakUsedMB: number;
  };
  output: {
    fileSizeMB: number;
    pageCount?: number;
  };
  dataMetrics: {
    totalProjects: number;
    totalSections: number;
    totalDefects: number;
  };
  timestamp: string;
}

@Injectable()
export class ReportgenService {
  private readonly logger = new Logger(ReportgenService.name);

  constructor(
    private readonly weasyprintService: WeasyprintService,
    private readonly datafetchService: DatafetchService,
  ) {}

  /**
   * Generate PDF report using WeasyPrint
   *
   * @param sproid Superproject ID
   * @param outputFilename Optional output filename
   * @returns Generation result with timing and statistics
   */
  async generateReportWithWeasyprint(
    sproid: string,
    outputFilename?: string,
  ): Promise<ReportGenerationResult> {
    const overallStartTime = Date.now();

    try {
      this.logger.log(`Starting report generation for superproject: ${sproid}`);

      // Step 1: Fetch data from database
      const dataFetchStart = Date.now();
      const reportData =
        await this.datafetchService.getSuperprojectReportData(sproid);
      const dataFetchEnd = Date.now();
      const dataFetchDuration = (dataFetchEnd - dataFetchStart) / 1000;

      this.logger.log(
        `Data fetch completed in ${dataFetchDuration.toFixed(2)}s`,
      );

      // Step 2: Transform data for PDF generation
      const pdfData = this.transformDataForPDF(reportData);

      // Step 3: Generate PDF using WeasyPrint
      const pdfGenerationStart = Date.now();
      const filename =
        outputFilename || `superproject-${sproid}-${Date.now()}.pdf`;

      const result = await this.weasyprintService.generatePDFAuto(
        pdfData,
        filename,
      );
      const pdfGenerationEnd = Date.now();
      const pdfGenerationDuration =
        (pdfGenerationEnd - pdfGenerationStart) / 1000;

      if (!result.success) {
        throw new Error(result.error || 'PDF generation failed');
      }

      const overallEndTime = Date.now();
      const totalDuration = (overallEndTime - overallStartTime) / 1000;

      this.logger.log(
        `PDF generation completed in ${pdfGenerationDuration.toFixed(2)}s`,
      );
      this.logger.log(`Total duration: ${totalDuration.toFixed(2)}s`);

      return {
        success: true,
        pdfPath: result.path,
        statistics: {
          ...reportData.statistics,
          dataFetchDuration,
          pdfGenerationDuration,
          totalDuration,
        },
      };
    } catch (error) {
      this.logger.error('Report generation failed', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Transform database data to PDF-ready format with minimal copying
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
            defectType: defect.defectType,
            severity: defect.severity,
            length: defect.length,
            defectWidth: defect.defectWidth,
            area: defect.area,
            depth: defect.depth,
          })),
        })),
      })),
    };
  }

  /**
   * Benchmark WeasyPrint performance
   * Measures timing, memory usage, and output metrics
   *
   * @param sproid Superproject ID to benchmark
   * @returns Detailed benchmark results
   */
  async benchmarkWeasyprint(sproid: string): Promise<BenchmarkResult> {
    const startTime = Date.now();

    // Memory before
    const memoryBefore = process.memoryUsage();

    // Data fetch timing
    const dataFetchStart = Date.now();
    const reportData =
      await this.datafetchService.getSuperprojectReportData(sproid);
    const dataFetchEnd = Date.now();

    // PDF generation timing
    const pdfGenerationStart = Date.now();
    const pdfData = this.transformDataForPDF(reportData);
    const filename = `benchmark-${sproid}-${Date.now()}.pdf`;
    const result = await this.weasyprintService.generatePDFAuto(
      pdfData,
      filename,
    );
    const pdfGenerationEnd = Date.now();

    // Memory after
    const memoryAfter = process.memoryUsage();

    // Get file size
    let fileSizeMB = 0;
    if (result.success && result.path) {
      const stats = await fs.stat(result.path);
      fileSizeMB = stats.size / (1024 * 1024);
    }

    const endTime = Date.now();

    return {
      approach: 'weasyprint',
      sproid,
      timing: {
        dataFetchMs: dataFetchEnd - dataFetchStart,
        pdfGenerationMs: pdfGenerationEnd - pdfGenerationStart,
        totalMs: endTime - startTime,
      },
      memory: {
        beforeMB: memoryBefore.heapUsed / (1024 * 1024),
        afterMB: memoryAfter.heapUsed / (1024 * 1024),
        peakUsedMB:
          (memoryAfter.heapUsed - memoryBefore.heapUsed) / (1024 * 1024),
      },
      output: {
        fileSizeMB,
        pageCount: undefined, // Could be extracted from PDF metadata if needed
      },
      dataMetrics: {
        totalProjects: reportData.statistics.totalProjects,
        totalSections: reportData.statistics.totalSections,
        totalDefects: reportData.statistics.totalDefects,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if WeasyPrint dependencies are installed
   */
  async checkWeasyprintDependencies(): Promise<{
    python: boolean;
    weasyprint: boolean;
    message: string;
  }> {
    return this.weasyprintService.checkDependencies();
  }

  /**
   * Get generated PDF output directory
   */
  getOutputDirectory(): string {
    return this.weasyprintService.getOutputDirectory();
  }

  /**
   * Generate report with progress tracking (for future streaming implementation)
   */
  async generateReportWithProgress(
    sproid: string,
    onProgress?: (stage: string, progress: number) => void,
  ): Promise<ReportGenerationResult> {
    try {
      onProgress?.('Fetching data', 0);

      const reportData =
        await this.datafetchService.getSuperprojectReportData(sproid);

      onProgress?.('Data fetched', 30);

      const pdfData = this.transformDataForPDF(reportData);

      onProgress?.('Transforming data', 50);

      const filename = `superproject-${sproid}-${Date.now()}.pdf`;

      onProgress?.('Generating PDF', 60);

      const result = await this.weasyprintService.generatePDFAuto(
        pdfData,
        filename,
      );

      onProgress?.('Complete', 100);

      return {
        success: result.success,
        pdfPath: result.path,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get quick preview of what will be in the report
   */
  async getReportPreview(sproid: string): Promise<{
    superprojectTitle: string;
    statistics: any;
    estimatedGenerationTime: string;
  }> {
    const stats = await this.datafetchService.getSuperprojectStatistics(sproid);

    // Rough estimation: 100 sections per second
    const estimatedSeconds = stats.totalSections / 100;

    return {
      superprojectTitle: sproid,
      statistics: stats,
      estimatedGenerationTime: `~${Math.ceil(estimatedSeconds)}s`,
    };
  }
}
