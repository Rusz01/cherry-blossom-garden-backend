import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_explore_pages_slides_tone" AS ENUM('midnight', 'charcoal', 'walnut', 'cream');
  CREATE TYPE "public"."enum_explore_pages_floor" AS ENUM('ground-floor', 'first-floor', 'rooftop');
  CREATE TYPE "public"."enum_explore_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__explore_pages_v_version_slides_tone" AS ENUM('midnight', 'charcoal', 'walnut', 'cream');
  CREATE TYPE "public"."enum__explore_pages_v_version_floor" AS ENUM('ground-floor', 'first-floor', 'rooftop');
  CREATE TYPE "public"."enum__explore_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_menu_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__menu_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_special_menus_items_source" AS ENUM('existing', 'custom');
  CREATE TYPE "public"."enum_special_menus_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__special_menus_v_version_items_source" AS ENUM('existing', 'custom');
  CREATE TYPE "public"."enum__special_menus_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_menu_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__menu_settings_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'explore-pages' BEFORE 'media';
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'menu-categories';
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'dietary-tags';
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'menu-items';
  ALTER TYPE "public"."enum_roles_collection_permissions_collection" ADD VALUE 'special-menus';
  ALTER TYPE "public"."enum_roles_global_permissions_global" ADD VALUE 'homepage' BEFORE 'site-settings';
  ALTER TYPE "public"."enum_roles_global_permissions_global" ADD VALUE 'menu-settings';
  CREATE TABLE "explore_pages_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title_top" varchar,
  	"title_bottom" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_path" varchar,
  	"image_position" varchar DEFAULT '50% 50%',
  	"tone" "enum_explore_pages_slides_tone" DEFAULT 'midnight',
  	"cta" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "explore_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"floor" "enum_explore_pages_floor",
  	"slug" varchar,
  	"title" varchar,
  	"description" varchar,
  	"menu_label" varchar,
  	"menu_description" varchar,
  	"home_eyebrow" varchar,
  	"home_title" varchar,
  	"home_short_title" varchar,
  	"home_description" varchar,
  	"serial_label" varchar,
  	"image_signature" varchar,
  	"image_label" varchar,
  	"side_label" varchar,
  	"side_year" varchar,
  	"next_label" varchar,
  	"drag_hint" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_explore_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_explore_pages_v_version_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" varchar,
  	"eyebrow" varchar,
  	"title_top" varchar,
  	"title_bottom" varchar,
  	"subtitle" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"image_path" varchar,
  	"image_position" varchar DEFAULT '50% 50%',
  	"tone" "enum__explore_pages_v_version_slides_tone" DEFAULT 'midnight',
  	"cta" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_explore_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_floor" "enum__explore_pages_v_version_floor",
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_menu_label" varchar,
  	"version_menu_description" varchar,
  	"version_home_eyebrow" varchar,
  	"version_home_title" varchar,
  	"version_home_short_title" varchar,
  	"version_home_description" varchar,
  	"version_serial_label" varchar,
  	"version_image_signature" varchar,
  	"version_image_label" varchar,
  	"version_side_label" varchar,
  	"version_side_year" varchar,
  	"version_next_label" varchar,
  	"version_drag_hint" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__explore_pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "menu_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "dietary_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_items_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"description" varchar,
  	"price" numeric,
  	"category_id" integer,
  	"image_id" integer,
  	"is_available" boolean DEFAULT true,
  	"signature" boolean DEFAULT false,
  	"popularity" numeric DEFAULT 50,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_menu_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "menu_items_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_tags_id" integer
  );
  
  CREATE TABLE "_menu_items_v_version_ingredients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_menu_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_price" numeric,
  	"version_category_id" integer,
  	"version_image_id" integer,
  	"version_is_available" boolean DEFAULT true,
  	"version_signature" boolean DEFAULT false,
  	"version_popularity" numeric DEFAULT 50,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__menu_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_menu_items_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_tags_id" integer
  );
  
  CREATE TABLE "special_menus_show_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" timestamp(3) with time zone
  );
  
  CREATE TABLE "special_menus_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_special_menus_items_source" DEFAULT 'existing',
  	"menu_item_id" integer,
  	"custom_name" varchar,
  	"custom_description" varchar,
  	"custom_price" numeric,
  	"override_name" varchar,
  	"override_description" varchar,
  	"override_price" numeric,
  	"chefs_choice" boolean DEFAULT false,
  	"is_new" boolean DEFAULT false
  );
  
  CREATE TABLE "special_menus" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_special_menus_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "special_menus_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_tags_id" integer
  );
  
  CREATE TABLE "_special_menus_v_version_show_dates" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" timestamp(3) with time zone,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_special_menus_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum__special_menus_v_version_items_source" DEFAULT 'existing',
  	"menu_item_id" integer,
  	"custom_name" varchar,
  	"custom_description" varchar,
  	"custom_price" numeric,
  	"override_name" varchar,
  	"override_description" varchar,
  	"override_price" numeric,
  	"chefs_choice" boolean DEFAULT false,
  	"is_new" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_special_menus_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_enabled" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__special_menus_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_special_menus_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"dietary_tags_id" integer
  );
  
  CREATE TABLE "homepage_levels_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"short_title" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_experiences_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_taste_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"price" varchar,
  	"description" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage_kids_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line1" varchar,
  	"line2" varchar
  );
  
  CREATE TABLE "homepage_gallery_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'A Garden Of Flavor',
  	"hero_desktop_title" varchar DEFAULT 'Where Beautiful Moments',
  	"hero_mobile_title1" varchar DEFAULT 'Where Beautiful',
  	"hero_mobile_title2" varchar DEFAULT 'Moments',
  	"hero_accent" varchar DEFAULT 'Bloom',
  	"hero_description" varchar DEFAULT 'A garden-led dining experience where thoughtful hospitality, seasonal flavour and beautiful celebrations come together.',
  	"hero_image_id" integer,
  	"hero_primary_label" varchar DEFAULT 'Reserve a Table',
  	"hero_primary_href" varchar DEFAULT '/reservation',
  	"hero_secondary_label" varchar DEFAULT 'Explore Our Spaces',
  	"hero_secondary_href" varchar DEFAULT '/#three-levels',
  	"story_eyebrow" varchar DEFAULT 'Our Story',
  	"story_title1" varchar DEFAULT 'A Garden Rooted in',
  	"story_title2" varchar DEFAULT 'Elegance and Connection',
  	"story_paragraph1" varchar DEFAULT 'Cherry Blossom Garden celebrates generous hospitality, beautifully presented food and memorable moments. Every detail is designed to make gatherings feel special.',
  	"story_paragraph2" varchar DEFAULT 'More than a meal, it is a welcoming escape where every corner gives guests something new to discover.',
  	"story_image_id" integer,
  	"story_button_label" varchar DEFAULT 'Discover Our Story',
  	"story_button_href" varchar DEFAULT '/about',
  	"levels_eyebrow" varchar DEFAULT 'Explore The Space',
  	"levels_title" varchar DEFAULT 'Three Levels, Three Experiences',
  	"levels_description" varchar DEFAULT 'From relaxed coffee moments to elevated dining and family-friendly fun, each level at Cherry Blossom Garden offers its own unique atmosphere to enjoy.',
  	"experiences_eyebrow" varchar DEFAULT 'The Cherry Blossom Experience',
  	"experiences_title1" varchar DEFAULT 'Ways We Elevate',
  	"experiences_title2" varchar DEFAULT 'Your Evening',
  	"taste_eyebrow" varchar DEFAULT 'Signature Cuisine',
  	"taste_title1" varchar DEFAULT 'A Taste of',
  	"taste_title2" varchar DEFAULT 'the Garden',
  	"taste_description" varchar DEFAULT 'More than a meal, it''s a culinary journey inspired by the beauty of the season. Fresh ingredients, bold flavours and a dining experience like no other.',
  	"taste_image_id" integer,
  	"taste_button_label" varchar DEFAULT 'Explore Our Menu',
  	"taste_button_href" varchar DEFAULT '/menu',
  	"taste_lower_eyebrow" varchar DEFAULT 'Fresh Ingredients',
  	"taste_lower_title1" varchar DEFAULT 'Flavours for',
  	"taste_lower_title2" varchar DEFAULT 'Every Season',
  	"taste_lower_description" varchar DEFAULT 'Our dishes bring together locally sourced ingredients, traditional techniques and contemporary twists — creating unforgettable tastes in a truly unique setting.',
  	"taste_lower_image_id" integer,
  	"kids_eyebrow" varchar DEFAULT 'Kids Play Area',
  	"kids_title1" varchar DEFAULT 'Where Little',
  	"kids_title2" varchar DEFAULT 'Adventures',
  	"kids_title_accent" varchar DEFAULT 'Come to Life',
  	"kids_description" varchar DEFAULT 'A thoughtfully designed play area where imagination, play and discovery come together. Surrounded by warm natural tones and playful details, it''s a safe and welcoming space for little guests to enjoy, while you relax and make memories.',
  	"kids_main_image_id" integer,
  	"kids_top_image_id" integer,
  	"kids_bottom_image_id" integer,
  	"kids_button_label" varchar DEFAULT 'Discover Our Kids Play Area',
  	"kids_button_href" varchar DEFAULT '/kids-play',
  	"gallery_eyebrow" varchar DEFAULT 'Gallery',
  	"gallery_title" varchar DEFAULT 'Moments in Blossom',
  	"gallery_button_label" varchar DEFAULT 'View Gallery',
  	"journal_eyebrow" varchar DEFAULT 'The Garden Journal',
  	"journal_title1" varchar DEFAULT 'A Little More',
  	"journal_title_accent" varchar DEFAULT 'Blossom',
  	"journal_title2" varchar DEFAULT 'in Your Inbox.',
  	"journal_description" varchar DEFAULT 'Discover seasonal flavours, exclusive experiences, upcoming events and beautiful moments from Cherry Blossom Garden.',
  	"journal_prompt" varchar DEFAULT 'Be part of something beautiful.',
  	"journal_placeholder" varchar DEFAULT 'Your email address',
  	"journal_button_label" varchar DEFAULT 'Subscribe',
  	"journal_privacy" varchar DEFAULT 'Only lovely things, straight to your inbox. No spam, ever. Unsubscribe anytime.',
  	"journal_footer" varchar DEFAULT 'Curated with Love, Shared with You',
  	"journal_image_id" integer,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_items_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_levels_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"short_title" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_experiences_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"eyebrow" varchar,
  	"title" varchar,
  	"description" varchar,
  	"href" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_taste_dishes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"price" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_kids_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line1" varchar,
  	"line2" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v_version_gallery_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"alt" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar DEFAULT 'A Garden Of Flavor',
  	"version_hero_desktop_title" varchar DEFAULT 'Where Beautiful Moments',
  	"version_hero_mobile_title1" varchar DEFAULT 'Where Beautiful',
  	"version_hero_mobile_title2" varchar DEFAULT 'Moments',
  	"version_hero_accent" varchar DEFAULT 'Bloom',
  	"version_hero_description" varchar DEFAULT 'A garden-led dining experience where thoughtful hospitality, seasonal flavour and beautiful celebrations come together.',
  	"version_hero_image_id" integer,
  	"version_hero_primary_label" varchar DEFAULT 'Reserve a Table',
  	"version_hero_primary_href" varchar DEFAULT '/reservation',
  	"version_hero_secondary_label" varchar DEFAULT 'Explore Our Spaces',
  	"version_hero_secondary_href" varchar DEFAULT '/#three-levels',
  	"version_story_eyebrow" varchar DEFAULT 'Our Story',
  	"version_story_title1" varchar DEFAULT 'A Garden Rooted in',
  	"version_story_title2" varchar DEFAULT 'Elegance and Connection',
  	"version_story_paragraph1" varchar DEFAULT 'Cherry Blossom Garden celebrates generous hospitality, beautifully presented food and memorable moments. Every detail is designed to make gatherings feel special.',
  	"version_story_paragraph2" varchar DEFAULT 'More than a meal, it is a welcoming escape where every corner gives guests something new to discover.',
  	"version_story_image_id" integer,
  	"version_story_button_label" varchar DEFAULT 'Discover Our Story',
  	"version_story_button_href" varchar DEFAULT '/about',
  	"version_levels_eyebrow" varchar DEFAULT 'Explore The Space',
  	"version_levels_title" varchar DEFAULT 'Three Levels, Three Experiences',
  	"version_levels_description" varchar DEFAULT 'From relaxed coffee moments to elevated dining and family-friendly fun, each level at Cherry Blossom Garden offers its own unique atmosphere to enjoy.',
  	"version_experiences_eyebrow" varchar DEFAULT 'The Cherry Blossom Experience',
  	"version_experiences_title1" varchar DEFAULT 'Ways We Elevate',
  	"version_experiences_title2" varchar DEFAULT 'Your Evening',
  	"version_taste_eyebrow" varchar DEFAULT 'Signature Cuisine',
  	"version_taste_title1" varchar DEFAULT 'A Taste of',
  	"version_taste_title2" varchar DEFAULT 'the Garden',
  	"version_taste_description" varchar DEFAULT 'More than a meal, it''s a culinary journey inspired by the beauty of the season. Fresh ingredients, bold flavours and a dining experience like no other.',
  	"version_taste_image_id" integer,
  	"version_taste_button_label" varchar DEFAULT 'Explore Our Menu',
  	"version_taste_button_href" varchar DEFAULT '/menu',
  	"version_taste_lower_eyebrow" varchar DEFAULT 'Fresh Ingredients',
  	"version_taste_lower_title1" varchar DEFAULT 'Flavours for',
  	"version_taste_lower_title2" varchar DEFAULT 'Every Season',
  	"version_taste_lower_description" varchar DEFAULT 'Our dishes bring together locally sourced ingredients, traditional techniques and contemporary twists — creating unforgettable tastes in a truly unique setting.',
  	"version_taste_lower_image_id" integer,
  	"version_kids_eyebrow" varchar DEFAULT 'Kids Play Area',
  	"version_kids_title1" varchar DEFAULT 'Where Little',
  	"version_kids_title2" varchar DEFAULT 'Adventures',
  	"version_kids_title_accent" varchar DEFAULT 'Come to Life',
  	"version_kids_description" varchar DEFAULT 'A thoughtfully designed play area where imagination, play and discovery come together. Surrounded by warm natural tones and playful details, it''s a safe and welcoming space for little guests to enjoy, while you relax and make memories.',
  	"version_kids_main_image_id" integer,
  	"version_kids_top_image_id" integer,
  	"version_kids_bottom_image_id" integer,
  	"version_kids_button_label" varchar DEFAULT 'Discover Our Kids Play Area',
  	"version_kids_button_href" varchar DEFAULT '/kids-play',
  	"version_gallery_eyebrow" varchar DEFAULT 'Gallery',
  	"version_gallery_title" varchar DEFAULT 'Moments in Blossom',
  	"version_gallery_button_label" varchar DEFAULT 'View Gallery',
  	"version_journal_eyebrow" varchar DEFAULT 'The Garden Journal',
  	"version_journal_title1" varchar DEFAULT 'A Little More',
  	"version_journal_title_accent" varchar DEFAULT 'Blossom',
  	"version_journal_title2" varchar DEFAULT 'in Your Inbox.',
  	"version_journal_description" varchar DEFAULT 'Discover seasonal flavours, exclusive experiences, upcoming events and beautiful moments from Cherry Blossom Garden.',
  	"version_journal_prompt" varchar DEFAULT 'Be part of something beautiful.',
  	"version_journal_placeholder" varchar DEFAULT 'Your email address',
  	"version_journal_button_label" varchar DEFAULT 'Subscribe',
  	"version_journal_privacy" varchar DEFAULT 'Only lovely things, straight to your inbox. No spam, ever. Unsubscribe anytime.',
  	"version_journal_footer" varchar DEFAULT 'Curated with Love, Shared with You',
  	"version_journal_image_id" integer,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_homepage_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"menu_items_id" integer
  );
  
  CREATE TABLE "menu_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Our Menu',
  	"line_one" varchar DEFAULT 'A Taste for',
  	"line_two" varchar DEFAULT 'Every',
  	"accent" varchar DEFAULT 'Moment',
  	"description" varchar DEFAULT 'From handcrafted coffee to delicious dining experiences, our menu brings people together over fresh flavours, quality ingredients and unforgettable moments.',
  	"all_title" varchar DEFAULT 'All Menu',
  	"all_description" varchar DEFAULT 'Discover our complete selection of food and drinks.',
  	"signature_title" varchar DEFAULT 'Signature Flavours',
  	"signature_description" varchar DEFAULT 'Handpicked dishes loved by our guests.',
  	"_status" "enum_menu_settings_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_menu_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_eyebrow" varchar DEFAULT 'Our Menu',
  	"version_line_one" varchar DEFAULT 'A Taste for',
  	"version_line_two" varchar DEFAULT 'Every',
  	"version_accent" varchar DEFAULT 'Moment',
  	"version_description" varchar DEFAULT 'From handcrafted coffee to delicious dining experiences, our menu brings people together over fresh flavours, quality ingredients and unforgettable moments.',
  	"version_all_title" varchar DEFAULT 'All Menu',
  	"version_all_description" varchar DEFAULT 'Discover our complete selection of food and drinks.',
  	"version_signature_title" varchar DEFAULT 'Signature Flavours',
  	"version_signature_description" varchar DEFAULT 'Handpicked dishes loved by our guests.',
  	"version__status" "enum__menu_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "explore_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "dietary_tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "menu_items_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "special_menus_id" integer;
  ALTER TABLE "explore_pages_slides" ADD CONSTRAINT "explore_pages_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "explore_pages_slides" ADD CONSTRAINT "explore_pages_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."explore_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_explore_pages_v_version_slides" ADD CONSTRAINT "_explore_pages_v_version_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_explore_pages_v_version_slides" ADD CONSTRAINT "_explore_pages_v_version_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_explore_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_explore_pages_v" ADD CONSTRAINT "_explore_pages_v_parent_id_explore_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."explore_pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items_ingredients" ADD CONSTRAINT "menu_items_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items_rels" ADD CONSTRAINT "menu_items_rels_dietary_tags_fk" FOREIGN KEY ("dietary_tags_id") REFERENCES "public"."dietary_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_items_v_version_ingredients" ADD CONSTRAINT "_menu_items_v_version_ingredients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_menu_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_parent_id_menu_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_version_category_id_menu_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."menu_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_items_v" ADD CONSTRAINT "_menu_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_menu_items_v_rels" ADD CONSTRAINT "_menu_items_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_menu_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_menu_items_v_rels" ADD CONSTRAINT "_menu_items_v_rels_dietary_tags_fk" FOREIGN KEY ("dietary_tags_id") REFERENCES "public"."dietary_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_menus_show_dates" ADD CONSTRAINT "special_menus_show_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."special_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_menus_items" ADD CONSTRAINT "special_menus_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "special_menus_items" ADD CONSTRAINT "special_menus_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."special_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_menus_rels" ADD CONSTRAINT "special_menus_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."special_menus"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "special_menus_rels" ADD CONSTRAINT "special_menus_rels_dietary_tags_fk" FOREIGN KEY ("dietary_tags_id") REFERENCES "public"."dietary_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_special_menus_v_version_show_dates" ADD CONSTRAINT "_special_menus_v_version_show_dates_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_special_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_special_menus_v_version_items" ADD CONSTRAINT "_special_menus_v_version_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_special_menus_v_version_items" ADD CONSTRAINT "_special_menus_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_special_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_special_menus_v" ADD CONSTRAINT "_special_menus_v_parent_id_special_menus_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."special_menus"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_special_menus_v_rels" ADD CONSTRAINT "_special_menus_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_special_menus_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_special_menus_v_rels" ADD CONSTRAINT "_special_menus_v_rels_dietary_tags_fk" FOREIGN KEY ("dietary_tags_id") REFERENCES "public"."dietary_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_levels_items" ADD CONSTRAINT "homepage_levels_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_levels_items" ADD CONSTRAINT "homepage_levels_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_experiences_items" ADD CONSTRAINT "homepage_experiences_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_experiences_items" ADD CONSTRAINT "homepage_experiences_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_taste_dishes" ADD CONSTRAINT "homepage_taste_dishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_taste_dishes" ADD CONSTRAINT "homepage_taste_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_kids_features" ADD CONSTRAINT "homepage_kids_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_gallery_photos" ADD CONSTRAINT "homepage_gallery_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_gallery_photos" ADD CONSTRAINT "homepage_gallery_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_taste_image_id_media_id_fk" FOREIGN KEY ("taste_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_taste_lower_image_id_media_id_fk" FOREIGN KEY ("taste_lower_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_kids_main_image_id_media_id_fk" FOREIGN KEY ("kids_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_kids_top_image_id_media_id_fk" FOREIGN KEY ("kids_top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_kids_bottom_image_id_media_id_fk" FOREIGN KEY ("kids_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_journal_image_id_media_id_fk" FOREIGN KEY ("journal_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_levels_items" ADD CONSTRAINT "_homepage_v_version_levels_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_levels_items" ADD CONSTRAINT "_homepage_v_version_levels_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_experiences_items" ADD CONSTRAINT "_homepage_v_version_experiences_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_experiences_items" ADD CONSTRAINT "_homepage_v_version_experiences_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_taste_dishes" ADD CONSTRAINT "_homepage_v_version_taste_dishes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_taste_dishes" ADD CONSTRAINT "_homepage_v_version_taste_dishes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_kids_features" ADD CONSTRAINT "_homepage_v_version_kids_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_gallery_photos" ADD CONSTRAINT "_homepage_v_version_gallery_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_gallery_photos" ADD CONSTRAINT "_homepage_v_version_gallery_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_story_image_id_media_id_fk" FOREIGN KEY ("version_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_taste_image_id_media_id_fk" FOREIGN KEY ("version_taste_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_taste_lower_image_id_media_id_fk" FOREIGN KEY ("version_taste_lower_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_kids_main_image_id_media_id_fk" FOREIGN KEY ("version_kids_main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_kids_top_image_id_media_id_fk" FOREIGN KEY ("version_kids_top_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_kids_bottom_image_id_media_id_fk" FOREIGN KEY ("version_kids_bottom_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_journal_image_id_media_id_fk" FOREIGN KEY ("version_journal_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "explore_pages_slides_order_idx" ON "explore_pages_slides" USING btree ("_order");
  CREATE INDEX "explore_pages_slides_parent_id_idx" ON "explore_pages_slides" USING btree ("_parent_id");
  CREATE INDEX "explore_pages_slides_image_idx" ON "explore_pages_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "explore_pages_floor_idx" ON "explore_pages" USING btree ("floor");
  CREATE UNIQUE INDEX "explore_pages_slug_idx" ON "explore_pages" USING btree ("slug");
  CREATE INDEX "explore_pages_updated_at_idx" ON "explore_pages" USING btree ("updated_at");
  CREATE INDEX "explore_pages_created_at_idx" ON "explore_pages" USING btree ("created_at");
  CREATE INDEX "explore_pages__status_idx" ON "explore_pages" USING btree ("_status");
  CREATE INDEX "_explore_pages_v_version_slides_order_idx" ON "_explore_pages_v_version_slides" USING btree ("_order");
  CREATE INDEX "_explore_pages_v_version_slides_parent_id_idx" ON "_explore_pages_v_version_slides" USING btree ("_parent_id");
  CREATE INDEX "_explore_pages_v_version_slides_image_idx" ON "_explore_pages_v_version_slides" USING btree ("image_id");
  CREATE INDEX "_explore_pages_v_parent_idx" ON "_explore_pages_v" USING btree ("parent_id");
  CREATE INDEX "_explore_pages_v_version_version_floor_idx" ON "_explore_pages_v" USING btree ("version_floor");
  CREATE INDEX "_explore_pages_v_version_version_slug_idx" ON "_explore_pages_v" USING btree ("version_slug");
  CREATE INDEX "_explore_pages_v_version_version_updated_at_idx" ON "_explore_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_explore_pages_v_version_version_created_at_idx" ON "_explore_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_explore_pages_v_version_version__status_idx" ON "_explore_pages_v" USING btree ("version__status");
  CREATE INDEX "_explore_pages_v_created_at_idx" ON "_explore_pages_v" USING btree ("created_at");
  CREATE INDEX "_explore_pages_v_updated_at_idx" ON "_explore_pages_v" USING btree ("updated_at");
  CREATE INDEX "_explore_pages_v_latest_idx" ON "_explore_pages_v" USING btree ("latest");
  CREATE INDEX "_explore_pages_v_autosave_idx" ON "_explore_pages_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "menu_categories_slug_idx" ON "menu_categories" USING btree ("slug");
  CREATE INDEX "menu_categories_updated_at_idx" ON "menu_categories" USING btree ("updated_at");
  CREATE INDEX "menu_categories_created_at_idx" ON "menu_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "dietary_tags_slug_idx" ON "dietary_tags" USING btree ("slug");
  CREATE INDEX "dietary_tags_updated_at_idx" ON "dietary_tags" USING btree ("updated_at");
  CREATE INDEX "dietary_tags_created_at_idx" ON "dietary_tags" USING btree ("created_at");
  CREATE INDEX "menu_items_ingredients_order_idx" ON "menu_items_ingredients" USING btree ("_order");
  CREATE INDEX "menu_items_ingredients_parent_id_idx" ON "menu_items_ingredients" USING btree ("_parent_id");
  CREATE INDEX "menu_items_category_idx" ON "menu_items" USING btree ("category_id");
  CREATE INDEX "menu_items_image_idx" ON "menu_items" USING btree ("image_id");
  CREATE INDEX "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
  CREATE INDEX "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
  CREATE INDEX "menu_items__status_idx" ON "menu_items" USING btree ("_status");
  CREATE INDEX "menu_items_rels_order_idx" ON "menu_items_rels" USING btree ("order");
  CREATE INDEX "menu_items_rels_parent_idx" ON "menu_items_rels" USING btree ("parent_id");
  CREATE INDEX "menu_items_rels_path_idx" ON "menu_items_rels" USING btree ("path");
  CREATE INDEX "menu_items_rels_dietary_tags_id_idx" ON "menu_items_rels" USING btree ("dietary_tags_id");
  CREATE INDEX "_menu_items_v_version_ingredients_order_idx" ON "_menu_items_v_version_ingredients" USING btree ("_order");
  CREATE INDEX "_menu_items_v_version_ingredients_parent_id_idx" ON "_menu_items_v_version_ingredients" USING btree ("_parent_id");
  CREATE INDEX "_menu_items_v_parent_idx" ON "_menu_items_v" USING btree ("parent_id");
  CREATE INDEX "_menu_items_v_version_version_category_idx" ON "_menu_items_v" USING btree ("version_category_id");
  CREATE INDEX "_menu_items_v_version_version_image_idx" ON "_menu_items_v" USING btree ("version_image_id");
  CREATE INDEX "_menu_items_v_version_version_updated_at_idx" ON "_menu_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_menu_items_v_version_version_created_at_idx" ON "_menu_items_v" USING btree ("version_created_at");
  CREATE INDEX "_menu_items_v_version_version__status_idx" ON "_menu_items_v" USING btree ("version__status");
  CREATE INDEX "_menu_items_v_created_at_idx" ON "_menu_items_v" USING btree ("created_at");
  CREATE INDEX "_menu_items_v_updated_at_idx" ON "_menu_items_v" USING btree ("updated_at");
  CREATE INDEX "_menu_items_v_latest_idx" ON "_menu_items_v" USING btree ("latest");
  CREATE INDEX "_menu_items_v_autosave_idx" ON "_menu_items_v" USING btree ("autosave");
  CREATE INDEX "_menu_items_v_rels_order_idx" ON "_menu_items_v_rels" USING btree ("order");
  CREATE INDEX "_menu_items_v_rels_parent_idx" ON "_menu_items_v_rels" USING btree ("parent_id");
  CREATE INDEX "_menu_items_v_rels_path_idx" ON "_menu_items_v_rels" USING btree ("path");
  CREATE INDEX "_menu_items_v_rels_dietary_tags_id_idx" ON "_menu_items_v_rels" USING btree ("dietary_tags_id");
  CREATE INDEX "special_menus_show_dates_order_idx" ON "special_menus_show_dates" USING btree ("_order");
  CREATE INDEX "special_menus_show_dates_parent_id_idx" ON "special_menus_show_dates" USING btree ("_parent_id");
  CREATE INDEX "special_menus_items_order_idx" ON "special_menus_items" USING btree ("_order");
  CREATE INDEX "special_menus_items_parent_id_idx" ON "special_menus_items" USING btree ("_parent_id");
  CREATE INDEX "special_menus_items_menu_item_idx" ON "special_menus_items" USING btree ("menu_item_id");
  CREATE INDEX "special_menus_updated_at_idx" ON "special_menus" USING btree ("updated_at");
  CREATE INDEX "special_menus_created_at_idx" ON "special_menus" USING btree ("created_at");
  CREATE INDEX "special_menus__status_idx" ON "special_menus" USING btree ("_status");
  CREATE INDEX "special_menus_rels_order_idx" ON "special_menus_rels" USING btree ("order");
  CREATE INDEX "special_menus_rels_parent_idx" ON "special_menus_rels" USING btree ("parent_id");
  CREATE INDEX "special_menus_rels_path_idx" ON "special_menus_rels" USING btree ("path");
  CREATE INDEX "special_menus_rels_dietary_tags_id_idx" ON "special_menus_rels" USING btree ("dietary_tags_id");
  CREATE INDEX "_special_menus_v_version_show_dates_order_idx" ON "_special_menus_v_version_show_dates" USING btree ("_order");
  CREATE INDEX "_special_menus_v_version_show_dates_parent_id_idx" ON "_special_menus_v_version_show_dates" USING btree ("_parent_id");
  CREATE INDEX "_special_menus_v_version_items_order_idx" ON "_special_menus_v_version_items" USING btree ("_order");
  CREATE INDEX "_special_menus_v_version_items_parent_id_idx" ON "_special_menus_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_special_menus_v_version_items_menu_item_idx" ON "_special_menus_v_version_items" USING btree ("menu_item_id");
  CREATE INDEX "_special_menus_v_parent_idx" ON "_special_menus_v" USING btree ("parent_id");
  CREATE INDEX "_special_menus_v_version_version_updated_at_idx" ON "_special_menus_v" USING btree ("version_updated_at");
  CREATE INDEX "_special_menus_v_version_version_created_at_idx" ON "_special_menus_v" USING btree ("version_created_at");
  CREATE INDEX "_special_menus_v_version_version__status_idx" ON "_special_menus_v" USING btree ("version__status");
  CREATE INDEX "_special_menus_v_created_at_idx" ON "_special_menus_v" USING btree ("created_at");
  CREATE INDEX "_special_menus_v_updated_at_idx" ON "_special_menus_v" USING btree ("updated_at");
  CREATE INDEX "_special_menus_v_latest_idx" ON "_special_menus_v" USING btree ("latest");
  CREATE INDEX "_special_menus_v_autosave_idx" ON "_special_menus_v" USING btree ("autosave");
  CREATE INDEX "_special_menus_v_rels_order_idx" ON "_special_menus_v_rels" USING btree ("order");
  CREATE INDEX "_special_menus_v_rels_parent_idx" ON "_special_menus_v_rels" USING btree ("parent_id");
  CREATE INDEX "_special_menus_v_rels_path_idx" ON "_special_menus_v_rels" USING btree ("path");
  CREATE INDEX "_special_menus_v_rels_dietary_tags_id_idx" ON "_special_menus_v_rels" USING btree ("dietary_tags_id");
  CREATE INDEX "homepage_levels_items_order_idx" ON "homepage_levels_items" USING btree ("_order");
  CREATE INDEX "homepage_levels_items_parent_id_idx" ON "homepage_levels_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_levels_items_image_idx" ON "homepage_levels_items" USING btree ("image_id");
  CREATE INDEX "homepage_experiences_items_order_idx" ON "homepage_experiences_items" USING btree ("_order");
  CREATE INDEX "homepage_experiences_items_parent_id_idx" ON "homepage_experiences_items" USING btree ("_parent_id");
  CREATE INDEX "homepage_experiences_items_image_idx" ON "homepage_experiences_items" USING btree ("image_id");
  CREATE INDEX "homepage_taste_dishes_order_idx" ON "homepage_taste_dishes" USING btree ("_order");
  CREATE INDEX "homepage_taste_dishes_parent_id_idx" ON "homepage_taste_dishes" USING btree ("_parent_id");
  CREATE INDEX "homepage_taste_dishes_image_idx" ON "homepage_taste_dishes" USING btree ("image_id");
  CREATE INDEX "homepage_kids_features_order_idx" ON "homepage_kids_features" USING btree ("_order");
  CREATE INDEX "homepage_kids_features_parent_id_idx" ON "homepage_kids_features" USING btree ("_parent_id");
  CREATE INDEX "homepage_gallery_photos_order_idx" ON "homepage_gallery_photos" USING btree ("_order");
  CREATE INDEX "homepage_gallery_photos_parent_id_idx" ON "homepage_gallery_photos" USING btree ("_parent_id");
  CREATE INDEX "homepage_gallery_photos_image_idx" ON "homepage_gallery_photos" USING btree ("image_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_story_story_image_idx" ON "homepage" USING btree ("story_image_id");
  CREATE INDEX "homepage_taste_taste_image_idx" ON "homepage" USING btree ("taste_image_id");
  CREATE INDEX "homepage_taste_taste_lower_image_idx" ON "homepage" USING btree ("taste_lower_image_id");
  CREATE INDEX "homepage_kids_kids_main_image_idx" ON "homepage" USING btree ("kids_main_image_id");
  CREATE INDEX "homepage_kids_kids_top_image_idx" ON "homepage" USING btree ("kids_top_image_id");
  CREATE INDEX "homepage_kids_kids_bottom_image_idx" ON "homepage" USING btree ("kids_bottom_image_id");
  CREATE INDEX "homepage_journal_journal_image_idx" ON "homepage" USING btree ("journal_image_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_menu_items_id_idx" ON "homepage_rels" USING btree ("menu_items_id");
  CREATE INDEX "_homepage_v_version_levels_items_order_idx" ON "_homepage_v_version_levels_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_levels_items_parent_id_idx" ON "_homepage_v_version_levels_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_levels_items_image_idx" ON "_homepage_v_version_levels_items" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_experiences_items_order_idx" ON "_homepage_v_version_experiences_items" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_experiences_items_parent_id_idx" ON "_homepage_v_version_experiences_items" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_experiences_items_image_idx" ON "_homepage_v_version_experiences_items" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_taste_dishes_order_idx" ON "_homepage_v_version_taste_dishes" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_taste_dishes_parent_id_idx" ON "_homepage_v_version_taste_dishes" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_taste_dishes_image_idx" ON "_homepage_v_version_taste_dishes" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_kids_features_order_idx" ON "_homepage_v_version_kids_features" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_kids_features_parent_id_idx" ON "_homepage_v_version_kids_features" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_gallery_photos_order_idx" ON "_homepage_v_version_gallery_photos" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_gallery_photos_parent_id_idx" ON "_homepage_v_version_gallery_photos" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_gallery_photos_image_idx" ON "_homepage_v_version_gallery_photos" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_story_version_story_image_idx" ON "_homepage_v" USING btree ("version_story_image_id");
  CREATE INDEX "_homepage_v_version_taste_version_taste_image_idx" ON "_homepage_v" USING btree ("version_taste_image_id");
  CREATE INDEX "_homepage_v_version_taste_version_taste_lower_image_idx" ON "_homepage_v" USING btree ("version_taste_lower_image_id");
  CREATE INDEX "_homepage_v_version_kids_version_kids_main_image_idx" ON "_homepage_v" USING btree ("version_kids_main_image_id");
  CREATE INDEX "_homepage_v_version_kids_version_kids_top_image_idx" ON "_homepage_v" USING btree ("version_kids_top_image_id");
  CREATE INDEX "_homepage_v_version_kids_version_kids_bottom_image_idx" ON "_homepage_v" USING btree ("version_kids_bottom_image_id");
  CREATE INDEX "_homepage_v_version_journal_version_journal_image_idx" ON "_homepage_v" USING btree ("version_journal_image_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE INDEX "_homepage_v_autosave_idx" ON "_homepage_v" USING btree ("autosave");
  CREATE INDEX "_homepage_v_rels_order_idx" ON "_homepage_v_rels" USING btree ("order");
  CREATE INDEX "_homepage_v_rels_parent_idx" ON "_homepage_v_rels" USING btree ("parent_id");
  CREATE INDEX "_homepage_v_rels_path_idx" ON "_homepage_v_rels" USING btree ("path");
  CREATE INDEX "_homepage_v_rels_menu_items_id_idx" ON "_homepage_v_rels" USING btree ("menu_items_id");
  CREATE INDEX "menu_settings__status_idx" ON "menu_settings" USING btree ("_status");
  CREATE INDEX "_menu_settings_v_version_version__status_idx" ON "_menu_settings_v" USING btree ("version__status");
  CREATE INDEX "_menu_settings_v_created_at_idx" ON "_menu_settings_v" USING btree ("created_at");
  CREATE INDEX "_menu_settings_v_updated_at_idx" ON "_menu_settings_v" USING btree ("updated_at");
  CREATE INDEX "_menu_settings_v_latest_idx" ON "_menu_settings_v" USING btree ("latest");
  CREATE INDEX "_menu_settings_v_autosave_idx" ON "_menu_settings_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_explore_pages_fk" FOREIGN KEY ("explore_pages_id") REFERENCES "public"."explore_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_categories_fk" FOREIGN KEY ("menu_categories_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_dietary_tags_fk" FOREIGN KEY ("dietary_tags_id") REFERENCES "public"."dietary_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_special_menus_fk" FOREIGN KEY ("special_menus_id") REFERENCES "public"."special_menus"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_explore_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("explore_pages_id");
  CREATE INDEX "payload_locked_documents_rels_menu_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_categories_id");
  CREATE INDEX "payload_locked_documents_rels_dietary_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("dietary_tags_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_special_menus_id_idx" ON "payload_locked_documents_rels" USING btree ("special_menus_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "explore_pages_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "explore_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_explore_pages_v_version_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_explore_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "dietary_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items_ingredients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_items_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_items_v_version_ingredients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_items_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_items_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_menus_show_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_menus_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_menus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "special_menus_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_special_menus_v_version_show_dates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_special_menus_v_version_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_special_menus_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_special_menus_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_levels_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_experiences_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_taste_dishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_kids_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_gallery_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "homepage_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_levels_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_experiences_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_taste_dishes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_kids_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_version_gallery_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_homepage_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "menu_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_menu_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "explore_pages_slides" CASCADE;
  DROP TABLE "explore_pages" CASCADE;
  DROP TABLE "_explore_pages_v_version_slides" CASCADE;
  DROP TABLE "_explore_pages_v" CASCADE;
  DROP TABLE "menu_categories" CASCADE;
  DROP TABLE "dietary_tags" CASCADE;
  DROP TABLE "menu_items_ingredients" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "menu_items_rels" CASCADE;
  DROP TABLE "_menu_items_v_version_ingredients" CASCADE;
  DROP TABLE "_menu_items_v" CASCADE;
  DROP TABLE "_menu_items_v_rels" CASCADE;
  DROP TABLE "special_menus_show_dates" CASCADE;
  DROP TABLE "special_menus_items" CASCADE;
  DROP TABLE "special_menus" CASCADE;
  DROP TABLE "special_menus_rels" CASCADE;
  DROP TABLE "_special_menus_v_version_show_dates" CASCADE;
  DROP TABLE "_special_menus_v_version_items" CASCADE;
  DROP TABLE "_special_menus_v" CASCADE;
  DROP TABLE "_special_menus_v_rels" CASCADE;
  DROP TABLE "homepage_levels_items" CASCADE;
  DROP TABLE "homepage_experiences_items" CASCADE;
  DROP TABLE "homepage_taste_dishes" CASCADE;
  DROP TABLE "homepage_kids_features" CASCADE;
  DROP TABLE "homepage_gallery_photos" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "_homepage_v_version_levels_items" CASCADE;
  DROP TABLE "_homepage_v_version_experiences_items" CASCADE;
  DROP TABLE "_homepage_v_version_taste_dishes" CASCADE;
  DROP TABLE "_homepage_v_version_kids_features" CASCADE;
  DROP TABLE "_homepage_v_version_gallery_photos" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_rels" CASCADE;
  DROP TABLE "menu_settings" CASCADE;
  DROP TABLE "_menu_settings_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_explore_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menu_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_dietary_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_menu_items_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_special_menus_fk";
  
  ALTER TABLE "roles_collection_permissions" ALTER COLUMN "collection" SET DATA TYPE text;
  DROP TYPE "public"."enum_roles_collection_permissions_collection";
  CREATE TYPE "public"."enum_roles_collection_permissions_collection" AS ENUM('pages', 'media');
  ALTER TABLE "roles_collection_permissions" ALTER COLUMN "collection" SET DATA TYPE "public"."enum_roles_collection_permissions_collection" USING "collection"::"public"."enum_roles_collection_permissions_collection";
  ALTER TABLE "roles_global_permissions" ALTER COLUMN "global" SET DATA TYPE text;
  DROP TYPE "public"."enum_roles_global_permissions_global";
  CREATE TYPE "public"."enum_roles_global_permissions_global" AS ENUM('site-settings', 'navigation', 'seo-settings');
  ALTER TABLE "roles_global_permissions" ALTER COLUMN "global" SET DATA TYPE "public"."enum_roles_global_permissions_global" USING "global"::"public"."enum_roles_global_permissions_global";
  DROP INDEX "payload_locked_documents_rels_explore_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_menu_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_dietary_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_menu_items_id_idx";
  DROP INDEX "payload_locked_documents_rels_special_menus_id_idx";
  ALTER TABLE "media" DROP COLUMN "_objectkey";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "explore_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "dietary_tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "menu_items_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "special_menus_id";
  DROP TYPE "public"."enum_explore_pages_slides_tone";
  DROP TYPE "public"."enum_explore_pages_floor";
  DROP TYPE "public"."enum_explore_pages_status";
  DROP TYPE "public"."enum__explore_pages_v_version_slides_tone";
  DROP TYPE "public"."enum__explore_pages_v_version_floor";
  DROP TYPE "public"."enum__explore_pages_v_version_status";
  DROP TYPE "public"."enum_menu_items_status";
  DROP TYPE "public"."enum__menu_items_v_version_status";
  DROP TYPE "public"."enum_special_menus_items_source";
  DROP TYPE "public"."enum_special_menus_status";
  DROP TYPE "public"."enum__special_menus_v_version_items_source";
  DROP TYPE "public"."enum__special_menus_v_version_status";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum_menu_settings_status";
  DROP TYPE "public"."enum__menu_settings_v_version_status";`)
}
