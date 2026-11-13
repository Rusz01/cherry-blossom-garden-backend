
export const DEFAULT_MENU_COPY = {
  eyebrow: "Our Menu",
  lineOne: "A Taste for",
  lineTwo: "Every",
  accent: "Moment",
  description:
    "From handcrafted coffee to delicious dining experiences, our menu brings people together over fresh flavours, quality ingredients and unforgettable moments.",
  allTitle: "All Menu",
  allDescription:
    "Discover our complete selection of food and drinks.",
  signatureTitle: "Signature Flavours",
  signatureDescription:
    "Handpicked dishes loved by our guests.",
};

export type MenuCopy = typeof DEFAULT_MENU_COPY;


export function withMenuCopy(data: unknown): MenuCopy {
  const incoming =
    data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};

  return Object.fromEntries(
    Object.entries(DEFAULT_MENU_COPY).map(([key, fallback]) => [
      key,
      typeof incoming[key] === "string"
        ? incoming[key]
        : fallback,
    ]),
  ) as MenuCopy;
}
