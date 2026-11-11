"use client";

import {
    useCallback,
    useMemo,
    useState,
} from "react";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
    Aperture,
    ArrowRight,
    ArrowUpRight,
    Armchair,
    CalendarDays,
    Coffee,
    Flower2,
    Grid2X2,
    Heart,
    House,
    Search,
    Sun,
    UsersRound,
    type LucideIcon,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, m } from "motion/react";

import ImageReveal from "@/components/frontend/motion/imageReveal";
import LayoutMotion from "@/components/frontend/motion/layoutMotion";
import Reveal from "@/components/frontend/motion/reveal";
import RiseText from "@/components/frontend/motion/riseText";
import ViewCursor from "@/components/frontend/motion/viewCursor";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { ease } from "@/lib/frontend/motion/tokens";
import GalleryLightbox from "./galleryLightbox";

import {
    categories,
    galleryPhotos,
    getCategoryLabel,
    type CategorySlug,
} from "./galleryData";

/* =============================================
   CATEGORY ICONS
   ============================================= */

const categoryIcons: Record<CategorySlug, LucideIcon> = {
    all: Grid2X2,
    "food-drinks": Coffee,
    "ground-floor": House,
    "first-floor": Armchair,
    rooftop: Sun,
    "kids-family": UsersRound,
    events: CalendarDays,
    "private-dining": Heart,
};

type SearchState = {
    category: CategorySlug;
    value: string;
};

