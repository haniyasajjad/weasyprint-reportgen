import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Superproject } from '../database/entities/superproject.entity';
import { Project } from '../database/entities/project.entity';
import { Section } from '../database/entities/section.entity';
import { Defect } from '../database/entities/defect.entity';

export interface SuperprojectReportData {
  superproject: Partial<Superproject>;
  projects: Array<{
    project: Partial<Project>;
    sections: Array<{
      section: Partial<Section>;
      defects: Partial<Defect>[];
    }>;
  }>;
  statistics: {
    totalProjects: number;
    totalSections: number;
    totalDefects: number;
    averagePCI?: number;
    averageCCI?: number;
  };
}

@Injectable()
export class DatafetchService {
  private readonly logger = new Logger(DatafetchService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Fetch all data for a superproject report - OPTIMIZED VERSION
   * Uses efficient queries with proper joins and batching
   *
   * @param sproid Superproject ID
   * @returns Complete report data structure
   */
  async getSuperprojectReportData(
    sproid: string,
  ): Promise<SuperprojectReportData> {
    const startTime = Date.now();
    this.logger.log(`Fetching report data for superproject: ${sproid}`);

    // 1. Fetch superproject basic info
    const superproject = await this.dataSource
      .getRepository(Superproject)
      .findOne({
        where: { sproid },
        select: [
          'sproid',
          'projectTitle',
          'projectTitleLC',
          'roadSide',
          'companyName',
          'creatorUid',
          'creatorEmployeeid',
          'dateCreated',
          'videosCount',
        ],
      });

    if (!superproject) {
      throw new NotFoundException(`Superproject ${sproid} not found`);
    }

    this.logger.log(`Superproject found: ${superproject.projectTitle}`);

    // 2. Fetch all projects for this superproject (optimized - only needed fields)
    const projects = await this.dataSource
      .getRepository(Project)
      .createQueryBuilder('project')
      .select([
        'project.proid',
        'project.projectTitle',
        'project.streetName',
        'project.direction',
        'project.totalLanes',
        'project.laneNumber',
        'project.surveyDate',
        'project.typeOfRoad',
        'project.startingAddress',
        'project.endingAddress',
      ])
      .where('project.sproid = :sproid', { sproid })
      .getMany();

    this.logger.log(`Found ${projects.length} projects`);

    // 3. Fetch sections and defects in batches (memory efficient)
    const projectsWithData = await Promise.all(
      projects.map(async (project) => {
        return {
          project,
          sections: await this.fetchSectionsWithDefects(project.proid),
        };
      }),
    );

    // 4. Calculate statistics
    const statistics = this.calculateStatistics(projectsWithData);

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    this.logger.log(`Data fetch completed in ${duration.toFixed(2)}s`);
    this.logger.log(
      `Total: ${statistics.totalProjects} projects, ${statistics.totalSections} sections, ${statistics.totalDefects} defects`,
    );

    return {
      superproject,
      projects: projectsWithData,
      statistics,
    };
  }

  /**
   * Fetch sections with their defects for a project
   * Uses efficient query with left join
   */
  private async fetchSectionsWithDefects(
    proid: string,
  ): Promise<Array<{ section: Partial<Section>; defects: Partial<Defect>[] }>> {
    // Fetch sections first
    const sections = await this.dataSource
      .getRepository(Section)
      .createQueryBuilder('section')
      .select([
        'section.sectionId',
        'section.tenMeterSectionId',
        'section.pci',
        'section.cci',
        'section.rci',
        'section.distance',
        'section.frame',
        'section.dateCreated',
      ])
      .where('section.proid = :proid', { proid })
      .orderBy('section.tenMeterSectionId', 'ASC')
      .getMany();

    // Fetch all defects for these sections in one query
    const sectionIds = sections.map((s) => s.sectionId);

    if (sectionIds.length === 0) {
      return [];
    }

    const defects = await this.dataSource
      .getRepository(Defect)
      .createQueryBuilder('defect')
      .select([
        'defect.defectId',
        'defect.sectionId',
        'defect.defectType',
        'defect.severity',
        'defect.length',
        'defect.defectWidth',
        'defect.area',
        'defect.depth',
        'defect.volume',
        'defect.wheelPath',
        'defect.defectName',
      ])
      .where('defect.sectionId IN (:...sectionIds)', { sectionIds })
      .orderBy('defect.severity', 'DESC')
      .getMany();

    // Group defects by section
    const defectsBySectionId = new Map<string, Partial<Defect>[]>();
    defects.forEach((defect) => {
      if (!defectsBySectionId.has(defect.sectionId)) {
        defectsBySectionId.set(defect.sectionId, []);
      }
      defectsBySectionId.get(defect.sectionId)!.push(defect);
    });

    // Combine sections with their defects
    return sections.map((section) => ({
      section,
      defects: defectsBySectionId.get(section.sectionId) || [],
    }));
  }

  /**
   * Calculate report statistics
   */
  private calculateStatistics(
    projectsData: Array<{
      project: Partial<Project>;
      sections: Array<{
        section: Partial<Section>;
        defects: Partial<Defect>[];
      }>;
    }>,
  ): {
    totalProjects: number;
    totalSections: number;
    totalDefects: number;
    averagePCI?: number;
    averageCCI?: number;
  } {
    let totalSections = 0;
    let totalDefects = 0;
    let pciSum = 0;
    let pciCount = 0;
    let cciSum = 0;
    let cciCount = 0;

    projectsData.forEach(({ sections }) => {
      sections.forEach(({ section, defects }) => {
        totalSections++;
        totalDefects += defects.length;

        if (section.pci !== null && section.pci !== undefined) {
          pciSum += section.pci;
          pciCount++;
        }

        if (section.cci !== null && section.cci !== undefined) {
          cciSum += section.cci;
          cciCount++;
        }
      });
    });

    return {
      totalProjects: projectsData.length,
      totalSections,
      totalDefects,
      averagePCI: pciCount > 0 ? pciSum / pciCount : undefined,
      averageCCI: cciCount > 0 ? cciSum / cciCount : undefined,
    };
  }

  /**
   * Fetch data with pagination (for very large datasets)
   * Useful for streaming or partial report generation
   */
  async getSuperprojectReportDataPaginated(
    sproid: string,
    projectsPerBatch: number = 5,
  ): Promise<AsyncGenerator<SuperprojectReportData>> {
    const superproject = await this.dataSource
      .getRepository(Superproject)
      .findOne({
        where: { sproid },
        select: [
          'sproid',
          'projectTitle',
          'projectTitleLC',
          'roadSide',
          'companyName',
          'creatorUid',
          'dateCreated',
        ],
      });

    if (!superproject) {
      throw new NotFoundException(`Superproject ${sproid} not found`);
    }

    // Get total project count
    const totalProjects = await this.dataSource
      .getRepository(Project)
      .count({ where: { sproid } });

    async function* generateBatches(self: DatafetchService) {
      for (let skip = 0; skip < totalProjects; skip += projectsPerBatch) {
        const projects = await self.dataSource.getRepository(Project).find({
          where: { sproid },
          skip,
          take: projectsPerBatch,
        });

        const projectsWithData = await Promise.all(
          projects.map(async (project) => ({
            project,
            sections: await self.fetchSectionsWithDefects(project.proid),
          })),
        );

        const statistics = self.calculateStatistics(projectsWithData);

        yield {
          superproject: superproject as Partial<Superproject>,
          projects: projectsWithData,
          statistics,
        };
      }
    }

    return generateBatches(this);
  }

  /**
   * Get quick statistics without fetching all data
   */
  async getSuperprojectStatistics(sproid: string): Promise<{
    totalProjects: number;
    totalSections: number;
    totalDefects: number;
    averagePCI?: number;
    averageCCI?: number;
  }> {
    const [totalProjects, totalSections, totalDefects] = await Promise.all([
      this.dataSource.getRepository(Project).count({ where: { sproid } }),
      this.dataSource.getRepository(Section).count({ where: { sproid } }),
      this.dataSource.getRepository(Defect).count({ where: { sproid } }),
    ]);

    // Get average PCI and CCI
    const averages = await this.dataSource
      .getRepository(Section)
      .createQueryBuilder('section')
      .select('AVG(section.pci)', 'avgPCI')
      .addSelect('AVG(section.cci)', 'avgCCI')
      .where('section.sproid = :sproid', { sproid })
      .getRawOne();

    return {
      totalProjects,
      totalSections,
      totalDefects,
      averagePCI: averages?.avgPCI ? parseFloat(averages.avgPCI) : undefined,
      averageCCI: averages?.avgCCI ? parseFloat(averages.avgCCI) : undefined,
    };
  }
}
