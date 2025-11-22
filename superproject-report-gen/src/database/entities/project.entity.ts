import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Section } from './section.entity';
import { Superproject } from './superproject.entity';

@Entity('projects')
export class Project {
  @PrimaryColumn({ type: 'text' })
  proid: string;

  @Column({ type: 'text', nullable: true })
  sproid: string;

  @Column({ type: 'jsonb', name: 'group_videos_info' })
  groupVideosInfo: { groupId: number; videoPath: string }[];

  @Column({ type: 'integer' })
  association: number;

  @Column({ type: 'integer', name: 'project_type', nullable: true })
  projectType: number;

  @CreateDateColumn({ type: 'timestamp', name: 'date_created' })
  dateCreated: Date;

  @Column({ type: 'boolean', nullable: true, name: 'show_fresh_intro_mob' })
  showFreshIntroMob: boolean;

  @Column({ type: 'boolean', nullable: true, name: 'show_fresh_intro_web' })
  showFreshIntroWeb: boolean;

  @Column({ type: 'text', nullable: true, name: 'profile_pic' })
  profilePic: string;

  @Column({ type: 'text', nullable: true, name: 'detection_thumbnail_path' })
  detectionThumbnailPath: string;

  @Column({ type: 'text', nullable: true, name: 'project_title' })
  projectTitle: string;

  @Column({ type: 'text', nullable: true, name: 'road_side' })
  roadSide: string;

  @Column({ type: 'text', nullable: true, name: 'cam_pos' })
  camPos: string;

  @Column({ type: 'text', nullable: true, name: 'cam_dir' })
  camDir: string;

  @Column({ type: 'text', nullable: true, name: 'identification_no' })
  identificationNo: string;

  @Column({ type: 'text', nullable: true, name: 'client_name' })
  clientName: string;

  @Column({ type: 'text', nullable: true, name: 'street_name' })
  streetName: string;

  @Column({ type: 'text', nullable: true, name: 'starting_address' })
  startingAddress: string;

  @Column({ type: 'text', nullable: true, name: 'ending_address' })
  endingAddress: string;

  @Column({ type: 'text', nullable: true, name: 'direction' })
  direction: string;

  @Column({ type: 'text', nullable: true, name: 'total_lanes' })
  totalLanes: string;

  @Column({ type: 'text', nullable: true, name: 'lane_number' })
  laneNumber: string;

  @Column({ type: 'jsonb', nullable: true, name: 'categories' })
  categories: any | null;

  @Column({ type: 'text', nullable: true, name: 'project_title_lc' })
  projectTitleLC: string;

  @Column({ type: 'text', nullable: true, name: 'company_name' })
  companyName: string;

  @Column({ type: 'text', nullable: true, name: 'creator_uid' })
  creatorUid: string;

  @Column({ type: 'text', nullable: true, name: 'creator_employee_id' })
  creatorEmployeeid: string;

  @Column({ type: 'text', nullable: true, name: 'coid' })
  coid: string;

  @Column({ type: 'text', nullable: true, name: 'camera_mounting_height' })
  cameraMountingHeight: string;

  @Column({ type: 'text', nullable: true, name: 'camera_inclination' })
  cameraInclination: string;

  @Column({ type: 'text', nullable: true, name: 'type_of_road' })
  typeOfRoad: string;

  @Column({ type: 'text', nullable: true, name: 'processing_time' })
  processingTime: string;

  @Column({ type: 'date', nullable: true, name: 'survey_date' })
  surveyDate: Date;