export default function GalleryExperience() {
    const searchParams = useSearchParams();

    /* =============================================
       URL-BASED CATEGORY
       ============================================= */

    const categoryParam = searchParams.get("category");

    const activeCategory: CategorySlug =
        categories.find(
            (category) => category.slug === categoryParam
        )?.slug ?? "all";

    /*
     * The search is scoped to its current category.
     * Changing category automatically gives a clean
     * search, including with browser back/forward.
     */
    const [searchState, setSearchState] =
        useState<SearchState>({
            category: "all",
            value: "",
        });

    const search =
        searchState.category === activeCategory
            ? searchState.value
            : "";

    const [openedId, setOpenedId] =
        useState<string | null>(null);

    // Side the next lightbox photograph enters from (1 = next, -1 = previous).
    const [lightboxDirection, setLightboxDirection] = useState(1);

    const reduced = usePrefersReducedMotion();

    /* =============================================
       FILTER PHOTOS
       ============================================= */

    const filteredPhotos = useMemo(() => {
        const query = search.trim().toLowerCase();

        return galleryPhotos.filter((photo) => {
            const categoryMatches =
                activeCategory === "all" ||
                photo.categories.includes(activeCategory);

            if (!categoryMatches) return false;

            if (!query) return true;

            const searchable = [
                photo.title,
                photo.description,
                photo.alt,
                ...photo.categories.map(getCategoryLabel),
            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(query);
        });
    }, [activeCategory, search]);

    /*
     * Count photos per category independently.
     * Photos with multiple categories are counted
     * once inside each matching category.
     */
    const categoryCounts = useMemo(() => {
        return Object.fromEntries(
            categories.map((category) => [
                category.slug,
                category.slug === "all"
                    ? galleryPhotos.length
                    : galleryPhotos.filter((photo) =>
                        photo.categories.includes(
                            category.slug as Exclude<
                                CategorySlug,
                                "all"
                            >
                        )
                    ).length,
            ])
        ) as Record<CategorySlug, number>;
    }, []);

    /* =============================================
       LIGHTBOX
       ============================================= */

    const openedIndex = filteredPhotos.findIndex(
        (photo) => photo.id === openedId
    );

    const openedPhoto =
        openedIndex >= 0
            ? filteredPhotos[openedIndex]
            : null;

    const movePhoto = useCallback(
        (direction: number) => {
            setLightboxDirection(direction > 0 ? 1 : -1);
            setOpenedId((currentId) => {
                if (!filteredPhotos.length) return null;

                const currentIndex = filteredPhotos.findIndex(
                    (photo) => photo.id === currentId
                );

                const nextIndex =
                    (currentIndex + direction + filteredPhotos.length) %
                    filteredPhotos.length;

                return filteredPhotos[nextIndex].id;
            });
        },
        [filteredPhotos]
    );

    const categoryTitle =
        getCategoryLabel(activeCategory);

    return (
        <>
            {/* ===========================================
          01 — EDITORIAL HERO
          =========================================== */}
            <section
                aria-labelledby="gallery-heading"
                className="
          relative isolate overflow-hidden
          border-b border-champagne/10
          bg-midnight
        "
            >
                {/* Subtle background details */}
                <div
                    aria-hidden="true"
                    className="
            pointer-events-none absolute
            -right-40 -top-40
            h-[600px] w-[600px]
            rounded-full
            bg-blossom/[0.055]
            blur-[130px]
          "
                />

                <div
                    className="
            relative mx-auto grid
            w-full max-w-[1560px]
            items-center gap-12
            px-5 pb-20 pt-20
            sm:px-8 sm:pb-24 sm:pt-24
            lg:min-h-[550px]
            lg:grid-cols-[1.1fr_0.9fr]
            lg:gap-16 lg:px-12 lg:pb-28 lg:pt-20
            xl:px-16
          "
                >
                    {/* LEFT CONTENT */}
                    <div className="relative z-10">
                        <div className="cbg-enter cbg-delay-1 flex items-center gap-4">

                            <span
                                className="
                  text-[10px] font-semibold
                  uppercase tracking-[0.32em]
                  text-blossom
                  sm:text-[11px]
                "
                            >
                The Cherry Blossom Collection
              </span>
                        </div>

                        <h1
                            id="gallery-heading"
                            className="
                mt-8 font-cormorant
                text-[clamp(75px,9vw,145px)]
                font-normal leading-[0.78]
                tracking-[-0.055em]
                text-ivory
              "
                        >
                            <RiseText text="Moments" delay={0.25} />
                            <span
                                className="
                  mt-4 block
                  text-[0.7em]
                   text-blossom
                  sm:mt-6

                    font-allura font-normal
                    leading-[1.1]
                    tracking-normal
                "
                            >
                <RiseText text="at Cherry Blossom." delay={0.4} />
              </span>
                        </h1>

                        <p
                            style={{ animationDelay: "0.65s" }}
                            className="
                cbg-enter
                mt-9 max-w-[480px]
                font-inter text-[14px]
                leading-[1.95]
                text-ivory/60
                sm:mt-11 sm:text-[15px]
              "
                        >
                            A visual journey through our spaces,
                            flavours and experiences. Discover the
                            little details, beautiful surroundings
                            and unforgettable moments that make
                            Cherry Blossom Garden special.
                        </p>

                        <div
                            style={{ animationDelay: "0.8s" }}
                            className="
                cbg-enter
                mt-10 flex flex-wrap
                items-center gap-6
              "
                        >
                            <Link
                                href="#photo-collection"
                                className="
                  group inline-flex items-center
                  gap-3 border-b border-blossom/50
                  pb-2
                  text-[11px] font-medium
                  uppercase tracking-[0.13em]
                  text-blossom
                  transition-colors duration-300
                  hover:border-ivory hover:text-ivory
                "
                            >
                                Explore Our Gallery
                                <ArrowRight
                                    size={16}
                                    strokeWidth={1.5}
                                    className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                                />
                            </Link>

                            <span className="text-[11px] text-ivory/60">
                {galleryPhotos.length} photographs
              </span>
                        </div>
                    </div>

                    {/* RIGHT EDITORIAL IMAGE */}
                    <div
                        className="
              relative hidden
              min-h-[350px]
              sm:block
              lg:min-h-[430px]
            "
                    >
                        <div
                            style={{ animationDelay: "0.2s" }}
                            className="
                cbg-unveil
                absolute inset-x-[6%] inset-y-0
                overflow-hidden
                rounded-[48%_48%_8%_8%]
                border border-champagne/15
                bg-[#1a1a19]
              "
                        >
                            <Image
                                src="/assets/garden-ambience.png"
                                alt="Cherry Blossom Garden ambience"
                                fill
                                priority
                                sizes="(max-width: 1023px) 90vw, 40vw"
                                className="object-cover opacity-75"
                            />

                            <div
                                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-midnight/60
                  via-transparent
                  to-midnight/10
                "
                            />
                        </div>

                        {/* Floating detail */}
                        <div
                            style={{ animationDelay: "1s" }}
                            className="
                cbg-enter
                absolute -bottom-5 left-0
                flex h-[125px] w-[125px]
                flex-col items-center justify-center
                rounded-full
                border border-champagne/30
                bg-[#171719]/95
                text-center
                shadow-xl
                backdrop-blur-xl
                lg:h-[145px] lg:w-[145px]
              "
                        >
                            <Flower2
                                size={19}
                                strokeWidth={1.1}
                                className="mb-3 text-blossom"
                            />

                            <span
                                className="
                  text-[9px] uppercase
                  leading-[1.8]
                  tracking-[0.19em]
                  text-ivory/70
                "
                            >
                Moments
                <br />
                That Stay
              </span>
                        </div>

                        <p
                            style={{ animationDelay: "1.2s" }}
                            className="
                cbg-enter-fade
                absolute bottom-2 right-0
                rotate-[-8deg]
                font-allura text-[30px]
                text-blossom/80
                lg:text-[38px]
              "
                        >
                            Where moments bloom
                        </p>
                    </div>
                </div>
            </section>

            {/* ===========================================
          02 — CATEGORY FILTER + SEARCH
          =========================================== */}
            <section
                aria-label="Filter gallery photographs"
                className="
          sticky top-0 z-30
          border-b border-champagne/15
          bg-midnight/95
          backdrop-blur-xl
        "
            >
                <div
                    className="
            mx-auto flex w-full
            max-w-[1560px]
            flex-col gap-5
            px-5 py-5
            sm:px-8
            lg:flex-row lg:items-center
            lg:justify-between lg:gap-6
            lg:px-12
            xl:px-16
          "
                >
                    {/* CATEGORY CHIPS */}
                    <nav
                        aria-label="Gallery categories"
                        className="
              min-w-0 flex-1
              overflow-x-auto
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
                    >
                        <div
                            className="
                flex w-max min-w-full
                items-center gap-2
                pr-4
              "
                        >
                            {categories.map((category) => {
                                const Icon =
                                    categoryIcons[category.slug];

                                const active =
                                    activeCategory === category.slug;

                                return (
                                    <Link
                                        key={category.slug}
                                        href={`/gallery?category=${category.slug}`}
                                        scroll={false}
                                        aria-current={active ? "page" : undefined}
                                        onClick={() => {
                                            setOpenedId(null);
                                            setSearchState({
                                                category: category.slug,
                                                value: "",
                                            });
                                        }}
                                        className={`
                      group inline-flex min-h-[44px]
                      shrink-0 items-center
                      justify-center gap-2
                      rounded-full border
                      px-4 py-3
                      text-[11px] font-medium
                      transition-all duration-300
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-blossom
                      ${
                                            active
                                                ? "border-blossom bg-blossom text-midnight"
                                                : "border-champagne/20 bg-white/[0.025] text-ivory/65 hover:border-blossom/50 hover:bg-white/[0.06] hover:text-ivory"
                                        }
                    `}
                                    >
                                        <Icon
                                            size={15}
                                            strokeWidth={1.5}
                                            className={
                                                active
                                                    ? "text-midnight"
                                                    : "text-blossom/70"
                                            }
                                        />

                                        <span>{category.label}</span>

                                        {active && (
                                            <span
                                                className="
                          ml-1 text-[10px]
                          text-midnight/70
                        "
                                            >
                        {categoryCounts[category.slug]}
                      </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* SEARCH */}
                    <div
                        className="
              relative w-full shrink-0
              lg:w-[235px] xl:w-[270px]
            "
                    >
                        <Search
                            size={17}
                            strokeWidth={1.5}
                            className="
                pointer-events-none absolute
                left-4 top-1/2
                -translate-y-1/2
                text-ivory/45
              "
                        />

                        <input
                            type="search"
                            aria-label="Search gallery photos"
                            value={search}
                            onChange={(event) =>
                                setSearchState({
                                    category: activeCategory,
                                    value: event.target.value,
                                })
                            }
                            placeholder="Search photographs..."
                            className="
                h-[46px] w-full
                rounded-full border
                border-champagne/20
                bg-white/[0.035]
                py-3 pl-11 pr-5
                text-[12px] text-ivory
                outline-none
                placeholder:text-ivory/35
                transition-all
                focus:border-blossom/70
                focus:bg-white/[0.06]
              "
                        />
                    </div>
                </div>
            </section>

            {/* ===========================================
          03 — PHOTOGRAPH COLLECTION
          =========================================== */}
            <section
                id="photo-collection"
                aria-labelledby="collection-heading"
                className="
          relative scroll-mt-32
          bg-midnight
          pb-28 pt-14
          sm:pb-32 sm:pt-16
          lg:pb-40 lg:pt-20
        "
            >
                <div
                    className="
            mx-auto w-full max-w-[1560px]
            px-5 sm:px-8 lg:px-12 xl:px-16
          "
                >
                    {/* COLLECTION HEADER */}
                    <div
                        className="
              mb-10 flex flex-col
              justify-between gap-5
              sm:mb-12
              md:flex-row md:items-end
              lg:mb-14
            "
                    >
                        <div>
                            <div className="flex items-center gap-3">
                <span
                    className="
                    h-px w-9 bg-blossom/70
                  "
                />

                                <p
                                    className="
                    text-[10px] font-semibold
                    uppercase tracking-[0.28em]
                    text-blossom
                  "
                                >
                                    The Collection
                                </p>
                            </div>

                            <h2
                                key={activeCategory}
                                id="collection-heading"
                                style={{ animationDuration: "700ms" }}
                                className="
                  cbg-enter
                  mt-4 font-cormorant
                  text-[clamp(43px,5vw,68px)]
                  font-normal leading-none
                  tracking-[-0.025em]
                  text-ivory
                "
                            >
                                {activeCategory === "all"
                                    ? "Every Moment."
                                    : `${categoryTitle}.`}
                            </h2>
                        </div>

                        <div
                            aria-live="polite"
                            aria-atomic="true"
                            className="
                flex items-center gap-3
                pb-1
                text-[11px] text-ivory/60
              "
                        >
                            <Aperture
                                size={17}
                                strokeWidth={1.4}
                                className="text-blossom"
                            />

                            Showing {filteredPhotos.length}{" "}
                            {filteredPhotos.length === 1
                                ? "photograph"
                                : "photographs"}
                        </div>
                    </div>

                    {/* THE MASONRY GALLERY */}
                    {/*
                     * Filtering: cards keep their key, so images never remount
                     * or flash. Leaving cards fade out in place first; then the
                     * staying cards glide to their new masonry slots
                     * (layout="position": no size distortion) and new cards rise
                     * in. The closing note shares the LayoutGroup so it glides
                     * with the grid instead of jumping.
                     */}
                    <LayoutMotion>
                    <LayoutGroup>
                    {filteredPhotos.length > 0 ? (
                        <ViewCursor>
                        <div
                            className="
                columns-1 gap-4
                sm:columns-2 sm:gap-5
                lg:columns-3
                xl:columns-4
                xl:gap-6
              "
                        >
                            <AnimatePresence>
                            {filteredPhotos.map((photo, index) => (
                                <m.article
                                    key={photo.id}
                                    layout="position"
                                    data-reveal=""
                                    initial={{ opacity: 0, y: 28 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3, ease: ease.inOut } }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{
                                        layout: { duration: reduced ? 0 : 0.65, ease: ease.out },
                                        default: {
                                            duration: reduced ? 0.2 : 0.8,
                                            ease: ease.out,
                                            delay: reduced ? 0 : (index % 4) * 0.08,
                                        },
                                    }}
                                    className="
                    mb-4 break-inside-avoid
                    sm:mb-5 xl:mb-6
                  "
                                >
                                    <button
                                        type="button"
                                        data-cursor=""
                                        data-photo-id={photo.id}
                                        onClick={() => setOpenedId(photo.id)}
                                        aria-label={`View ${photo.title} in full screen`}
                                        className="
                      group relative block
                      w-full overflow-hidden
                      rounded-[5px]
                      border border-white/[0.06]
                      bg-[#1d1c1b]
                      text-left
                      focus-visible:outline-2
                      focus-visible:outline-offset-4
                      focus-visible:outline-blossom
                    "
                                        style={{
                                            aspectRatio: photo.ratio,
                                        }}
                                    >
                                        {/* PHOTO — opens with a rising mask as it arrives */}
                                        <ImageReveal
                                            fill
                                            delay={(index % 4) * 0.08 + 0.1}
                                        >
                                            <Image
                                                src={photo.src}
                                                alt={photo.alt}
                                                fill
                                                sizes="
                          (max-width: 639px) 100vw,
                          (max-width: 1023px) 50vw,
                          (max-width: 1279px) 33vw,
                          25vw
                        "
                                                style={{
                                                    objectPosition:
                                                        photo.position ?? "center",
                                                }}
                                                className="
                          object-cover
                          transition-transform
                          duration-[1200ms]
                          ease-brand
                          group-hover:scale-[1.06]
                          group-focus-visible:scale-[1.06]
                        "
                                            />
                                        </ImageReveal>

                                        {/* IMAGE OVERLAY */}
                                        <span
                                            aria-hidden="true"
                                            className="
                        pointer-events-none
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/75
                        via-black/10
                        to-transparent
                        opacity-80
                        transition-opacity duration-700
                        group-hover:opacity-100
                        group-focus-visible:opacity-100
                      "
                                        />

                                        {/* TOP RIGHT ARROW */}
                                        <span
                                            aria-hidden="true"
                                            className="
                        absolute right-4 top-4
                        flex h-10 w-10
                        translate-y-1 items-center
                        justify-center
                        rounded-full
                        border border-white/35
                        bg-black/25
                        text-white
                        opacity-0
                        backdrop-blur-sm
                        transition-all duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                        group-focus-visible:opacity-100
                      "
                                        >
                      <ArrowUpRight
                          size={18}
                          strokeWidth={1.5}
                      />
                    </span>

                                        {/* IMAGE CAPTION */}
                                        <span
                                            className="
                        absolute inset-x-0 bottom-0
                        block p-5
                        sm:p-6
                      "
                                        >
                      <span
                          className="
                          mb-2 block text-[9px]
                          font-medium
                          uppercase tracking-[0.18em]
                          text-[#e8b1b5]
                          opacity-80
                          transition-[opacity,letter-spacing] duration-500
                          group-hover:tracking-[0.24em]
                          group-hover:opacity-100
                        "
                      >
                        {getCategoryLabel(
                            photo.categories[0]
                        )}
                      </span>

                      <span
                          className="
                          block font-cormorant
                          text-[28px] font-medium
                          leading-none
                          tracking-[-0.015em]
                          text-white
                          transition-transform duration-500
                          group-hover:-translate-y-1
                          group-focus-visible:-translate-y-1
                          sm:text-[31px]
                        "
                      >
                        {photo.title}
                      </span>

                      {/* Hairline that draws under the title on hover */}
                      <span
                          aria-hidden="true"
                          className="
                          mt-3 block h-px w-12
                          origin-left scale-x-0
                          bg-blossom
                          transition-transform duration-500
                          group-hover:scale-x-100
                          group-focus-visible:scale-x-100
                        "
                      />
                    </span>
                                    </button>
                                </m.article>
                            ))}
                            </AnimatePresence>
                        </div>
                        </ViewCursor>
                    ) : (
                        /* EMPTY SEARCH RESULT */
                        <div
                            style={{ animationDuration: "500ms" }}
                            className="
                cbg-enter-fade
                flex min-h-[350px]
                flex-col items-center
                justify-center
                border border-champagne/15
                bg-white/[0.015]
                px-6 text-center
              "
                        >
                            <Search
                                size={30}
                                strokeWidth={1}
                                className="text-blossom/70"
                            />

                            <h3
                                className="
                  mt-6 font-cormorant
                  text-[35px]
                  text-ivory
                "
                            >
                                No photographs found.
                            </h3>

                            <p
                                className="
                  mt-3 max-w-sm
                  text-[13px] leading-7
                  text-ivory/45
                "
                            >
                                Try another search or explore all
                                the moments in our collection.
                            </p>

                            <Link
                                href="/gallery?category=all"
                                scroll={false}
                                onClick={() =>
                                    setSearchState({
                                        category: "all",
                                        value: "",
                                    })
                                }
                                className="
                  mt-7 inline-flex
                  items-center gap-3
                  text-[11px] font-semibold
                  uppercase tracking-[0.15em]
                  text-blossom
                  hover:text-ivory
                "
                            >
                                View All Photos
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}

                    {/* BOTTOM COLLECTION NOTE */}
                    {filteredPhotos.length > 0 && (
                        <m.div
                            layout="position"
                            transition={{ layout: { duration: reduced ? 0 : 0.65, ease: ease.out } }}
                            className="
                mt-16 flex flex-col
                items-center gap-4
                border-t border-champagne/15
                pt-10 text-center
                sm:mt-20
              "
                        >
                            <Flower2
                                size={20}
                                strokeWidth={1.2}
                                className="text-blossom/70"
                            />

                            <p
                                className="
                  font-cormorant
                  text-[26px] italic
                  text-ivory/60
                  sm:text-[31px]
                "
                            >
                                Every picture tells a story.
                            </p>

                            <p
                                className="
                  text-[11px]
                  tracking-[0.06em]
                  text-ivory/60
                "
                            >
                                Cherry Blossom Garden
                            </p>
                        </m.div>
                    )}
                    </LayoutGroup>
                    </LayoutMotion>
                </div>
            </section>

            {/* ===========================================
          04 — FINAL INVITATION
          =========================================== */}
            <section
                className="
          relative overflow-hidden
          border-t border-champagne/15
          bg-charcoal
          px-5 py-20
          sm:px-8 sm:py-24
          lg:px-12 lg:py-28
        "
            >
                <div
                    className="
            pointer-events-none absolute
            -right-32 top-0
            h-[350px] w-[350px]
            rounded-full bg-blossom/[0.06]
            blur-[100px]
          "
                />

                <Reveal
                    className="
            relative mx-auto flex
            max-w-[1300px]
            flex-col items-start
            justify-between gap-10
            lg:flex-row lg:items-center
          "
                >
                    <div>
                        <p
                            className="
                text-[10px] font-semibold
                uppercase tracking-[0.28em]
                text-blossom
              "
                        >
                            Beyond the photographs
                        </p>

                        <h2
                            className="
                mt-5 font-cormorant
                text-[clamp(42px,5vw,72px)]
                font-normal leading-[0.95]
                tracking-[-0.03em]
                text-ivory
              "
                        >
                            Experience the
                            <br />
                            <span className="italic text-blossom">
                beauty in person.
              </span>
                        </h2>
                    </div>

                    <Link
                        href="/reservation"
                        className="
              group inline-flex min-h-[53px]
              shrink-0 items-center
              justify-center gap-5
              border border-blossom
              px-8 py-4
              text-[11px] font-semibold
              uppercase tracking-[0.13em]
              text-blossom
              transition-all duration-300
              hover:bg-blossom hover:text-midnight
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-blossom
            "
                    >
                        Reserve a Table
                        <ArrowUpRight
                            size={17}
                            strokeWidth={1.5}
                            className="
                transition-transform duration-300
                group-hover:-translate-y-1
                group-hover:translate-x-1
              "
                        />
                    </Link>
                </Reveal>
            </section>

            {/* ===========================================
          05 — FULL SCREEN LIGHTBOX
          =========================================== */}
            <AnimatePresence>
                {openedPhoto ? (
                    <GalleryLightbox
                        key="lightbox"
                        photos={filteredPhotos}
                        index={openedIndex}
                        direction={lightboxDirection}
                        onMove={movePhoto}
                        onClose={() => setOpenedId(null)}
                    />
                ) : null}
            </AnimatePresence>
        </>
    );
}
