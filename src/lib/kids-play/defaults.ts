
import { withDefaults } from "@/lib/homepage/defaults";

export const DEFAULT_KIDS_PLAY = {
  seo: {
    title: "Kids Play Area | Cherry Blossom Garden",
    description:
      "Discover a beautiful family-friendly kids play area at Cherry Blossom Garden. A welcoming space for little adventures, family dining and children's celebrations.",
  },

  hero: {
    eyebrow: "A little world of wonder",
    title1: "Kids",
    titleAccent: "Play Area.",
    paragraph1:
      "A joyful little world where imagination blossoms, adventures begin, and beautiful memories are made.",
    paragraph2:
      "Let the little ones explore while you relax, dine, and enjoy every moment at Cherry Blossom Garden.",
    buttonLabel: "Reserve for Kids Party",
    buttonHref: "#kids-party",
    scrollLabel: "Explore the space",
    scrollHref: "#discover",
    photoLabel: "Little adventures",
    photoCaption: "Beautiful memories.",
    image: "/assets/kids-play-area.png",
  },

  benefits: [
    {
      title: "Thoughtful Design",
      description:
        "A comfortable, welcoming environment designed with little explorers in mind.",
    },
    {
      title: "Creative Play",
      description:
        "An imaginative space for discovery, play and wonderful little adventures.",
    },
    {
      title: "Family Moments",
      description:
        "A place for families to spend meaningful time together.",
    },
    {
      title: "Relax & Enjoy",
      description:
        "Enjoy food and drinks while the little ones have fun.",
    },
  ],

  discover: {
    eyebrow: "Play · Discover · Grow",
    heading1: "A World of",
    headingAccent: "Imagination.",
    paragraph1:
      "Childhood is made of tiny discoveries, endless curiosity and moments of pure joy. Our play area brings those special moments together in a beautiful, welcoming environment.",
    paragraph2:
      "From playful adventures to moments of imagination, little guests have a space of their own while the grown-ups enjoy the Cherry Blossom Garden experience.",
    sticker: "For little explorers",
    image: "/assets/kids-play-area.png",

    features: [
      {
        title: "Play Structures",
        description: "Little adventures",
      },
      {
        title: "Creative Corners",
        description: "Big imaginations",
      },
      {
        title: "Family Time",
        description: "Lovely memories",
      },
    ],
  },

  divider: {
    text: "Little moments, lifelong memories.",
  },

  party: {
    eyebrow: "Celebrate their special day",
    heading1: "Kids Parties",
    heading2: "at",
    accent1: "Cherry",
    accent2: "Blossom.",
    paragraph1:
      "Some celebrations deserve a little extra magic. Make their special day unforgettable with a joyful setting for birthdays, family gatherings and precious milestones.",
    paragraph2:
      "Beautiful surroundings, delightful food, playful moments and the people who matter most — everything for a celebration worth remembering.",
    feature1: "Birthday celebrations",
    feature2: "Family gatherings",
    buttonLabel: "Plan a Kids Party",
    buttonHref: "/reservation?occasion=kids-party",
    image: "/assets/private-celebration.png",
  },

  family: {
    eyebrow: "Good food. Happy kids. Beautiful moments.",
    heading1: "Dine.",
    accent: "Play.",
    heading2: "Enjoy.",
    paragraph:
      "Great food, a beautiful atmosphere and a dedicated place for little adventures. Create your next family memory at Cherry Blossom Garden.",
    buttonLabel: "Reserve for Kids Party",
    buttonHref: "/reservation?occasion=kids-party",
    image: "/assets/garden-ambience.png",
  },
};

export type KidsPlayContent = typeof DEFAULT_KIDS_PLAY;

export function normalizeKidsPlay(
  value: unknown,
): KidsPlayContent {
  return withDefaults(DEFAULT_KIDS_PLAY, value);
}

/**
 * Prefer the Media collection's alt text.
 * Otherwise retain the existing frontend alt text.
 */
export function imageAlt(
  value: unknown,
  fallback: string,
): string {
  if (value && typeof value === "object" && "alt" in value) {
    const alt = (value as { alt?: unknown }).alt;

    if (typeof alt === "string" && alt.trim()) {
      return alt;
    }
  }

  return fallback;
}
