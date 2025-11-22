import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ReportgenService } from './reportgen.service';

class GenerateReportDto {
  sproid: string;
  outputFilename?: string;
}

class BenchmarkDto {
  sproid: string;
}

@Controller('reportgen')
export class ReportgenController {
  private readonly logger = new Logger(ReportgenController.name);

  constructor(private readonly reportgenService: ReportgenService) {}

  /**
   * Generate PDF report using WeasyPrint
   * POST /reportgen/generate
   */
  @Post('generate')
  async generateReport(@Body() dto: GenerateReportDto) {
    try {
      this.logger.log(`Generate report request for: ${dto.sproid}`);

      const result = await this.reportgenService.generateReportWithWeasyprint(
        dto.sproid,
        dto.outputFilename,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Report generation failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        message: 'Report generated successfully',
        ...result,
      };
    } catch (error) {
      this.logger.error('Failed to generate report', error);
      throw new HttpException(
        error.message || 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Benchmark WeasyPrint performance
   * POST /reportgen/benchmark
   */
  @Post('benchmark')
  async benchmark(@Body() dto: BenchmarkDto) {
    try {
      this.logger.log(`Benchmark request for: ${dto.sproid}`);

      const result = await this.reportgenService.benchmarkWeasyprint(
        dto.sproid,
      );

      return {
        message: 'Benchmark completed',
        results: result,
        performance: {
          dataFetch: `${(result.timing.dataFetchMs / 1000).toFixed(2)}s`,
          pdfGeneration: `${(result.timing.pdfGenerationMs / 1000).toFixed(2)}s`,
          total: `${(result.timing.totalMs / 1000).toFixed(2)}s`,
          memoryUsed: `${result.memory.peakUsedMB.toFixed(2)} MB`,
          fileSize: `${result.output.fileSizeMB.toFixed(2)} MB`,
        },
        data: {
          projects: result.dataMetrics.totalProjects,
          sections: result.dataMetrics.totalSections,
          defects: result.dataMetrics.totalDefects,
        },
      };
    } catch (error) {
      this.logger.error('Benchmark failed', error);
      throw new HttpException(
        error.message || 'Benchmark failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get report preview/statistics
   * GET /reportgen/preview/:sproid
   */
  @Get('preview/:sproid')
  async getPreview(@Param('sproid') sproid: string) {
    try {
      const preview = await this.reportgenService.getReportPreview(sproid);

      return {
        message: 'Preview generated',
        ...preview,
      };
    } catch (error) {
      this.logger.error('Failed to get preview', error);
      throw new HttpException(
        error.message || 'Failed to get preview',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check WeasyPrint dependencies
   * GET /reportgen/check-dependencies
   */
  @Get('check-dependencies')
  async checkDependencies() {
    try {
      const result = await this.reportgenService.checkWeasyprintDependencies();

      if (!result.python || !result.weasyprint) {
        throw new HttpException(result.message, HttpStatus.SERVICE_UNAVAILABLE);
      }

      return {
        ...result,
        message: 'All dependencies available',
      };
    } catch (error) {
      this.logger.error('Dependency check failed', error);
      throw new HttpException(
        error.message || 'Dependency check failed',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  /**
   * Get output directory path
   * GET /reportgen/output-directory
   */
  @Get('output-directory')
  getOutputDirectory() {
    return {
      path: this.reportgenService.getOutputDirectory(),
    };
  }

  /**
   * Health check
   * GET /reportgen/health
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'reportgen',
      timestamp: new Date().toISOString(),
    };
  }
}
