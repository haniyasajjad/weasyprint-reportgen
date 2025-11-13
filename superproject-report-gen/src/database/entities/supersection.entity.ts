import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Superproject } from './superproject.entity';

@Entity('supersections')
export class Supersection {
  @PrimaryColumn({ type: 'text', name: 'supersection_id' })
  supersectionId: string;

  @Column({ type: 'text' })
  sproid: string;

  @Column({ type: 'text', name: 'supersection_title' })
  supersectionTitle: string;

  @Column({ type: 'text', name: 'encoded_geometry' })
  encodedGeometry: string;

  @Column({ type: 'double precision', name: 'super_pci', nullable: true })
  superPci: number;

  @Column({ type: 'double precision', name: 'super_rci', nullable: true })
  superRci: number;

  @Column({ type: 'double precision', name: 'super_cci', nullable: true })
  superCci: number;

  @Column({
    type: 'int',
    name: 'supersection_type',
    nullable: true,
    default: 0,
  })
  supersectionType: number;

  @Column({
    type: 'int',
    name: 'super_region_type',
    nullable: true,
    default: 0,
  })
  superRegionType: number;

  @Column({
    type: 'double precision',
    name: 'distance',
    nullable: true,
    default: 0,
  })
  distance: number;

  @Column({ type: 'boolean', default: false, name: 'archived', nullable: true })
  archived: boolean;

  @Column({ type: 'text', name: 'coid', nullable: true })
  coid: string;

  @CreateDateColumn({ type: 'timestamp', name: 'date_created' })
  dateCreated: Date;

  @ManyToOne(() => Superproject, (superproject) => superproject.supersections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sproid' })
  superproject: Superproject;
}
