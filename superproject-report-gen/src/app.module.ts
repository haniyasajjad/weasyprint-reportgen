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

@Module({
  imports: [
        TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: false,
        logging: false,
        // logging: ['query', 'error'],
        // Explicitly list all entities here for clarity and reliability
        entities: [
          Supersection,
          Superproject,
          Section,
          Defect,
          Project,
        ],
        // You can keep autoLoadEntities: true; it won't hurt, but the explicit list is definitive
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
