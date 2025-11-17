import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Section } from './section.entity';

@Entity('superprojects')
export class Superproject {
  @PrimaryColumn({ type: 'text' })
  sproid: string;

  @Column('text', { array: true, name: 'proid_list', default: [] })
  proidList: string[] = [];

  @Column({ type: 'text', name: 'project_title', nullable: true })
  projectTitle: string;

  @Column({ type: 'text', name: 'project_title_lc', nullable: true })
  projectTitleLC: string;

  @Column({ type: 'text', name: 'road_side', nullable: true })
  roadSide: string;

  @Column({ type: 'boolean', default: false })
  archived: boolean;

  @Column({ type: 'text', name: 'creator_uid', nullable: true })
  creatorUid: string;

  @Column({ type: 'text', name: 'creator_employee_id', nullable: true })
  creatorEmployeeid: string;

  @Column({ type: 'text', name: 'company_name', nullable: true })
  companyName: string;

  @Column({ type: 'text', name: 'coid', nullable: true })
  coid: string;

  @Column({ type: 'integer', name: 'videos_count', default: 0, nullable: true })
  videosCount: number;

  @Column('text', { array: true, name: 'access_list', default: [] })
  accessList: string[];

  @Column({ type: 'jsonb', name: 'videos', nullable: true })
  videos: Record<string, any>;

  @Column({ type: 'jsonb', name: 'all_projects', nullable: true })
  allProjects: Record<string, any>;

  @Column({ type: 'jsonb', name: 'access_map', nullable: true })
  accessMap: Record<string, any>;

  @Column('text', { array: true, name: 'associated_projects', default: [] })
  associatedProjects: string[];

  @CreateDateColumn({ type: 'timestamp', name: 'date_created', nullable: true })
  dateCreated: Date;

  @Column({ type: 'integer', nullable: true, name: 'status' })
  status: number;



  @OneToMany(() => Section, section => section.superproject)
  sections: Section[];
}