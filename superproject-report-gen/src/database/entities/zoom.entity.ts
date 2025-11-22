import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('zoom_configuration')
export class ZoomConfiguration {
  @PrimaryColumn({ type: 'integer', name: 'zoom_level' })
  zoomLevel: number;

  @Column({
    type: 'text',
    name: 'configuration',
    nullable: false,
  })
  configuration: string;
}
