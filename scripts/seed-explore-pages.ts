
import { config as loadEnv } from "dotenv";

// -----------------------------------------
// 1. Load environment variables first
// -----------------------------------------

// .env.local takes priority over .env
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

// -----------------------------------------
// 2. Import default Explore content
// -----------------------------------------

import {
  EXPLORE_DEFAULTS,
  FLOOR_KEYS,
} from "../src/lib/explore/defaults";

// -----------------------------------------
// 3. Seed Explore Pages
// -----------------------------------------

async function main() {
  // Import Payload configuration AFTER
  // environment variables have been loaded.
  const { default: config } = await import(
    "../src/payload.config"
    );

  const { getPayload } = await import("payload");

  // Verify required environment variables.
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error(
      "PAYLOAD_SECRET is missing. Check your .env.local or .env file.",
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is missing. Check your .env.local or .env file.",
    );
  }

  console.log("Starting Explore Pages seed...");

  // Initialise Payload CMS.
  const payload = await getPayload({ config });

  console.log("Payload CMS connected successfully.");

  // -----------------------------------------
  // 4. Loop through all three floors
  // -----------------------------------------

  for (const floor of FLOOR_KEYS) {
    console.log(`Checking: ${floor}`);

    // Check whether this floor already exists.
    const existing = await payload.find({
      collection: "explore-pages",

      where: {
        floor: {
          equals: floor,
        },
      },

      draft: true,
      overrideAccess: true,
      limit: 1,
    });

    // Never overwrite existing CMS content.
    if (existing.docs.length > 0) {
      console.log(`Skipped existing: ${floor}`);
      continue;
    }

    // -----------------------------------------
    // 5. Get default page content
    // -----------------------------------------

    const {
      slides,
      ...pageDefaults
    } = EXPLORE_DEFAULTS[floor];

    // Remove internal fields from default slides.
    const preparedSlides = slides.map(
      ({ image: _image, id: _id, ...slide }) => ({
        ...slide,
      }),
    );

    // -----------------------------------------
    // 6. Create and publish page
    // -----------------------------------------

    await payload.create({
      collection: "explore-pages",

      data: {
        ...pageDefaults,

        slides: preparedSlides,

        _status: "published",
      },

      draft: false,
      overrideAccess: true,
    });

    console.log(`Created: ${floor}`);
  }

  // -----------------------------------------
  // 7. Finish
  // -----------------------------------------

  console.log("");
  console.log("Explore Pages seed completed.");
  console.log("");
  console.log("Pages:");
  console.log("1. /explore/ground-floor");
  console.log("2. /explore/dining-entertainment");
  console.log("3. /explore/rooftop-bbq-events");
  console.log("");
  console.log(
    "Manage pages at: /admin/collections/explore-pages",
  );
}

// -----------------------------------------
// 8. Execute script
// -----------------------------------------

main()
  .then(() => {
    console.log("Seed script finished successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("");
    console.error("Explore Pages seed failed:");
    console.error(error);
    process.exit(1);
  });
