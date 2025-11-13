import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';

@Entity('sectional_parameters')
export class SectionalParameter {
  @PrimaryColumn({ type: 'text', name: 'section_id' })
  sectionId: string;

 @Column({ type: 'text', name: 'rutting_rows', nullable: true })
  ruttingRows: string;

  @Column({ type: 'double precision', name: 'edge_deformation_left' })
  edgeDeformationLeft: number;

  @Column({ type: 'double precision', name: 'edge_deformation_right' })
  edgeDeformationRight: number;

  @Column({ type: 'double precision', name: 'rutting_left' })
  ruttingLeft: number;
  
  @Column({ type: 'double precision', name: 'rutting_right' })
  ruttingRight: number;

  @Column({ type: 'double precision', name: 'longitudinal_variance_3m' })
  longitudinalVariance3m: number;
  
  @Column({ type: 'double precision', name: 'longitudinal_variance_10m' })
  longitudinalVariance10m: number;
  
  @Column({ type: 'double precision', name: 'single_lane_width' })
  singleLaneWidth: number;
  
  @Column({ type: 'double precision', name: 'double_lane_width' })
  doubleLaneWidth: number;
  
  @Column({ type: 'double precision', name: 'shoulder_width' })
  shoulderWidth: number;

  @OneToOne(() => Section, section => section.sectionalParameters)
  @JoinColumn({ name: 'section_id' })
  section: Section;
}