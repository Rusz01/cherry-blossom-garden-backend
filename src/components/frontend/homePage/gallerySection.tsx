
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import Reveal from "@/components/frontend/motion/reveal";
import TextReveal from "@/components/frontend/motion/textReveal";
import Container from "@/components/frontend/ui/container";
import Eyebrow from "@/components/frontend/ui/eyebrow";
import TextLink from "@/components/frontend/ui/textLink";

type GalleryImage = {
    src: string;
    title: string;
    alt: string;
    aspect: string;
};

// Four independent columns create the editorial layout.
// Images are already available in public/assets.
const galleryColumns: GalleryImage[][] = [
    [
        {
            src: "/assets/private-celebration.png",
            title: "Beautiful Celebrations",
            alt: "Private celebration setting at Cherry Blossom Garden",
            aspect: "aspect-[3/4]",
        },
    ],
    [
        {
            src: "/assets/first-floor.png",
            title: "Elegant Dining",
            alt: "First floor dining and entertainment space",
            aspect: "aspect-square",
        },
        {
            src: "/assets/garden-ambience.png",
            title: "Garden Ambience",
            alt: "Garden-inspired atmosphere and warm lighting",
            aspect: "aspect-square",
        },
    ],
    [
        {
            src: "/assets/rooftop.png",
            title: "Rooftop Evenings",
            alt: "Rooftop dining and event space",
            aspect: "aspect-[9/10]",
        },
        {
            src: "/assets/story-main.png",
            title: "Moments Together",
            alt: "Interior of Cherry Blossom Garden",
            aspect: "aspect-[16/9]",
        },
    ],
    [
        {
            src: "/assets/elevated-dining.png",
            title: "Elevated Experiences",
            alt: "Elevated dining at Cherry Blossom Garden",
            aspect: "aspect-[16/9]",
        },
        {
            src: "/assets/hero.png",
            title: "Where Moments Bloom",
            alt: "Cherry Blossom Garden signature atmosphere",
            aspect: "aspect-[3/4]",
        },
    ],
];

export function GalleryGrid({
                                fullPage = false,
                            }: {
    fullPage?: boolean;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:gap-6">
            {galleryColumns.map((column, columnIndex) => (
                <div
                    key={columnIndex}
                    className="flex min-w-0 flex-col gap-4 sm:gap-5 xl:gap-6"
                >
                    {column.map((photo, photoIndex) => (
                        <Link
                            key={photo.src}
                            href={fullPage ? photo.src : "/gallery"}
                            target={fullPage ? "_blank" : undefined}
                            rel={fullPage ? "noopener noreferrer" : undefined}
                            aria-label={
                                fullPage
                                    ? `Open full-size image: ${photo.title}`
                                    : `Explore gallery: ${photo.title}`
                            }
                            className={`
                group relative block w-full overflow-hidden
                bg-charcoal focus-ring
                ${photo.aspect}
              `}
                        >
                            {/* Columns open left to right, then top to bottom. */}
                            <ImageReveal
                                fill
                                delay={columnIndex * 0.12 + photoIndex * 0.18}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                                    className="
                      object-cover
                      transition-transform duration-[1200ms] ease-brand
                      group-hover:scale-[1.045]
                    "
                                />
                            </ImageReveal>

                            {/* Dark gradient visible on hover */}
                            <div
                                className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-t
                  from-black/75 via-black/10 to-transparent
                  opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                  group-focus-visible:opacity-100
                "
                            />

                            {/* Subtle image caption */}
                            <div
                                className="
                  pointer-events-none absolute inset-x-0 bottom-0
                  flex translate-y-3 items-end justify-between
                  gap-4 p-5 opacity-0
                  transition-all duration-500
                  group-hover:translate-y-0 group-hover:opacity-100
                  group-focus-visible:translate-y-0
                  group-focus-visible:opacity-100
                  sm:p-6
                "
                            >
                                <div>
                                    <p className="mb-2 font-inter text-[9px] font-medium uppercase tracking-[0.24em] text-blossom">
                                        Cherry Blossom Garden
                                    </p>

                                    <h3 className="font-cormorant text-[25px] font-normal leading-none text-ivory sm:text-[28px]">
                                        {photo.title}
                                    </h3>
                                </div>

                                <ArrowUpRight
                                    size={19}
                                    strokeWidth={1.3}
                                    className="shrink-0 text-ivory"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default function GallerySection() {
    return (
        <section
            id="gallery"
            aria-labelledby="gallery-title"
            className="
        relative isolate overflow-hidden
        border-t border-champagne/20
        bg-midnight py-24
        sm:py-28 lg:py-32
      "
        >
            <Container>
                {/* SECTION HEADING */}
                <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16">
                    <Reveal intensity="subtle">
                        <Eyebrow className="mb-4">Gallery</Eyebrow>
                    </Reveal>

                    <TextReveal
                        id="gallery-title"
                        text="Moments in Blossom"
                        className="
              font-cormorant font-normal leading-[0.95]
              tracking-[-0.02em] text-ivory
              text-[46px] sm:text-[56px] lg:text-[64px]
            "
                    />
                </div>

                {/* ASYMMETRIC GALLERY */}
                <GalleryGrid />

                {/* VIEW GALLERY LINK */}
                <Reveal intensity="subtle" className="mt-16 flex justify-center sm:mt-20 lg:mt-24">
                    <TextLink href="/gallery">View Gallery</TextLink>
                </Reveal>
            </Container>
        </section>
    );
}