  @Column({ type: 'boolean', nullable: true, name: 'segregated_cyclepath' })
  segregatedCyclepath: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'access_map' })
  accessMap: Record<string, any>;

  @Column({ type: 'boolean', default: false, name: 'archived', nullable: true })
  archived: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'condition_index' })
  conditionIndex: number[];

  @Column({ type: 'int', nullable: true, name: 'videos_count' })
  videosCount: number;

  @Column({ type: 'text', nullable: true, name: 'video_message' })
  videoMessage: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_video_uploading_on_db',
    nullable: true,
  })
  isVideoUploadingOnDB: boolean;

  @Column({ type: 'text', nullable: true, name: 'thumbnail' })
  thumbnail: string;

  @Column({ type: 'jsonb', nullable: true, name: 'dimensions' })
  dimensions: Record<string, any>;

  @Column({ type: 'float', nullable: true, name: 'fps' })
  fps: number;

  @Column({ type: 'jsonb', nullable: true, name: 'videos' })
  videos: any[];

  @Column({ type: 'text', nullable: true, name: 'payment_subscription_id' })
  paymentSubscriptionId: string | null;

  @Column({
    type: 'double precision',
    nullable: true,
    name: 'total_estimated_distance',
  })
  totalEstimatedDistance: number;

  @Column({
    type: 'boolean',
    default: false,
    name: 'pay_from_subscription',
    nullable: true,
  })
  payFromSubscription: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'has_no_duplicate',
    nullable: true,
  })
  hasNoDuplicate: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_gps_distance_valid',
    nullable: true,
  })
  isGpsDistanceValid: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_video_order',
    nullable: true,
  })
  isVideoOrder: boolean;

  @Column({ type: 'text', nullable: true, name: 'gps_approval_message' })
  gpsApprovalMessage: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_gps_edit_done',
    nullable: true,
  })
  isGpsEditDone: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'video_selection_path' })
  videoSelectionPath: Record<string, string>;

  @Column({
    type: 'double precision',
    nullable: true,
    name: 'base_credit_amount_required',
  })
  baseCreditAmountRequired: number;

  @Column({
    type: 'boolean',
    default: false,
    name: 'calculating_price',
    nullable: true,
  })
  calculatingPrice: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'real_cost' })
  realCost: Record<string, any>;

  @Column({ type: 'float', nullable: true, name: 'total_processing_distance' })
  totalProcessingDistance: number;

  @Column({ type: 'float', nullable: true, name: 'approx_credits_required' })
  approxCreditsRequired: number;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_video_selection_done',
    nullable: true,
  })
  isVideoSelectionDone: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_project_updated',
    nullable: true,
  })
  isProjectUpdated: boolean;

  @Column({ type: 'text', nullable: true, name: 'project_credit_jar' })
  projectCreditJar: string;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_halted',
    nullable: true,
  })
  isHalted: boolean;

  @Column({ type: 'text', nullable: true, name: 'analysis_error' })
  analysisError: string | null;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_halt_possible',
    nullable: true,
  })
  isHaltPossible: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_halt_in_process',
    nullable: true,
  })
  isHaltInProcess: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'cci_inverted',
    nullable: true,
  })
  cciInverted: boolean;

  @Column({ type: 'text', nullable: true, name: 'video_path' })
  videoPath: string;

  @Column({ type: 'int', default: 0, name: 'frames', nullable: true })
  frames: number;

  @Column({ type: 'int', nullable: true, name: 'condition_method' })
  conditionMethod: number;

  @Column({ type: 'jsonb', nullable: true, name: 'selected_defects' })
  selectedDefects: any[];

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_default_filter',
    nullable: true,
  })
  isDefaultFilter: boolean;

  @Column({ type: 'jsonb', nullable: true, name: 'advanced_filters' })
  advancedFilters: Record<string, any>;

  @Column({ type: 'text', nullable: true, name: 'analysis_req_id' })
  analysisReqId: string;

  @Column({ type: 'int', nullable: true, name: 'stitch_height' })
  stitchHeight: number;

  @Column({ type: 'float', nullable: true, name: 'stitch_fps' })
  stitchFps: number;

  @Column({ type: 'int', nullable: true, name: 'stitch_frame' })
  stitchFrame: number;

  @Column({ type: 'text', nullable: true, name: 'stitch_video_path' })
  stitchVideoPath: string;

  @Column({ type: 'int', nullable: true, name: 'stitch_width' })
  stitchWidth: number;

  @Column({ type: 'int', nullable: true, name: 'status' })
  status: number;

  @Column({ type: 'jsonb', nullable: true, name: 'selected_region_filters' })
  selectedRegionFilters: any[];

  @Column({ type: 'jsonb', nullable: true, name: 'associated_networks' })
  associatedNetworks: any[];

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_forked',
    nullable: true,
  })
  isForked: boolean;

  @Column({ type: 'text', nullable: true, name: 'forked_from' })
  forkedFrom: string;

  @Column({ type: 'text', nullable: true, name: 'forked_data_from' })
  forkedDataFrom: string;

  @Column({ type: 'jsonb', nullable: true, name: 'access_list' })
  accessList: string[];

  @Column({ type: 'boolean', name: 'calculate_iri', nullable: true })
  calculateIRI: boolean;

  @Column({ type: 'jsonb', name: 'region_filter', nullable: true })
  regionFilter: { id: number; name: string }[];

  @Column({ type: 'text', name: 'lane_type', nullable: true })
  laneType: string;

  @Column({ type: 'text', name: 'lane_config', nullable: true })
  laneConfig: string;

  @Column({ type: 'text', name: 'lane_selection', nullable: true })
  laneSelection: string;

  @Column({ type: 'text', name: 'shoulder_drop', nullable: true })
  shoulderDrop: string;

  @Column({ type: 'boolean', name: 'is_gnss_step_done', nullable: true })
  isGnssStepDone: boolean;

  @Column({ type: 'double precision', name: 'dx', nullable: true })
  dx: number;

  @Column({ type: 'double precision', name: 'dy', nullable: true })
  dy: number;

  @OneToMany(() => Section, (section) => section.project)
  sections: Section[];

  @ManyToOne(() => Superproject, (superproject) => superproject.sections, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'sproid' })
  superproject: Superproject;
}
