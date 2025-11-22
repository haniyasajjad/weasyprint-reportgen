import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763462405059 implements MigrationInterface {
  name = 'InitialSchema1763462405059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS section_id_seq`);
    await queryRunner.query(
      `CREATE TABLE "zoom_configuration" ("zoom_level" integer NOT NULL, "configuration" text NOT NULL, CONSTRAINT "PK_bb64531b5bd36d8b542a6819af0" PRIMARY KEY ("zoom_level"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sync_request" ("id" SERIAL NOT NULL, "collection_path" text, "document_id" text, "sync_type" text, "update_status" boolean NOT NULL DEFAULT false, "retry_counts" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_21b3522e770a22f0012df1391eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("proid" text NOT NULL, "sproid" text, "group_videos_info" jsonb NOT NULL, "association" integer NOT NULL, "project_type" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "show_fresh_intro_mob" boolean, "show_fresh_intro_web" boolean, "profile_pic" text, "detection_thumbnail_path" text, "project_title" text, "road_side" text, "cam_pos" text, "cam_dir" text, "identification_no" text, "client_name" text, "street_name" text, "starting_address" text, "ending_address" text, "direction" text, "total_lanes" text, "lane_number" text, "categories" jsonb, "project_title_lc" text, "company_name" text, "creator_uid" text, "creator_employee_id" text, "coid" text, "camera_mounting_height" text, "camera_inclination" text, "type_of_road" text, "processing_time" text, "survey_date" date, "segregated_cyclepath" boolean, "access_map" jsonb, "archived" boolean DEFAULT false, "condition_index" jsonb, "videos_count" integer, "video_message" text, "is_video_uploading_on_db" boolean DEFAULT false, "thumbnail" text, "dimensions" jsonb, "fps" double precision, "videos" jsonb, "payment_subscription_id" text, "total_estimated_distance" double precision, "pay_from_subscription" boolean DEFAULT false, "has_no_duplicate" boolean DEFAULT false, "is_gps_distance_valid" boolean DEFAULT false, "is_video_order" boolean DEFAULT false, "gps_approval_message" text, "is_gps_edit_done" boolean DEFAULT false, "video_selection_path" jsonb, "base_credit_amount_required" double precision, "calculating_price" boolean DEFAULT false, "real_cost" jsonb, "total_processing_distance" double precision, "approx_credits_required" double precision, "is_video_selection_done" boolean DEFAULT false, "is_project_updated" boolean DEFAULT false, "project_credit_jar" text, "is_halted" boolean DEFAULT false, "analysis_error" text, "is_halt_possible" boolean DEFAULT false, "is_halt_in_process" boolean DEFAULT false, "cci_inverted" boolean DEFAULT false, "video_path" text, "frames" integer DEFAULT '0', "condition_method" integer, "selected_defects" jsonb, "is_default_filter" boolean DEFAULT false, "advanced_filters" jsonb, "analysis_req_id" text, "stitch_height" integer, "stitch_fps" double precision, "stitch_frame" integer, "stitch_video_path" text, "stitch_width" integer, "status" integer, "selected_region_filters" jsonb, "associated_networks" jsonb, "is_forked" boolean DEFAULT false, "forked_from" text, "forked_data_from" text, "access_list" jsonb, "calculate_iri" boolean, "region_filter" jsonb, "lane_type" text, "lane_config" text, "lane_selection" text, "shoulder_drop" text, "is_gnss_step_done" boolean, "dx" double precision, "dy" double precision, CONSTRAINT "PK_bfa7c2f2225c06d64efdb7098f6" PRIMARY KEY ("proid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "defects" ("defect_id" text NOT NULL DEFAULT ('DEFID' || nextval('section_id_seq')), "date_created" date NOT NULL, "section_id" text NOT NULL, "sproid" text NOT NULL, "coid" text NOT NULL, "image_name" text, "wheel_path" double precision, "defect_name" double precision, "is_rectangle" boolean, "depth" double precision, "length" double precision, "area" double precision, "defect_type" integer, "defect_width" double precision, "severity" integer, "geo_time" double precision, "defect_image_path" text, "profile" double precision, "longitudinal_span" double precision, "transverse_position" integer, "volume" double precision, "gps" geometry(Point,4326) NOT NULL, "group_frame_number" integer, "bbox" jsonb, "group_id" integer, "frame_number" integer, "base64" double precision, "hex_code" text, "transverse_span" double precision, "firestore_defect_id" text, "archived" double precision, "water_pumping" integer, "thickness" double precision, "assign_network_map" jsonb, "gps_corner" text, "gps_bbox" double precision array, "is_complete" boolean, "region" integer, CONSTRAINT "UQ_9b85acfed827a870797d7b02b76" UNIQUE ("section_id", "firestore_defect_id"), CONSTRAINT "PK_1bb7d400cc9a9188f74935ca620" PRIMARY KEY ("defect_id", "date_created"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sections" ("section_id" text NOT NULL DEFAULT ('SECID' || nextval('section_id_seq')), "sproid" text NOT NULL, "coid" text NOT NULL, "supersection_id" text, "mask_path_hr" text, "lr_width" integer, "depth_map_path" text, "ten_meter_section_id" text NOT NULL, "init_index" integer, "depth_map_path_hr" text, "group_id" integer, "lr_height" integer, "end_index" integer, "mask_path" text, "group_init_index" integer, "group_end_index" integer, "utm_data" jsonb, "stitch_path" text, "hr_height" integer, "stitch_path_hr" text, "hr_width" integer, "rci" double precision DEFAULT '-1', "starting_gps" geometry(Point,4326) NOT NULL, "ending_gps" geometry(Point,4326) NOT NULL, "gps" jsonb, "frame" integer, "distance" double precision DEFAULT '0', "pci" double precision, "cci" double precision DEFAULT '-1', "stitch_frame_number" integer, "date_created" TIMESTAMP NOT NULL DEFAULT now(), "proid" text NOT NULL, "depth_path" text, "assign_network_map" jsonb, CONSTRAINT "UQ_f0225c7e1d2ff825cfb7ec9b15d" UNIQUE ("ten_meter_section_id", "proid"), CONSTRAINT "PK_c5641bfa4992d9bb24205e4cf12" PRIMARY KEY ("section_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "superprojects" ("sproid" text NOT NULL, "proid_list" text array NOT NULL DEFAULT '{}', "project_title" text, "project_title_lc" text, "road_side" text, "archived" boolean NOT NULL DEFAULT false, "creator_uid" text, "creator_employee_id" text, "company_name" text, "coid" text, "videos_count" integer DEFAULT '0', "access_list" text array NOT NULL DEFAULT '{}', "videos" jsonb, "all_projects" jsonb, "access_map" jsonb, "associated_projects" text array NOT NULL DEFAULT '{}', "date_created" TIMESTAMP DEFAULT now(), "status" integer, CONSTRAINT "PK_88b55ef27f47fd33d2b39861c4e" PRIMARY KEY ("sproid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "supersections" ("supersection_id" text NOT NULL, "sproid" text NOT NULL, "supersection_title" text NOT NULL, "encoded_geometry" text NOT NULL, "super_pci" double precision, "super_rci" double precision, "super_cci" double precision, "supersection_type" integer DEFAULT '0', "super_region_type" integer DEFAULT '0', "distance" double precision DEFAULT '0', "archived" boolean DEFAULT false, "coid" text, "date_created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3dfa6e0c51deadfc945ee7cf7e5" PRIMARY KEY ("supersection_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_67cae7cbf4c72b86b9b95d107f3" FOREIGN KEY ("sproid") REFERENCES "superprojects"("sproid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "defects" ADD CONSTRAINT "FK_8aac5db638050bef20afa2c46a1" FOREIGN KEY ("section_id") REFERENCES "sections"("section_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "defects" ADD CONSTRAINT "FK_fc4a3e1551ccfbeb8a36a204973" FOREIGN KEY ("sproid") REFERENCES "superprojects"("sproid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_73e054812b029c49ea5895295c8" FOREIGN KEY ("proid") REFERENCES "projects"("proid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" ADD CONSTRAINT "FK_cced2002a642568b2f0afdb745d" FOREIGN KEY ("sproid") REFERENCES "superprojects"("sproid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supersections" ADD CONSTRAINT "FK_034236f83ed6a4e5985fc138541" FOREIGN KEY ("sproid") REFERENCES "superprojects"("sproid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supersections" DROP CONSTRAINT "FK_034236f83ed6a4e5985fc138541"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_cced2002a642568b2f0afdb745d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sections" DROP CONSTRAINT "FK_73e054812b029c49ea5895295c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "defects" DROP CONSTRAINT "FK_fc4a3e1551ccfbeb8a36a204973"`,
    );
    await queryRunner.query(
      `ALTER TABLE "defects" DROP CONSTRAINT "FK_8aac5db638050bef20afa2c46a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" DROP CONSTRAINT "FK_67cae7cbf4c72b86b9b95d107f3"`,
    );
    await queryRunner.query(`DROP TABLE "supersections"`);
    await queryRunner.query(`DROP TABLE "superprojects"`);
    await queryRunner.query(`DROP TABLE "sections"`);
    await queryRunner.query(`DROP TABLE "defects"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "sync_request"`);
    await queryRunner.query(`DROP TABLE "zoom_configuration"`);
  }
}
