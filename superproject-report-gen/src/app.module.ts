import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Supersection } from './database/entities/supersection.entity';
import { Superproject } from './database/entities/superproject.entity';
import { Section } from './database/entities/section.entity';
import { Defect } from './database/entities/defect.entity';
import { Project } from './database/entities/project.entity';
import { ReportgenModule } from './reportgen/reportgen.module';
import { DatafetchModule } from './datafetch/datafetch.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres', // match your .env
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'gps_data_db',
        synchronize: false,
        logging: false,
        entities: [Supersection, Superproject, Section, Defect, Project],
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    ReportgenModule,
    DatafetchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
