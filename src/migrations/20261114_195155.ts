import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_startsat_tz" AS ENUM('Asia/Kathmandu');
  CREATE TYPE "public"."enum_events_endsat_tz" AS ENUM('Asia/Kathmandu');
  CREATE TYPE "public"."enum__events_v_version_startsat_tz" AS ENUM('Asia/Kathmandu');
  CREATE TYPE "public"."enum__events_v_version_endsat_tz" AS ENUM('Asia/Kathmandu');
  ALTER TABLE "events" ADD COLUMN "startsat_tz" "enum_events_startsat_tz" DEFAULT 'Asia/Kathmandu';
  ALTER TABLE "events" ADD COLUMN "endsat_tz" "enum_events_endsat_tz" DEFAULT 'Asia/Kathmandu';
  ALTER TABLE "_events_v" ADD COLUMN "version_startsat_tz" "enum__events_v_version_startsat_tz" DEFAULT 'Asia/Kathmandu';
  ALTER TABLE "_events_v" ADD COLUMN "version_endsat_tz" "enum__events_v_version_endsat_tz" DEFAULT 'Asia/Kathmandu';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "events" DROP COLUMN "startsat_tz";
  ALTER TABLE "events" DROP COLUMN "endsat_tz";
  ALTER TABLE "_events_v" DROP COLUMN "version_startsat_tz";
  ALTER TABLE "_events_v" DROP COLUMN "version_endsat_tz";
  DROP TYPE "public"."enum_events_startsat_tz";
  DROP TYPE "public"."enum_events_endsat_tz";
  DROP TYPE "public"."enum__events_v_version_startsat_tz";
  DROP TYPE "public"."enum__events_v_version_endsat_tz";`)
}
