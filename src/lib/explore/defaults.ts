
export const FLOOR_KEYS = [
  "ground-floor",
  "first-floor",
  "rooftop",
] as const;

export type FloorKey = (typeof FLOOR_KEYS)[number];

export type ExploreTone =
  | "midnight"
  | "charcoal"
  | "walnut"
  | "cream";

export type ExploreSlide = {
  id?: string;
  anchor: string;
  eyebrow: string;
  titleTop: string;
  titleBottom: string;
  subtitle: string;
  description: string;
  imagePath: string;
  image?: unknown;
  imagePosition: string;
  tone: ExploreTone;
  href: string;
  cta: string;
};

export type ExploreContent = {
  floor: FloorKey;
  title: string;
  slug: string;
  description: string;

  menuLabel: string;
  menuDescription: string;

  homeEyebrow: string;
  homeTitle: string;
  homeShortTitle: string;
  homeDescription: string;

  serialLabel: string;
  imageSignature: string;
  imageLabel: string;
  sideLabel: string;
  sideYear: string;
  nextLabel: string;
  dragHint: string;

  slides: ExploreSlide[];
};

export type ShowcaseSlide = Omit<
  ExploreSlide,
  "image"
> & {
  id: string;
  image: string;
};

const commonLabels = {
  serialLabel: "GARDEN STORIES",
  imageSignature: "Where moments bloom.",
  imageLabel: "CHERRY BLOSSOM GARDEN",
  sideLabel: "THE GARDEN COLLECTION",
  sideYear: "2026",
  nextLabel: "UP NEXT",
  dragHint: "Discover the spaces",
};

export const EXPLORE_DEFAULTS: Record<
  FloorKey,
  ExploreContent
