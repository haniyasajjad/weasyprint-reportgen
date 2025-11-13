import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: join(__dirname, '../', '../', '.env') });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false, 
  entities: [__dirname + '/**/entities/*.entity{.ts,.js}'],
  migrations: [`${__dirname}/**/migration/*{.ts,.js}`],
  migrationsTableName: 'migrations'
});