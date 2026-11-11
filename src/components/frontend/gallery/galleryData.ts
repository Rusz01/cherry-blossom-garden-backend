
export const categories = [
    {
        slug: "all",
        label: "All",
    },
    {
        slug: "food-drinks",
        label: "Food & Drinks",
    },
    {
        slug: "ground-floor",
        label: "Ground Floor",
    },
    {
        slug: "first-floor",
        label: "First Floor",
    },
    {
        slug: "rooftop",
        label: "Rooftop",
    },
    {
        slug: "kids-family",
        label: "Kids & Family",
    },
    {
        slug: "events",
        label: "Events",
    },
    {
        slug: "private-dining",
        label: "Private Dining",
    },
] as const;

export type CategorySlug =
    (typeof categories)[number]["slug"];

export type PhotoCategory =
    Exclude<CategorySlug, "all">;

export type GalleryPhoto = {
    id: string;
    src: string;
    alt: string;
    title: string;
    description: string;
    categories: PhotoCategory[];

    // Controls the height of each masonry image.
    // Example: "4 / 5", "3 / 2", "1 / 1".
    ratio: string;

    // Optional CSS object-position for image framing.
    position?: string;
};

export const galleryPhotos: GalleryPhoto[] = [
    {
        id: "signature-atmosphere",
        src: "/assets/hero.png",
        alt: "Signature Cherry Blossom Garden atmosphere",
        title: "Where Moments Bloom",
        description:
            "The signature atmosphere of Cherry Blossom Garden.",
        categories: ["ground-floor", "food-drinks"],
        ratio: "4 / 5",
        position: "center",
    },
    {
        id: "elevated-dining",
        src: "/assets/elevated-dining.png",
        alt: "Elevated dining experience",
        title: "Elevated Dining",
        description:
            "Thoughtfully designed dining spaces.",
        categories: [
            "food-drinks",
            "first-floor",
            "private-dining",
        ],
        ratio: "5 / 4",
    },
    {
        id: "garden-ambience",
        src: "/assets/garden-ambience.png",
        alt: "Warm garden-inspired dining atmosphere",
        title: "Garden Ambience",
        description:
            "An inviting atmosphere for moments together.",
        categories: ["ground-floor", "private-dining"],
        ratio: "4 / 5",
    },
    {
        id: "rooftop-evenings",
        src: "/assets/rooftop.png",
        alt: "Cherry Blossom Garden rooftop",
        title: "Rooftop Evenings",
        description:
            "Open-air experiences with a beautiful view.",
        categories: ["rooftop", "events"],
        ratio: "3 / 2",
    },
    {
        id: "kids-play",
        src: "/assets/kids-play-area.png",
        alt: "Kids play area at Cherry Blossom Garden",
        title: "Little Adventures",
        description:
            "A joyful space for young explorers.",
        categories: ["kids-family", "ground-floor"],
        ratio: "4 / 5",
    },
    {
        id: "private-celebrations",
        src: "/assets/private-celebration.png",
        alt: "Private celebration setting",
        title: "Beautiful Celebrations",
        description:
            "Thoughtful spaces for memorable occasions.",
        categories: ["private-dining", "events"],
        ratio: "5 / 4",
    },
    {
        id: "first-floor-dining",
        src: "/assets/first-floor.png",
        alt: "Cherry Blossom Garden first-floor interior",
        title: "Dining & Entertainment",
        description:
            "A sophisticated setting for dining and evenings.",
        categories: ["first-floor", "events"],
        ratio: "4 / 5",
    },
    {
        id: "our-story",
        src: "/assets/story-main.png",
        alt: "Interior atmosphere at Cherry Blossom Garden",
        title: "Moments Together",
        description:
            "Where beautiful experiences begin.",
        categories: ["ground-floor"],
        ratio: "3 / 2",
    },
];

export function getCategoryLabel(
    slug: CategorySlug | PhotoCategory
): string {
    return (
        categories.find((category) => category.slug === slug)
            ?.label ?? slug
    );
}