> = {
  "ground-floor": {
    floor: "ground-floor",
    title: "Ground Floor — Café & Family Space",
    slug: "ground-floor",
    description:
      "Explore our ground-floor café and family space, from speciality coffee and cosy seating to the open kitchen and kids zone.",

    menuLabel: "Ground Floor",
    menuDescription: "Café & Family Space",

    homeEyebrow: "Level 01",
    homeTitle: "Café & Family Space",
    homeShortTitle: "Café",
    homeDescription:
      "A warm and welcoming space for coffee, fresh food and relaxed dining. With comfortable seating, an open kitchen and a dedicated kids area, it’s the perfect place for families, casual catch-ups and easy-going moments throughout the day.",

    ...commonLabels,

    slides: [
      {
        anchor: "entrance-experience",
        eyebrow: "01 / Entrance Experience",
        titleTop: "A Warm",
        titleBottom: "Welcome",
        subtitle:
          "Every story begins somewhere beautiful.",
        description:
          "Step into a garden of warm light, natural details and thoughtful hospitality. Your Cherry Blossom experience begins the moment you arrive.",
        imagePath: "/assets/garden-ambience.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "#entrance-experience",
        cta: "Discover the Entrance",
      },
      {
        anchor: "coffee-bar",
        eyebrow: "02 / The Coffee Bar",
        titleTop: "Coffee,",
        titleBottom: "Crafted",
        subtitle:
          "A little pause, made extraordinary.",
        description:
          "Specialty coffee, freshly prepared treats and the comforting rhythm of a good café — a moment worth taking your time over.",
        imagePath: "/assets/hero.png",
        imagePosition: "61% 50%",
        tone: "charcoal",
        href: "#coffee-bar",
        cta: "Meet the Coffee Bar",
      },
      {
        anchor: "cafe-seating",
        eyebrow: "03 / Café Seating",
        titleTop: "Stay a",
        titleBottom: "Little Longer",
        subtitle:
          "Room for conversations to bloom.",
        description:
          "Find your favourite corner among lush greenery, comfortable seats and warm interiors. Perfect for the everyday moments that stay with you.",
        imagePath: "/assets/elevated-dining.png",
        imagePosition: "55% 50%",
        tone: "midnight",
        href: "#cafe-seating",
        cta: "Explore Café Seating",
      },
      {
        anchor: "open-kitchen",
        eyebrow: "04 / Open Kitchen",
        titleTop: "Food in",
        titleBottom: "Action",
        subtitle: "The art is in the making.",
        description:
          "An open view into the craft behind every plate. Fresh ingredients, care and creativity come together before your eyes.",
        imagePath: "/assets/story-main.png",
        imagePosition: "49% 50%",
        tone: "walnut",
        href: "#open-kitchen",
        cta: "See the Open Kitchen",
      },
      {
        anchor: "kids-zone",
        eyebrow: "05 / Kids Zone",
        titleTop: "Little",
        titleBottom: "Adventures",
        subtitle:
          "For their biggest little moments.",
        description:
          "A cheerful world of play, imagination and discovery, thoughtfully designed for little explorers while the grown-ups unwind.",
        imagePath: "/assets/kids-play-area.png",
        imagePosition: "54% 50%",
        tone: "cream",
        href: "/reservation?occasion=kids-party",
        cta: "Reserve a Kids Party",
      },
      {
        anchor: "parking-accessibility",
        eyebrow: "06 / Parking & Accessibility",
        titleTop: "Arrive with",
        titleBottom: "Ease",
        subtitle:
          "A welcome without the worries.",
        description:
          "Convenient parking and accessible spaces make it easy to gather, settle in and enjoy everything the garden has to offer.",
        imagePath: "/assets/garden-ambience.png",
        imagePosition: "65% 50%",
        tone: "midnight",
        href: "#parking-accessibility",
        cta: "Plan Your Visit",
      },
    ],
  },

  "first-floor": {
    floor: "first-floor",
    title: "First Floor — Dining & Entertainment",
    slug: "dining-entertainment",
    description:
      "Explore elevated dining, the garden balcony, private celebrations and entertainment at Cherry Blossom Garden.",

    menuLabel: "First Floor",
    menuDescription: "Dining & Entertainment",

    homeEyebrow: "Level 02",
    homeTitle: "Dining & Entertainment",
    homeShortTitle: "Dining",
    homeDescription:
      "A vibrant social space created for dining, drinks and memorable evenings. Enjoy stylish seating, a lively bar, private dining spaces and live entertainment.",

    ...commonLabels,

    slides: [
      {
        anchor: "elevated-dining",
        eyebrow: "01 / The Restaurant",
        titleTop: "Dining,",
        titleBottom: "Elevated",
        subtitle:
          "Where every gathering feels special.",
        description:
          "Discover thoughtfully prepared cuisine, elegant interiors and attentive hospitality. A beautiful setting for everything from casual dinners to memorable celebrations.",
        imagePath: "/assets/first-floor.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "/menu",
        cta: "Explore Our Menu",
      },
      {
        anchor: "garden-balcony",
        eyebrow: "02 / Garden Balcony",
        titleTop: "A Breath of",
        titleBottom: "Fresh Air",
        subtitle:
          "Beautiful moments, a little closer to nature.",
        description:
          "Step onto our garden-inspired balcony and enjoy a refreshing atmosphere, warm conversations and views that make every moment worth savouring.",
        imagePath: "/assets/garden-ambience.png",
        imagePosition: "50% 50%",
        tone: "charcoal",
        href: "/reservation",
        cta: "Reserve Your Table",
      },
      {
        anchor: "private-dining",
        eyebrow: "03 / Private Dining",
        titleTop: "Made for",
        titleBottom: "Your Moments",
        subtitle:
          "Your occasion deserves something extraordinary.",
        description:
          "Gather with the people who matter in an intimate, thoughtfully designed dining space. Ideal for birthdays, celebrations and meaningful occasions.",
        imagePath: "/assets/private-celebration.png",
        imagePosition: "50% 50%",
        tone: "walnut",
        href: "/reservation",
        cta: "Plan Your Celebration",
      },
      {
        anchor: "lounge",
        eyebrow: "04 / The Lounge",
        titleTop: "Stay for",
        titleBottom: "The Evening",
        subtitle:
          "Unwind in a space made for connection.",
        description:
          "Settle into a relaxed lounge atmosphere with inviting seating, carefully considered interiors and the perfect setting for unhurried evenings.",
        imagePath: "/assets/elevated-dining.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "/reservation",
        cta: "Discover the Lounge",
      },
      {
        anchor: "live-entertainment",
        eyebrow: "05 / Live Entertainment",
        titleTop: "Nights That",
        titleBottom: "Come Alive",
        subtitle:
          "A little music makes a beautiful memory.",
        description:
          "Experience evenings filled with live music, a lively atmosphere and memorable moments shared over great food and conversation.",
        imagePath: "/assets/first-floor.png",
        imagePosition: "55% 50%",
        tone: "charcoal",
        href: "/experiences",
        cta: "Explore Our Experiences",
      },
    ],
  },

  rooftop: {
    floor: "rooftop",
    title: "Rooftop — BBQ & Events",
    slug: "rooftop-bbq-events",
    description:
      "Discover rooftop BBQ, sunset dining and private events in an open-air setting at Cherry Blossom Garden.",

    menuLabel: "Second Floor",
    menuDescription: "Rooftop BBQ & Events",

    homeEyebrow: "Level 03",
    homeTitle: "Rooftop BBQ & Events",
    homeShortTitle: "Rooftop",
    homeDescription:
      "An open-air rooftop experience designed for relaxed dining and special occasions, featuring BBQ sessions, comfortable seating and flexible event space under the open sky.",

    ...commonLabels,

    slides: [
      {
        anchor: "rooftop-arrival",
        eyebrow: "01 / The Rooftop",
        titleTop: "Above the",
        titleBottom: "Ordinary",
        subtitle:
          "Beautiful evenings begin up here.",
        description:
          "Discover an open-air escape designed for relaxed gatherings, warm hospitality and unforgettable moments above the garden.",
        imagePath: "/assets/rooftop.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "/reservation",
        cta: "Reserve the Rooftop",
      },
      {
        anchor: "sunset-bbq",
        eyebrow: "02 / Sunset BBQ Sessions",
        titleTop: "Fire Meets",
        titleBottom: "Flavour",
        subtitle:
          "The perfect way to celebrate golden hour.",
        description:
          "Enjoy freshly prepared barbecue, bold flavours and an inviting rooftop atmosphere as the sun begins to set.",
        imagePath: "/assets/rooftop.png",
        imagePosition: "60% 50%",
        tone: "walnut",
        href: "/menu",
        cta: "Discover Rooftop Dining",
      },
      {
        anchor: "open-air-seating",
        eyebrow: "03 / Open-Air Dining",
        titleTop: "Dine Under",
        titleBottom: "Open Skies",
        subtitle:
          "Every table has a story to tell.",
        description:
          "Take your time over good food and great conversation in an airy rooftop setting thoughtfully designed for comfort and connection.",
        imagePath: "/assets/garden-ambience.png",
        imagePosition: "50% 50%",
        tone: "charcoal",
        href: "/reservation",
        cta: "Find Your Table",
      },
      {
        anchor: "private-events",
        eyebrow: "04 / Rooftop Celebrations",
        titleTop: "Celebrate",
        titleBottom: "Beautifully",
        subtitle:
          "An unforgettable setting for your next occasion.",
        description:
          "From birthdays and private gatherings to special celebrations, our flexible rooftop space offers a distinctive place to come together.",
        imagePath: "/assets/private-celebration.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "/reservation",
        cta: "Plan Your Event",
      },
      {
        anchor: "evening-ambience",
        eyebrow: "05 / Rooftop Evenings",
        titleTop: "Under the",
        titleBottom: "Stars",
        subtitle:
          "Where the evening becomes the experience.",
        description:
          "As daylight fades, discover a warm rooftop atmosphere made for lingering conversations, special occasions and moments worth remembering.",
        imagePath: "/assets/rooftop.png",
        imagePosition: "50% 50%",
        tone: "midnight",
        href: "/experiences",
        cta: "Explore More Experiences",
      },
    ],
  },
};

export function isFloorKey(
  value: unknown,
): value is FloorKey {
  return (
    typeof value === "string" &&
    FLOOR_KEYS.includes(value as FloorKey)
  );
}

export function withExploreDefaults(
  floor: FloorKey,
  value?: Partial<ExploreContent> | null,
): ExploreContent {
  const fallback = EXPLORE_DEFAULTS[floor];

  const slides =
    Array.isArray(value?.slides) &&
    value.slides.length > 0
      ? value.slides.map((slide, index) => ({
        ...fallback.slides[
        index % fallback.slides.length
          ],
        ...slide,
      }))
      : fallback.slides;

  return {
    ...fallback,
    ...value,
    floor,
    slides,
  };
}
