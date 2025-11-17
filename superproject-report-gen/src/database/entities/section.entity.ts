import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Project } from './project.entity';
import { Superproject } from './superproject.entity';
import { Defect } from './defect.entity';
import { Point } from 'geojson';

@Entity('sections')
@Unique(['tenMeterSectionId', 'proid'])
export class Section {
  @Column({
    type: 'text',
    name: 'section_id',
    default: () => `('SECID' || nextval('section_id_seq'))`,
    primary: true,
  })
  sectionId: string;

  @Column({ type: 'text' })
  sproid: string;

  @Column({ type: 'text' })
  coid: string;

  @Column({ type: 'text', name: 'supersection_id', nullable: true })
  supersectionId: string;

  @Column({ type: 'text', nullable: true, name: 'mask_path_hr' })
  maskPathHR: string;

  @Column({ type: 'integer', name: 'lr_width', nullable: true })
  lrWidth: number;

  @Column({ type: 'text', nullable: true, name: 'depth_map_path' })
  depthMapPath: string;

  @Column({ type: 'text', name: 'ten_meter_section_id' })
  tenMeterSectionId: string;

  @Column({ type: 'integer', name: 'init_index', nullable: true })
  initIndex: number;

  @Column({ type: 'text', nullable: true, name: 'depth_map_path_hr' })
  depthMapPathHR: string;

  @Column({ type: 'integer', name: 'group_id', nullable: true })
  groupId: number;

  @Column({ type: 'integer', name: 'lr_height', nullable: true })
  lrHeight: number;

  @Column({ type: 'integer', name: 'end_index', nullable: true })
  endIndex: number;

  @Column({ type: 'text', name: 'mask_path', nullable: true })
  maskPath: string;

  @Column({ type: 'integer', name: 'group_init_index', nullable: true })
  groupInitIndex: number;

  @Column({ type: 'integer', name: 'group_end_index', nullable: true })
  groupEndIndex: number;

  @Column({ type: 'jsonb', nullable: true, name: 'utm_data' })
  utmData: {
    tly: [number, number];
    scaleFactor: number;
    tlxPixel: number;
    zoneNumber: number;
    bryPixel: number;
    zone: string;
    bry: [number, number];
    brx: [number, number];
    depthParameter: number;
    tlyPixel: number;
    tlx: [number, number];
    brxPixel: number;
  };

  @Column({ type: 'text', name: 'stitch_path', nullable: true })
  stitchPath: string;

  @Column({ type: 'integer', name: 'hr_height', nullable: true })
  hrHeight: number;

  @Column({ type: 'text', name: 'stitch_path_hr', nullable: true })
  stitchPathHR: string;

  @Column({ type: 'integer', name: 'hr_width', nullable: true })
  hrWidth: number;

  @Column({ type: 'double precision', default: -1, nullable: true })
  rci: number;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
    name: 'starting_gps',
  })
  startingGps: Point;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
    name: 'ending_gps',
  })
  endingGps: Point;

  @Column({ type: 'jsonb', nullable: true, name: 'gps' })
  gps: { lat: number; lng: number; time?: number } | null;

  @Column({ type: 'integer', nullable: true })
  frame: number;

  @Column({ type: 'double precision', default: 0, nullable: true })
  distance: number;

  @Column({ type: 'double precision' , nullable: true})
  pci: number;

  @Column({ type: 'double precision', default: -1, nullable: true})
  cci: number;

  @Column({ type: 'integer', name: 'stitch_frame_number', nullable: true })
  stitchFrameNumber: number;

  @CreateDateColumn({ type: 'timestamp', name: 'date_created' })
  dateCreated: Date;

  @Column({ type: 'text' })
  proid: string;

  @Column({ type: 'text', name: 'depth_path', nullable: true })
  depthPath: string;

  @Column({ type: 'jsonb', name: 'assign_network_map', nullable: true })
  assignNetworkMap: any;

  @ManyToOne(() => Project, (project) => project.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'proid' })
  project: Project;

  @ManyToOne(() => Superproject, (superproject) => superproject.sections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sproid' })
  superproject: Superproject;

  @OneToMany(() => Defect, (defect) => defect.section)
  defects: Defect[];
}
