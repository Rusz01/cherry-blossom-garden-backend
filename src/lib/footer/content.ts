
export type FooterLink = {
  label: string;
  href: string;
};

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok";

export type FooterSocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type FooterContent = {
  brand: {
    description: string;
    tagline: string;
    logoSrc: string;
    logoAlt: string;
  };
  social: {
    heading: string;
    links: FooterSocialLink[];
  };
  explore: {
    title: string;
    label: string;
    links: FooterLink[];
  };
  discover: {
    title: string;
    label: string;
    links: FooterLink[];
  };
  contact: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };
  legal: {
    siteName: string;
    rightsText: string;
    privacyLabel: string;
    privacyHref: string;
  };
};

export type RawFooter = Record<string, unknown>;

export const DEFAULT_FOOTER: FooterContent = {
  brand: {
    description:
      "A garden of flavours, beautiful spaces and unforgettable moments. Where thoughtful hospitality and meaningful celebrations come together.",
    tagline: "Where beautiful moments bloom.",
    logoSrc: "/Cherry-Blossom-Garden-Logo.png",
    logoAlt: "Cherry Blossom Garden",
  },

  social: {
    heading: "Follow The Garden",
    links: [
      {
        platform: "facebook",
        label: "Facebook",
        href: "https://www.facebook.com/YOUR_PAGE",
      },
      {
        platform: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/YOUR_USERNAME",
      },
      {
        platform: "tiktok",
        label: "TikTok",
        href: "https://www.tiktok.com/@YOUR_USERNAME",
      },
    ],
  },

  explore: {
    title: "Links",
    label: "Footer navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Gallery", href: "/gallery" },
      { label: "About Us", href: "/about" },
    ],
  },

  discover: {
    title: "Discover",
    label: "Experience links",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "Kids & Family", href: "/kids-play" },
      { label: "Experiences", href: "/experiences" },
      { label: "Reserve a Table", href: "/reservation" },
      {
        label: "Private Celebrations",
        href: "/reservation",
      },
    ],
  },

  contact: {
    eyebrow: "Connect With Us",
    headingLine1: "Let's Make",
    headingLine2: "Memories Together.",
    description:
      "Planning a visit or a special occasion? We'd love to hear from you.",
    buttonLabel: "Get in Touch",
    buttonHref: "/reservation",
  },

  legal: {
    siteName: "Cherry Blossom Garden",
    rightsText: "All rights reserved.",
    privacyLabel: "Privacy Policy",
    privacyHref: "/privacy-policy",
  },
};

function record(value: unknown): RawFooter {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as RawFooter;
  }

  return {};
}

function readText(
  value: unknown,
  fallback: string,
): string {
  return typeof value === "string"
    ? value
    : fallback;
}

export function safeFooterHref(
  value: unknown,
): string | null {
  if (typeof value !== "string") return null;

  const href = value.trim();

  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  try {
    const url = new URL(href);

    return url.protocol === "https:"
      ? href
      : null;
  } catch {
    return null;
  }
}

function readLinks(
  value: unknown,
  fallback: FooterLink[],
): FooterLink[] {
  if (!Array.isArray(value)) return fallback;

  return value.flatMap((item): FooterLink[] => {
    const row = record(item);

    if (row.visible === false) return [];

    const label = readText(row.label, "").trim();
    const href = safeFooterHref(row.href);

    if (!label || !href) return [];

    return [{ label, href }];
  });
}

function isSocialPlatform(
  value: unknown,
): value is SocialPlatform {
  return (
    value === "facebook" ||
    value === "instagram" ||
    value === "tiktok"
  );
}

function readSocialLinks(
  value: unknown,
  fallback: FooterSocialLink[],
): FooterSocialLink[] {
  if (!Array.isArray(value)) return fallback;

  return value.flatMap((item): FooterSocialLink[] => {
    const row = record(item);

    if (row.visible === false) return [];

    const platform = row.platform;
    const href = safeFooterHref(row.url);

    if (
      !isSocialPlatform(platform) ||
      !href ||
      !href.startsWith("https://")
    ) {
      return [];
    }

    const labels: Record<SocialPlatform, string> = {
      facebook: "Facebook",
      instagram: "Instagram",
      tiktok: "TikTok",
    };

    return [{
      platform,
      label: labels[platform],
      href,
    }];
  });
}

function readLogo(value: unknown) {
  const media = record(value);

  const src = readText(media.url, "");
  const alt = readText(
    media.alt,
    DEFAULT_FOOTER.brand.logoAlt,
  );

  // An upload can be on the CMS origin or an
  // external S3/MinIO HTTPS endpoint.
  const validSrc =
    src.startsWith("/") && !src.startsWith("//")
      ? src
      : (() => {
        try {
          const url = new URL(src);
          return ["http:", "https:"].includes(
            url.protocol,
          )
            ? src
            : null;
        } catch {
          return null;
        }
      })();

  return {
    logoSrc: validSrc || DEFAULT_FOOTER.brand.logoSrc,
    logoAlt: alt,
  };
}

export function normalizeFooter(
  value: RawFooter | null | undefined,
): FooterContent {
  const root = record(value);
  const brand = record(root.brand);
  const social = record(root.social);
  const explore = record(root.explore);
  const discover = record(root.discover);
  const contact = record(root.contact);
  const legal = record(root.legal);

  return {
    brand: {
      ...readLogo(brand.logo),
      description: readText(
        brand.description,
        DEFAULT_FOOTER.brand.description,
      ),
      tagline: readText(
        brand.tagline,
        DEFAULT_FOOTER.brand.tagline,
      ),
    },

    social: {
      heading: readText(
        social.heading,
        DEFAULT_FOOTER.social.heading,
      ),
      links: readSocialLinks(
        social.links,
        DEFAULT_FOOTER.social.links,
      ),
    },

    explore: {
      title: readText(
        explore.title,
        DEFAULT_FOOTER.explore.title,
      ),
      label: DEFAULT_FOOTER.explore.label,
      links: readLinks(
        explore.links,
        DEFAULT_FOOTER.explore.links,
      ),
    },

    discover: {
      title: readText(
        discover.title,
        DEFAULT_FOOTER.discover.title,
      ),
      label: DEFAULT_FOOTER.discover.label,
      links: readLinks(
        discover.links,
        DEFAULT_FOOTER.discover.links,
      ),
    },

    contact: {
      eyebrow: readText(
        contact.eyebrow,
        DEFAULT_FOOTER.contact.eyebrow,
      ),
      headingLine1: readText(
        contact.headingLine1,
        DEFAULT_FOOTER.contact.headingLine1,
      ),
      headingLine2: readText(
        contact.headingLine2,
        DEFAULT_FOOTER.contact.headingLine2,
      ),
      description: readText(
        contact.description,
        DEFAULT_FOOTER.contact.description,
      ),
      buttonLabel: readText(
        contact.buttonLabel,
        DEFAULT_FOOTER.contact.buttonLabel,
      ),
      buttonHref:
        safeFooterHref(contact.buttonHref) ??
        DEFAULT_FOOTER.contact.buttonHref,
    },

    legal: {
      siteName: readText(
        legal.siteName,
        DEFAULT_FOOTER.legal.siteName,
      ),
      rightsText: readText(
        legal.rightsText,
        DEFAULT_FOOTER.legal.rightsText,
      ),
      privacyLabel: readText(
        legal.privacyLabel,
        DEFAULT_FOOTER.legal.privacyLabel,
      ),
      privacyHref:
        safeFooterHref(legal.privacyHref) ??
        DEFAULT_FOOTER.legal.privacyHref,
    },
  };
}
