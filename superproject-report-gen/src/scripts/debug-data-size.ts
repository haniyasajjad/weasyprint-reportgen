// Save this as: src/scripts/debug-data-size.ts
// Run with: npx ts-node src/scripts/debug-data-size.ts SPROID_c835a489-cbee-4b97-a8d2-edfedb501688

import { DataSource } from 'typeorm';
import { AppDataSource } from '../database/datasource';
import { Superproject } from '../database/entities/superproject.entity';
import { Project } from '../database/entities/project.entity';
import { Section } from '../database/entities/section.entity';
import { Defect } from '../database/entities/defect.entity';

async function debugDataSize(sproid: string) {
  console.log('🔍 Debugging data size for:', sproid);
  console.log('');

  // Initialize database
  await AppDataSource.initialize();
  console.log('✅ Database connected');
  console.log('');

  // Get repositories
  const superprojectRepo = AppDataSource.getRepository(Superproject);
  const projectRepo = AppDataSource.getRepository(Project);
  const sectionRepo = AppDataSource.getRepository(Section);
  const defectRepo = AppDataSource.getRepository(Defect);

  // Fetch superproject
  const superproject = await superprojectRepo.findOne({ where: { sproid } });
  if (!superproject) {
    console.log('❌ Superproject not found');
    process.exit(1);
  }

  console.log('📊 Superproject found:', superproject.projectTitle);
  console.log('');

  // Count data
  const projectCount = await projectRepo.count({ where: { sproid } });
  const sectionCount = await sectionRepo.count({ where: { sproid } });
  const defectCount = await defectRepo.count({ where: { sproid } });

  console.log('📈 Data Statistics:');
  console.log(`   Projects: ${projectCount}`);
  console.log(`   Sections: ${sectionCount}`);
  console.log(`   Defects:  ${defectCount}`);
  console.log('');

  // Fetch a small sample to estimate size
  console.log('📦 Fetching sample data...');
  const sampleProjects = await projectRepo.find({
    where: { sproid },
    take: 2,
  });

  const sampleSections = await sectionRepo.find({
    where: { sproid },
    take: 10,
  });

  const sampleDefects = await defectRepo.find({
    where: { sproid },
    take: 50,
  });

  // Estimate JSON size
  const sampleData = {
    superproject,
    projects: sampleProjects.map((p) => ({
      project: p,
      sections: sampleSections.slice(0, 5).map((s) => ({
        section: s,
        defects: sampleDefects.slice(0, 25),
      })),
    })),
    statistics: {
      totalProjects: projectCount,
      totalSections: sectionCount,
      totalDefects: defectCount,
    },
  };

  const sampleJson = JSON.stringify(sampleData);
  const sampleSizeKB = Buffer.byteLength(sampleJson) / 1024;

  // Estimate full size
  const estimatedFullSizeMB = (sampleSizeKB * (sectionCount / 10)) / 1024;

  console.log('');
  console.log('💾 Size Estimates:');
  console.log(
    `   Sample (2 projects, 10 sections): ${sampleSizeKB.toFixed(2)} KB`,
  );
  console.log(`   Estimated Full Data: ${estimatedFullSizeMB.toFixed(2)} MB`);
  console.log('');

  if (estimatedFullSizeMB > 100) {
    console.log('⚠️  WARNING: Data is very large (>100 MB)');
    console.log('   This might cause issues with stdin pipe');
    console.log('   Consider using streaming mode or file-based approach');
  } else if (estimatedFullSizeMB > 10) {
    console.log('⚠️  CAUTION: Data is large (>10 MB)');
    console.log('   Should work but might be slow');
  } else {
    console.log('✅ Data size looks reasonable');
  }

  console.log('');
  console.log('🧪 Testing small subset generation...');

  // Create minimal test data
  const minimalData = {
    superproject: {
      sproid: superproject.sproid,
      projectTitle: superproject.projectTitle,
      companyName: superproject.companyName,
      dateCreated: superproject.dateCreated,
    },
    statistics: {
      totalProjects: 1,
      totalSections: 2,
      totalDefects: 5,
    },
    projects: [
      {
        proid: sampleProjects[0]?.proid || 'TEST',
        projectTitle: sampleProjects[0]?.projectTitle || 'Test Project',
        streetName: sampleProjects[0]?.streetName || 'Test Street',
        sections: sampleSections.slice(0, 2).map((section) => ({
          sectionId: section.sectionId,
          pci: section.pci,
          cci: section.cci,
          rci: section.rci,
          distance: section.distance,
          defects: sampleDefects.slice(0, 5).map((defect) => ({
            defectId: defect.defectId,
            defectType: defect.defectType,
            severity: defect.severity,
            length: defect.length,
            defectWidth: defect.defectWidth,
          })),
        })),
      },
    ],
  };

  const minimalJson = JSON.stringify(minimalData, null, 2);
  console.log('');
  console.log('📄 Minimal test data created');
  console.log(
    `   Size: ${(Buffer.byteLength(minimalJson) / 1024).toFixed(2)} KB`,
  );
  console.log('');

  // Save to file for manual testing
  const fs = require('fs');
  const testDataPath = '/tmp/test-report-data.json';

  const testInput = {
    outputPath: '/tmp/test-report-output.pdf',
    data: minimalData,
  };

  fs.writeFileSync(testDataPath, JSON.stringify(testInput, null, 2));
  console.log(`✅ Test data saved to: ${testDataPath}`);
  console.log('');
  console.log('🧪 To test Python script manually:');
  console.log(
    `   cat ${testDataPath} | python3 src/reportgen/weasyprint/generator.py`,
  );
  console.log('');

  await AppDataSource.destroy();
}

// Get sproid from command line
const sproid = process.argv[2];
if (!sproid) {
  console.log('Usage: npx ts-node src/scripts/debug-data-size.ts <SPROID>');
  process.exit(1);
}

debugDataSize(sproid)
  .then(() => {
    console.log('✅ Debug complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
