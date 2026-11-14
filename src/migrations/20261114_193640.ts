import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_category" AS ENUM('LIVE ENTERTAINMENT', 'ROOFTOP EXPERIENCE', 'FAMILY & LIFESTYLE', 'GARDEN & LOUNGE', 'PRIVATE DINING', 'SPECIAL EVENT', 'OTHER');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_category" AS ENUM('LIVE ENTERTAINMENT', 'ROOFTOP EXPERIENCE', 'FAMILY & LIFESTYLE', 'GARDEN & LOUNGE', 'PRIVATE DINING', 'SPECIAL EVENT', 'OTHER');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_experiences_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experiences_page_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'events';
  ALTER TYPE "public"."enum_roles_global_permissions_global" ADD VALUE 'experiences-page' BEFORE 'site-settings';
  CREATE TABLE "events_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"title" varchar,
  	"category" "enum_events_category",
  	"description" varchar,
  	"details" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar DEFAULT 'Cherry Blossom Garden',
  	"address" varchar,
  	"image_id" integer,
  	"image_path" varchar DEFAULT '/assets/first-floor.png',
  	"image_alt" varchar,
  	"booking_label" varchar DEFAULT 'Reserve Your Place',
  	"booking_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_category" "enum__events_v_version_category",
  	"version_description" varchar,
  	"version_details" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_location" varchar DEFAULT 'Cherry Blossom Garden',
  	"version_address" varchar,
  	"version_image_id" integer,
  	"version_image_path" varchar DEFAULT '/assets/first-floor.png',
  	"version_image_alt" varchar,
  	"version_booking_label" varchar DEFAULT 'Reserve Your Place',
  	"version_booking_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "experiences_page_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"category" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_path" varchar,
  	"alt" varchar,
  	"link_label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "experiences_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'THE CHERRY BLOSSOM EXPERIENCE',
  	"hero_title" varchar DEFAULT 'More Than',
  	"hero_accent" varchar DEFAULT 'Dining.',
  	"hero_description" varchar DEFAULT 'A place to gather, celebrate and discover. From evenings filled with music to moments beneath the open sky, every experience has its own story.',
  	"upcoming_eyebrow" varchar DEFAULT 'THE GARDEN CALENDAR',
  	"upcoming_title" varchar DEFAULT 'Upcoming',
  	"upcoming_accent" varchar DEFAULT 'Events.',
  	"upcoming_description" varchar DEFAULT 'Every gathering has a story. Discover the experiences, evenings and special occasions waiting to bloom at Cherry Blossom Garden.',
  	"upcoming_empty_title" varchar DEFAULT 'Something beautiful is coming.',
  	"upcoming_empty_description" varchar DEFAULT 'Our next experiences are being prepared. Stay close for upcoming announcements.',
  	"upcoming_footer_text" varchar DEFAULT 'Beautiful moments are better when shared.',
  	"upcoming_footer_label" varchar DEFAULT 'EXPLORE OUR EXPERIENCES',
  	"upcoming_footer_href" varchar DEFAULT '/#experiences',
  	"_status" "enum_experiences_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_experiences_page_v_version_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"label" varchar,
  	"category" varchar,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_path" varchar,
  	"alt" varchar,
  	"link_label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_experiences_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'THE CHERRY BLOSSOM EXPERIENCE',
  	"version_hero_title" varchar DEFAULT 'More Than',
  	"version_hero_accent" varchar DEFAULT 'Dining.',
  	"version_hero_description" varchar DEFAULT 'A place to gather, celebrate and discover. From evenings filled with music to moments beneath the open sky, every experience has its own story.',
  	"version_upcoming_eyebrow" varchar DEFAULT 'THE GARDEN CALENDAR',
  	"version_upcoming_title" varchar DEFAULT 'Upcoming',
  	"version_upcoming_accent" varchar DEFAULT 'Events.',
  	"version_upcoming_description" varchar DEFAULT 'Every gathering has a story. Discover the experiences, evenings and special occasions waiting to bloom at Cherry Blossom Garden.',
  	"version_upcoming_empty_title" varchar DEFAULT 'Something beautiful is coming.',
  	"version_upcoming_empty_description" varchar DEFAULT 'Our next experiences are being prepared. Stay close for upcoming announcements.',
  	"version_upcoming_footer_text" varchar DEFAULT 'Beautiful moments are better when shared.',
  	"version_upcoming_footer_label" varchar DEFAULT 'EXPLORE OUR EXPERIENCES',
  	"version_upcoming_footer_href" varchar DEFAULT '/#experiences',
  	"version__status" "enum__experiences_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "events_id" integer;
  ALTER TABLE "events_highlights" ADD CONSTRAINT "events_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_version_highlights" ADD CONSTRAINT "_events_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_page_slides" ADD CONSTRAINT "experiences_page_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_page_slides" ADD CONSTRAINT "experiences_page_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_page_v_version_slides" ADD CONSTRAINT "_experiences_page_v_version_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_page_v_version_slides" ADD CONSTRAINT "_experiences_page_v_version_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experiences_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_highlights_order_idx" ON "events_highlights" USING btree ("_order");
  CREATE INDEX "events_highlights_parent_id_idx" ON "events_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_starts_at_idx" ON "events" USING btree ("starts_at");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "_events_v_version_highlights_order_idx" ON "_events_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_events_v_version_highlights_parent_id_idx" ON "_events_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_starts_at_idx" ON "_events_v" USING btree ("version_starts_at");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "experiences_page_slides_order_idx" ON "experiences_page_slides" USING btree ("_order");
  CREATE INDEX "experiences_page_slides_parent_id_idx" ON "experiences_page_slides" USING btree ("_parent_id");
  CREATE INDEX "experiences_page_slides_image_idx" ON "experiences_page_slides" USING btree ("image_id");
  CREATE INDEX "experiences_page__status_idx" ON "experiences_page" USING btree ("_status");
  CREATE INDEX "_experiences_page_v_version_slides_order_idx" ON "_experiences_page_v_version_slides" USING btree ("_order");
  CREATE INDEX "_experiences_page_v_version_slides_parent_id_idx" ON "_experiences_page_v_version_slides" USING btree ("_parent_id");
  CREATE INDEX "_experiences_page_v_version_slides_image_idx" ON "_experiences_page_v_version_slides" USING btree ("image_id");
  CREATE INDEX "_experiences_page_v_version_version__status_idx" ON "_experiences_page_v" USING btree ("version__status");
  CREATE INDEX "_experiences_page_v_created_at_idx" ON "_experiences_page_v" USING btree ("created_at");
  CREATE INDEX "_experiences_page_v_updated_at_idx" ON "_experiences_page_v" USING btree ("updated_at");
  CREATE INDEX "_experiences_page_v_latest_idx" ON "_experiences_page_v" USING btree ("latest");
  CREATE INDEX "_experiences_page_v_autosave_idx" ON "_experiences_page_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v_version_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_events_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "experiences_page_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "experiences_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_experiences_page_v_version_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_experiences_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "events_highlights" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v_version_highlights" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "experiences_page_slides" CASCADE;
  DROP TABLE "experiences_page" CASCADE;
  DROP TABLE "_experiences_page_v_version_slides" CASCADE;
  DROP TABLE "_experiences_page_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_events_fk";
  
  ALTER TABLE "roles_collection_permissions" ALTER COLUMN "collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_roles_collection_permissions_collection";
  CREATE TYPE "public"."enum_roles_collection_permissions_collection" AS ENUM('pages', 'explore-pages', 'media', 'menu-categories', 'dietary-tags', 'menu-items', 'special-menus');
  ALTER TABLE "roles_collection_permissions" ALTER COLUMN "collection" SET DATA TYPE "public"."enum_roles_collection_permissions_collection" USING "collection"::"public"."enum_roles_collection_permissions_collection";
  ALTER TABLE "roles_global_permissions" ALTER COLUMN "global" SET DATA TYPE text;
  DROP TYPE "public"."enum_roles_global_permissions_global";
  CREATE TYPE "public"."enum_roles_global_permissions_global" AS ENUM('homepage', 'site-settings', 'navigation', 'seo-settings', 'menu-settings');
  ALTER TABLE "roles_global_permissions" ALTER COLUMN "global" SET DATA TYPE "public"."enum_roles_global_permissions_global" USING "global"::"public"."enum_roles_global_permissions_global";
  DROP INDEX "payload_locked_documents_rels_events_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "events_id";
  DROP TYPE "public"."enum_events_category";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_category";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_experiences_page_status";
  DROP TYPE "public"."enum__experiences_page_v_version_status";`)
}
