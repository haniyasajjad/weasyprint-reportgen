import 'dotenv/config'; // Loads .env file
import { DataSource } from 'typeorm';
import { generateData } from './generateMockData'; // No extension needed

// Note: We import without extensions in TS. The loader handles it.
import { Superproject } from '../database/entities/superproject.entity';
import { Project } from '../database/entities/project.entity';
import { Section } from '../database/entities/section.entity';
import { Defect } from '../database/entities/defect.entity';
import { Supersection } from '../database/entities/supersection.entity';

// Ensure these exist in your .env file or hardcode them temporarily
const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'pgAdmin',
  database: process.env.DB_NAME || 'SyncAuth2', // Update this!
  synchronize: false,
  logging: false,
  entities: [Superproject, Project, Section, Defect, Supersection],
});

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await myDataSource.initialize();
    console.log('Database connection initialized.');

    const superprojectRepo = myDataSource.getRepository(Superproject);
    const projectRepo = myDataSource.getRepository(Project);
    const sectionRepo = myDataSource.getRepository(Section);
    const defectRepo = myDataSource.getRepository(Defect);

    // --- GENERATE DATA ---
    const { superprojects, projects, sections, defects } = generateData();

    // --- SAVE DATA ---

    // 1. Superproject
    console.log('Saving superproject...');
    await superprojectRepo.save(superprojects);

    // 2. Projects
    console.log('Saving projects...');
    await projectRepo.save(projects);

    // 3. Sections (Batched)
    console.log(`Saving ${sections.length} sections...`);
    await sectionRepo.save(sections, { chunk: 100 });

    // 4. Defects (Batched)
    console.log(`Saving ${defects.length} defects...`);
    await defectRepo.save(defects, { chunk: 100 });

    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  } finally {
    await myDataSource.destroy();
    console.log('Database connection closed.');
  }
}

seedDatabase();
