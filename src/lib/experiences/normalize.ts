
import {
  DEFAULT_EXPERIENCES_PAGE as D,
  type ExperienceContent,
  type ExperienceSlide,
} from "./defaults";

import { withDefaults } from "@/lib/homepage/defaults";

export function normalizeExperienceContent(
  value: unknown,
): ExperienceContent {
  const input =
    value && typeof value === "object"
      ? (value as Partial<ExperienceContent>)
      : {};

  // Explicitly type the slides so Payload CMS
  // properties such as id and image are recognised.
  const rawSlides: ExperienceSlide[] =
    Array.isArray(input.slides)
      ? input.slides
      : D.slides;

  return {
    hero: withDefaults(D.hero, input.hero),
    upcoming: withDefaults(D.upcoming, input.upcoming),

    slides: rawSlides.map((slide, index) => {
      const fallback =
        D.slides[
          Math.min(index, D.slides.length - 1)
          ];

      return {
        ...withDefaults(fallback, slide),

        // Preserve Payload-generated row IDs.
        id: slide.id,

        // Preserve populated media relationships.
        image: slide.image,
      };
    }),
  };
}
