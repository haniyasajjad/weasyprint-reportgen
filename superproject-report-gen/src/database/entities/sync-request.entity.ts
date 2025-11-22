import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sync_request')
export class SyncRequest {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'collection_path', type: 'text', nullable: true })
  collectionPath: string;

  @Column({ name: 'document_id', type: 'text', nullable: true })
  documentId: string;

  @Column({ name: 'sync_type', type: 'text', nullable: true })
  syncType: string;

  @Column({ name: 'update_status', type: 'boolean', default: false })
  updateStatus: boolean;

  @Column({ type: 'integer', name: 'retry_counts', default: 0 })
  retryCounts: number;
}
