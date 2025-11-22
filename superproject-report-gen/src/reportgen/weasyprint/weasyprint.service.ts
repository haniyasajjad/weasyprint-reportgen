import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { existsSync, promises as fs } from 'fs';

export interface WeasyprintGenerationResult {
  success: boolean;
  path?: string;
  durationSeconds?: number;
  error?: string;
  timestamp: string;
}

export interface WeasyprintGenerationOptions {
  outputPath: string;
  data: any;
}

@Injectable()
export class WeasyprintService {
  private readonly logger = new Logger(WeasyprintService.name);
  private readonly pythonScript: string;
  private readonly outputDir: string;

  constructor() {
    this.pythonScript = this.resolvePythonScriptPath();
    this.outputDir = path.join(process.cwd(), 'generated-pdfs');
    void this.ensureOutputDirectory();
  }

  private resolvePythonScriptPath(): string {
    const candidatePaths = [
      path.join(__dirname, 'generator.py'),
      path.join(
        process.cwd(),
        'dist',
        'reportgen',
        'weasyprint',
        'generator.py',
      ),
      path.join(
        process.cwd(),
        'src',
        'reportgen',
        'weasyprint',
        'generator.py',
      ),
    ];

    for (const candidate of candidatePaths) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    const message = `WeasyPrint generator script not found. Checked: ${candidatePaths.join(
      ', ',
    )}`;
    this.logger.error(message);
    throw new Error(message);
  }

  private async ensureOutputDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to create output directory', error);
    }
  }

  /**
   * Generate PDF using WeasyPrint
   *
   * @param options Generation options including data and output path
   * @returns Generation result with path and timing information
   */
  async generatePDF(
    options: WeasyprintGenerationOptions,
  ): Promise<WeasyprintGenerationResult> {
    const startTime = Date.now();

    this.logger.log(`Starting PDF generation with WeasyPrint`);
    this.logger.log(`Output path: ${options.outputPath}`);

    return new Promise((resolve, reject) => {
      // Spawn Python process using venv
      const pythonPath = path.join(process.cwd(), 'venv/bin/python3');
      const python = spawn(pythonPath, [this.pythonScript]);

      let stdout = '';
      let stderr = '';
      let isRejected = false;

      // Send data to Python via stdin
      const input = JSON.stringify({
        data: options.data,
        outputPath: options.outputPath,
      });

      // Handle potential Python startup errors
      python.on('error', (error) => {
        if (!isRejected) {
          isRejected = true;
          this.logger.error('Failed to spawn Python process', error);
          reject({
            success: false,
            error: `Failed to spawn Python: ${error.message}`,
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Handle errors on stdin
      python.stdin.on('error', (error) => {
        if (!isRejected) {
          isRejected = true;
          this.logger.error('Error writing to Python stdin', error);
          reject({
            success: false,
            error: `Failed to write data to Python: ${error.message}`,
            timestamp: new Date().toISOString(),
          });
        }
      });

      // Collect stdout
      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      // Collect stderr
      python.stderr.on('data', (data) => {
        stderr += data.toString();
        this.logger.warn(`Python stderr: ${data.toString()}`);
      });

      // Write data and handle completion
      python.stdin.write(input, (writeError) => {
        if (writeError && !isRejected) {
          isRejected = true;
          this.logger.error('Failed to write to Python stdin', writeError);
          python.kill();
          reject({
            success: false,
            error: `Failed to write data: ${writeError.message}`,
            timestamp: new Date().toISOString(),
          });
          return;
        }
        python.stdin.end();
      });

      // Handle process completion
      python.on('close', (code) => {
        if (isRejected) {
          return; // Already rejected
        }

        const endTime = Date.now();
        const totalDuration = (endTime - startTime) / 1000;

        if (code === 0) {
          try {
            const result: WeasyprintGenerationResult = JSON.parse(stdout);

            this.logger.log(
              `PDF generation completed in ${totalDuration.toFixed(2)}s`,
            );

            resolve({
              ...result,
              durationSeconds: totalDuration,
            });
          } catch (error) {
            this.logger.error('Failed to parse Python output', error);
            this.logger.error(`stdout was: ${stdout}`);
            reject({
              success: false,
              error: 'Failed to parse generation result',
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          this.logger.error(`Python process exited with code ${code}`);
          this.logger.error(`stderr: ${stderr}`);

          reject({
            success: false,
            error: `Python process failed with code ${code}: ${stderr}`,
            timestamp: new Date().toISOString(),
          });
        }
      });
    });
  }

  /**
   * Generate PDF with automatic output path
   *
   * @param data Report data
   * @param filename Optional filename (default: report-{timestamp}.pdf)
   * @returns Generation result
   */
  async generatePDFAuto(
    data: any,
    filename?: string,
  ): Promise<WeasyprintGenerationResult> {
    const timestamp = Date.now();
    const outputFilename = filename || `report-${timestamp}.pdf`;
    const outputPath = path.join(this.outputDir, outputFilename);

    return this.generatePDF({
      data,
      outputPath,
    });
  }

  /**
   * Get the output directory path
   */
  getOutputDirectory(): string {
    return this.outputDir;
  }

  /**
   * Check if Python and WeasyPrint are available
   */
  async checkDependencies(): Promise<{
    python: boolean;
    weasyprint: boolean;
    message: string;
  }> {
    return new Promise((resolve) => {
      // Check Python
      const pythonCheck = spawn('python3', ['--version']);
      let pythonAvailable = false;

      pythonCheck.on('close', (code) => {
        pythonAvailable = code === 0;

        if (!pythonAvailable) {
          resolve({
            python: false,
            weasyprint: false,
            message: 'Python 3 is not installed or not in PATH',
          });
          return;
        }

        // Check WeasyPrint
        const weasyprintCheck = spawn('python3', [
          '-c',
          'import weasyprint; print(weasyprint.__version__)',
        ]);
        let weasyprintAvailable = false;
        let version = '';

        weasyprintCheck.stdout.on('data', (data) => {
          version = data.toString().trim();
        });

        weasyprintCheck.on('close', (code) => {
          weasyprintAvailable = code === 0;

          resolve({
            python: true,
            weasyprint: weasyprintAvailable,
            message: weasyprintAvailable
              ? `WeasyPrint v${version} is available`
              : 'WeasyPrint is not installed. Run: pip install weasyprint',
          });
        });
      });
    });
  }
}
