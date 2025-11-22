import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Section } from './section.entity';
import { Superproject } from './superproject.entity';
import { Point } from 'geojson';

@Entity('defects')
@Unique(['sectionId', 'firestoreDefectId'])
export class Defect {
  @Column({
    type: 'text',
    name: 'defect_id',
    default: () => `('DEFID' || nextval('section_id_seq'))`,
    primary: true,
  })
  defectId: string;

  @PrimaryColumn({ type: 'date', name: 'date_created' })
  dateCreated: Date;

  @Column({ type: 'text', name: 'section_id' })
  sectionId: string;

  @Column({ type: 'text' })
  sproid: string;

  @Column({ type: 'text' })
  coid: string;

  @Column({ type: 'text', name: 'image_name', nullable: true })
  imageName: string;

  @Column({ type: 'double precision', name: 'wheel_path', nullable: true })
  wheelPath: number;

  @Column({ type: 'double precision', name: 'defect_name', nullable: true })
  defectName: number;

  @Column({ type: 'boolean', nullable: true, name: 'is_rectangle' })
  isRectangle: boolean;

  @Column({ type: 'double precision', name: 'depth', nullable: true })
  depth: number;

  @Column({ type: 'double precision', name: 'length', nullable: true })
  length: number;

  @Column({ type: 'double precision', name: 'area', nullable: true })
  area: number;

  @Column({ type: 'integer', name: 'defect_type', nullable: true })
  defectType: number;

  @Column({ type: 'double precision', name: 'defect_width', nullable: true })
  defectWidth: number;

  @Column({ type: 'integer', nullable: true })
  severity: number;

  @Column({ type: 'double precision', name: 'geo_time', nullable: true })
  geoTime: number;

  @Column({ type: 'text', name: 'defect_image_path', nullable: true })
  defectImagePath: string;

  @Column({ type: 'double precision', name: 'profile', nullable: true })
  profile: number;

  @Column({
    type: 'double precision',
    name: 'longitudinal_span',
    nullable: true,
  })
  longitudinalSpan: number;

  @Column({ type: 'integer', name: 'transverse_position', nullable: true })
  transversePosition: number;

  @Column({ type: 'double precision', name: 'volume', nullable: true })
  volume: number;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  gps: Point;

  @Column({ type: 'integer', name: 'group_frame_number', nullable: true })
  groupFrameNumber: number;

  @Column({ type: 'jsonb', nullable: true })
  bbox: any;

  @Column({ type: 'integer', name: 'group_id', nullable: true })
  groupId: number;

  @Column({ type: 'integer', name: 'frame_number', nullable: true })
  frameNumber: number;

  @Column({ type: 'double precision', name: 'base64', nullable: true })
  base64: number;

  @Column({ type: 'text', name: 'hex_code', nullable: true })
  hexCode: string;

  @Column({ type: 'double precision', name: 'transverse_span', nullable: true })
  transverseSpan: number;

  @Column({ type: 'text', name: 'firestore_defect_id', nullable: true })
  firestoreDefectId: string;

  @Column({ type: 'double precision', name: 'archived', nullable: true })
  archived: number;

  @Column({ type: 'integer', name: 'water_pumping', nullable: true })
  waterPumping: number;

  @Column({ type: 'double precision', name: 'thickness', nullable: true })
  thickness: number;

  @Column({ type: 'jsonb', name: 'assign_network_map', nullable: true })
  assignNetworkMap: any;

  @Column({ type: 'text', name: 'gps_corner', nullable: true })
  gpsCorner: string;

  @Column({
    type: 'double precision',
    array: true,
    name: 'gps_bbox',
    nullable: true,
  })
  gpsBbox: number[];

  @Column({ type: 'boolean', name: 'is_complete', nullable: true })
  isComplete: boolean;

  @Column({ type: 'integer', name: 'region', nullable: true })
  region: number;

  @ManyToOne(() => Section, (section) => section.defects, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Superproject, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sproid' })
  superproject: Superproject;
}
