
export const DEFAULT_EXPERIENCES_PAGE = {
  hero: {
    eyebrow: "THE CHERRY BLOSSOM EXPERIENCE",
    title: "More Than",
    accent: "Dining.",
    description:
      "A place to gather, celebrate and discover. From evenings filled with music to moments beneath the open sky, every experience has its own story.",
  },

  slides: [
    {
      key: "live-music",
      category: "LIVE MUSIC & ENTERTAINMENT",
      title: "The Night Comes Alive.",
      description:
        "Let the evening find its rhythm. Live performances, warm lighting and a vibrant atmosphere bring music, dining and beautiful moments together.",
      label: "Live Music",
      imagePath: "/assets/first-floor.png",
      alt: "Cherry Blossom Garden first-floor dining and entertainment space",
      linkLabel: "DISCOVER OUR SPACES",
      href: "/#three-levels",
    },
    {
      key: "rooftop-bbq",
      category: "OPEN AIR EXPERIENCES",
      title: "Sunset BBQ Sessions.",
      description:
        "Golden-hour gatherings, smoky flavours and evenings under the open sky. Discover a rooftop experience designed for great food and even better company.",
      label: "Rooftop BBQ",
      imagePath: "/assets/rooftop.png",
      alt: "Cherry Blossom Garden rooftop dining and BBQ area",
      linkLabel: "DISCOVER OUR SPACES",
      href: "/explore/rooftop-bbq-events",
    },
    {
      key: "private-dining",
      category: "INTIMATE OCCASIONS",
      title: "Moments Made Personal.",
      description:
        "Some occasions deserve a setting of their own. From intimate dinners to meaningful celebrations, enjoy beautifully considered spaces for unforgettable moments.",
      label: "Private Dining",
      imagePath: "/assets/private-celebration.png",
      alt: "Elegant private celebration at Cherry Blossom Garden",
      linkLabel: "DISCOVER OUR SPACES",
      href: "/explore/dining-entertainment",
    },
    {
      key: "garden-lounge",
      category: "GARDEN & LOUNGE",
      title: "Stay a Little Longer.",
      description:
        "A softer pace after dark. Settle into a garden-inspired atmosphere of relaxed seating, ambient lighting and conversations that have nowhere else to be.",
      label: "Garden Lounge",
      imagePath: "/assets/garden-ambience.png",
      alt: "Cherry Blossom Garden atmospheric garden lounge",
      linkLabel: "DISCOVER OUR SPACES",
      href: "/#three-levels",
    },
    {
      key: "family-garden",
      category: "FAMILY EXPERIENCES",
      title: "For Every Generation.",
      description:
        "A welcoming destination for shared moments. Beautiful spaces to dine and unwind, with a playful environment for younger guests to discover and enjoy.",
      label: "Family Garden",
      imagePath: "/assets/kids-play-area.png",
      alt: "Children's play area at Cherry Blossom Garden",
      linkLabel: "DISCOVER OUR SPACES",
      href: "/kids-play",
    },
  ],

  upcoming: {
    eyebrow: "THE GARDEN CALENDAR",
    title: "Upcoming",
    accent: "Events.",
    description:
      "Every gathering has a story. Discover the experiences, evenings and special occasions waiting to bloom at Cherry Blossom Garden.",
    emptyTitle: "Something beautiful is coming.",
    emptyDescription:
      "Our next experiences are being prepared. Stay close for upcoming announcements.",
    footerText:
      "Beautiful moments are better when shared.",
    footerLabel: "EXPLORE OUR EXPERIENCES",
    footerHref: "/#experiences",
  },
};


export type ExperienceSlide =
  (typeof DEFAULT_EXPERIENCES_PAGE.slides)[number] & {
  id?: string;
  image?: unknown;
};

export type ExperienceContent = Omit<
  typeof DEFAULT_EXPERIENCES_PAGE,
  "slides"
> & {
  slides: ExperienceSlide[];
};
