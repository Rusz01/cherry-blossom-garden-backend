
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const originalPath = "src/app/(frontend)/kids-play/page.tsx";
const viewPath =
  "src/components/frontend/kids-play/KidsPlayView.tsx";

if (existsSync(viewPath)) {
  throw new Error(
    `${viewPath} already exists. Refusing to overwrite it.`,
  );
}

let code = await readFile(originalPath, "utf8");

// If the server wrapper was already pasted into page.tsx,
// recover the original JSX from the current Git HEAD.
if (!code.includes("const benefits = [")) {
  code = execFileSync(
    "git",
    ["show", `HEAD:${originalPath}`],
    { encoding: "utf8" },
  );
}

if (
  !code.includes("const benefits = [") ||
  !code.includes("export default function KidsPlayAreaPage()")
) {
  throw new Error(
    "Could not locate the original Kids Play Area component.",
  );
}

function replaceOnce(before, after) {
  if (!code.includes(before)) {
    throw new Error(`Could not find: ${before}`);
  }

  code = code.replace(before, after);
}

function replaceRegex(pattern, replacement) {
  if (!pattern.test(code)) {
    throw new Error(`Could not match: ${pattern}`);
  }

  code = code.replace(pattern, replacement);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Matches visible JSX text regardless of line wrapping.
function replaceVisible(before, after) {
  const pattern = new RegExp(
    before
      .trim()
      .split(/\s+/)
      .map(escapeRegex)
      .join("\\s+"),
    "g",
  );

  const matches = [...code.matchAll(pattern)];

  if (matches.length !== 1) {
    throw new Error(
      `Expected one occurrence of "${before}", found ${matches.length}.`,
    );
  }

  code = code.replace(pattern, after);
}

// 1. Convert the existing page into a client component.
replaceOnce(
  'import type { Metadata } from "next";',
  `"use client";

import { useKidsPlayContent } from "@/components/frontend/kids-play/KidsPlayContentProvider";
import { DEFAULT_KIDS_PLAY as D, imageAlt } from "@/lib/kids-play/defaults";
import { imageSrc } from "@/lib/homepage/defaults";`,
);

// Metadata now lives in the server page.
replaceRegex(
  /export const metadata: Metadata = \{[\s\S]*?\n\};\s*/,
  "",
);

// Preserve the icons and their positions.
replaceRegex(
  /const benefits = \[[\s\S]*?\];\s*const playFeatures = \[[\s\S]*?\];/,
  `const benefitIcons = [ShieldCheck, Blocks, UsersRound, Coffee];
const playIcons = [Sparkles, Blocks, Heart];`,
);

// Read benefits and features from Payload instead of constants.
replaceOnce(
  "export default function KidsPlayAreaPage() {",
  `export default function KidsPlayView() {
  const content = useKidsPlayContent();

  const benefits = content.benefits.map((item, i) => ({
    ...item,
    icon: benefitIcons[i] ?? ShieldCheck,
  }));

  const playFeatures = content.discover.features.map((item, i) => ({
    ...item,
    icon: playIcons[i] ?? Sparkles,
  }));`,
);

// 2. Connect every visible static paragraph and heading.
const visibleText = [
  ["A little world of wonder", "{content.hero.eyebrow}"],
  [
    "A joyful little world where imagination blossoms, adventures begin, and beautiful memories are made.",
    "{content.hero.paragraph1}",
  ],
  [
    "Let the little ones explore while you relax, dine, and enjoy every moment at Cherry Blossom Garden.",
    "{content.hero.paragraph2}",
  ],
  ["Explore the space", "{content.hero.scrollLabel}"],
  ["Little adventures", "{content.hero.photoLabel}"],
  ["Beautiful memories.", "{content.hero.photoCaption}"],

  ["For little explorers", "{content.discover.sticker}"],
  ["Play · Discover · Grow", "{content.discover.eyebrow}"],
  ["A World of", "{content.discover.heading1}"],
  ["Imagination.", "{content.discover.headingAccent}"],
  [
    "Childhood is made of tiny discoveries, endless curiosity and moments of pure joy. Our play area brings those special moments together in a beautiful, welcoming environment.",
    "{content.discover.paragraph1}",
  ],
  [
    "From playful adventures to moments of imagination, little guests have a space of their own while the grown-ups enjoy the Cherry Blossom Garden experience.",
    "{content.discover.paragraph2}",
  ],

  [
    "Little moments, lifelong memories.",
    "{content.divider.text}",
  ],

  ["Celebrate their special day", "{content.party.eyebrow}"],
  ["Kids Parties", "{content.party.heading1}"],
  [
    "Some celebrations deserve a little extra magic. Make their special day unforgettable with a joyful setting for birthdays, family gatherings and precious milestones.",
    "{content.party.paragraph1}",
  ],
  [
    "Beautiful surroundings, delightful food, playful moments and the people who matter most — everything for a celebration worth remembering.",
    "{content.party.paragraph2}",
  ],
  ["Birthday celebrations", "{content.party.feature1}"],
  ["Family gatherings", "{content.party.feature2}"],
  ["Plan a Kids Party", "{content.party.buttonLabel}"],

  [
    "Good food. Happy kids. Beautiful moments.",
    "{content.family.eyebrow}",
  ],
  [
    "Great food, a beautiful atmosphere and a dedicated place for little adventures. Create your next family memory at Cherry Blossom Garden.",
    "{content.family.paragraph}",
  ],

  ["Blossom.", "{content.party.accent2}"],
];

for (const [before, after] of visibleText) {
  replaceVisible(before, after);
}

// 3. Connect headings, links, images and buttons.
const exactReplacements = [
  [
    '<RiseText text="Kids" delay={0.25} />',
    '<RiseText text={content.hero.title1} delay={0.25} />',
  ],
  [
    '<RiseText text="Play Area." delay={0.42} />',
    '<RiseText text={content.hero.titleAccent} delay={0.42} />',
  ],

  [
    'href="#kids-party"',
    'href={content.hero.buttonHref || "#kids-party"}',
  ],
  [
    'href="#discover"',
    'href={content.hero.scrollHref || "#discover"}',
  ],

  // First occurrence = hero button.
  // Second occurrence = final family button.
  [
    "Reserve for Kids Party",
    "{content.hero.buttonLabel}",
  ],
  [
    "Reserve for Kids Party",
    "{content.family.buttonLabel}",
  ],

  // First occurrence = party section.
  // Second occurrence = family section.
  [
    'href="/reservation?occasion=kids-party"',
    'href={content.party.buttonHref || "/reservation?occasion=kids-party"}',
  ],
  [
    'href="/reservation?occasion=kids-party"',
    'href={content.family.buttonHref || "/reservation?occasion=kids-party"}',
  ],

  // The two original kids-play-area.png images are
  // independently editable in Payload.
  [
    'src="/assets/kids-play-area.png"',
    "src={imageSrc(content.hero.image, D.hero.image)}",
  ],
  [
    'src="/assets/kids-play-area.png"',
    "src={imageSrc(content.discover.image, D.discover.image)}",
  ],
  [
    'src="/assets/private-celebration.png"',
    "src={imageSrc(content.party.image, D.party.image)}",
  ],
  [
    'src="/assets/garden-ambience.png"',
    "src={imageSrc(content.family.image, D.family.image)}",
  ],

  [
    'alt="Cherry Blossom Garden children\'s play area"',
    'alt={imageAlt(content.hero.image, "Cherry Blossom Garden children\'s play area")}',
  ],
  [
    'alt="Play structures and activities at Cherry Blossom Garden"',
    'alt={imageAlt(content.discover.image, "Play structures and activities at Cherry Blossom Garden")}',
  ],
  [
    'alt="Private celebration setting at Cherry Blossom Garden"',
    'alt={imageAlt(content.party.image, "Private celebration setting at Cherry Blossom Garden")}',
  ],
  [
    'alt="Welcoming garden dining atmosphere"',
    'alt={imageAlt(content.family.image, "Welcoming garden dining atmosphere")}',
  ],

  // Party heading preserves the original line breaks.
  [
    'at{" "}',
    '{content.party.heading2}{" "}',
  ],
  [
    'text-blossom">Cherry',
    'text-blossom">{content.party.accent1}',
  ],

  // Final CTA heading.
  [
    'Dine.{" "}',
    '{content.family.heading1}{" "}',
  ],
  [
    "Play.",
    "{content.family.accent}",
  ],
  [
    "Enjoy.",
    "{content.family.heading2}",
  ],
];

for (const [before, after] of exactReplacements) {
  replaceOnce(before, after);
}

// 4. Write the completed component.
await mkdir(path.dirname(viewPath), {
  recursive: true,
});

await writeFile(viewPath, code, "utf8");

console.log(`Created: ${viewPath}`);
console.log("Existing page layout and animations preserved.");
console.log("Kids Play Area content now reads from Payload CMS.");
