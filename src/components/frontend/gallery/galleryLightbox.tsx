"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Aperture, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
    AnimatePresence,
    m,
    useAnimate,
    usePresence,
    type Variants,
} from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { duration, ease } from "@/lib/frontend/motion/tokens";
import { getCategoryLabel, type GalleryPhoto } from "./galleryData";

type GalleryLightboxProps = {
    photos: GalleryPhoto[];
    index: number;
    /** 1 = next, -1 = previous: the side the new photograph enters from. */
    direction: number;
    onMove: (delta: number) => void;
    onClose: () => void;
};

const FOCUSABLE =
    'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/* Photographs slide along the travel direction while crossfading.
   `custom` comes from AnimatePresence, so exits use the latest direction. */
const slideVariants: Variants = {
    enter: (direction: number) => ({ opacity: 0, x: direction * 64 }),
    center: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: ease.out },
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction * -64,
        transition: { duration: 0.4, ease: ease.inOut },
    }),
};

/** The card in the grid for a photograph, if it is on the page. */
function cardFor(id: string) {
    return document.querySelector<HTMLElement>(`[data-photo-id="${id}"]`);
}

/** clip-path that shows only the part of `frame` covered by `card`. */
function windowOver(card: HTMLElement, frame: HTMLElement) {
    const c = card.getBoundingClientRect();
    const f = frame.getBoundingClientRect();

    return `inset(${c.top - f.top}px ${f.right - c.right}px ${f.bottom - c.bottom}px ${c.left - f.left}px round 5px)`;
}

function isOnScreen(element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    return rect.bottom > 0 && rect.top < window.innerHeight;
}

/**
 * Fullscreen viewer.
 * Opens as a window that grows from the clicked photograph to the full
 * frame (a clip-path, so the image is never stretched), and closes back
 * into the card of the photograph being viewed. Render it inside
 * <AnimatePresence> so the closing animation can finish before unmount.
 */
export default function GalleryLightbox({
                                            photos,
                                            index,
                                            direction,
                                            onMove,
                                            onClose,
                                        }: GalleryLightboxProps) {
    const photo = photos[index];
    const reduced = usePrefersReducedMotion();
    const [isPresent, safeToRemove] = usePresence();
    const [scope, animate] = useAnimate<HTMLDivElement>();

    const backdropRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const touchStartX = useRef<number | null>(null);

    // Latest values for effects that must not re-run on every photo change.
    const latest = useRef({ photoId: photo.id, onMove, onClose });
    useLayoutEffect(() => {
        latest.current = { photoId: photo.id, onMove, onClose };
    });

    const multiple = photos.length > 1;
    const previousPhoto = photos[(index - 1 + photos.length) % photos.length];
    const nextPhoto = photos[(index + 1) % photos.length];

    /* ---------- Opening (before first paint, so nothing flashes) ---------- */
    useLayoutEffect(() => {
        const frame = frameRef.current;
        const backdrop = backdropRef.current;
        const chrome = scope.current.querySelectorAll<HTMLElement>("[data-lightbox-chrome]");
        if (!frame || !backdrop) return;

        const card = cardFor(latest.current.photoId);

        backdrop.style.opacity = "0";
        chrome.forEach((element) => (element.style.opacity = "0"));

        animate(backdrop, { opacity: 1 }, { duration: reduced ? duration.reduced : 0.5, ease: ease.out });
        animate(
            Array.from(chrome),
            { opacity: 1, y: reduced ? 0 : [12, 0] },
            { duration: reduced ? duration.reduced : 0.55, delay: reduced ? 0 : 0.3, ease: ease.out }
        );

        if (!reduced && card && isOnScreen(card)) {
            const start = windowOver(card, frame);
            frame.style.clipPath = start;
            animate(
                frame,
                { clipPath: [start, "inset(0px 0px 0px 0px round 0px)"] },
                { duration: 0.8, ease: ease.mask }
            );
        } else {
            frame.style.opacity = "0";
            animate(frame, { opacity: 1 }, { duration: duration.reduced });
        }
        // Mount only: later photo changes animate inside the frame.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- Closing: back into the current photograph's card ---------- */
    useEffect(() => {
        if (isPresent) return;

        const frame = frameRef.current;
        const backdrop = backdropRef.current;
        const chrome = Array.from(
            scope.current.querySelectorAll<HTMLElement>("[data-lightbox-chrome]")
        );
        if (!frame || !backdrop) {
            safeToRemove?.();
            return;
        }

        const card = cardFor(latest.current.photoId);
        const fast = { duration: reduced ? duration.reduced : 0.35, ease: ease.inOut };

        const frameExit =
            !reduced && card && isOnScreen(card)
                ? animate(frame, { clipPath: windowOver(card, frame) }, { duration: 0.6, ease: ease.mask })
                : animate(frame, { opacity: 0 }, fast);

        Promise.all([
            frameExit,
            animate(chrome, { opacity: 0 }, fast),
            animate(backdrop, { opacity: 0 }, { ...fast, delay: reduced ? 0 : 0.2 }),
        ]).then(() => safeToRemove?.());
    }, [isPresent, safeToRemove, animate, reduced, scope]);

    /* ---------- Scroll lock, keyboard and focus for the dialog's life ---------- */
    useEffect(() => {
        const body = document.body;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;

        // Compensate for the scrollbar so the page doesn't shift sideways.
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        closeButtonRef.current?.focus({ preventScroll: true });

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                latest.current.onClose();
                return;
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                latest.current.onMove(1);
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                latest.current.onMove(-1);
                return;
            }

            // Keep Tab inside the dialog.
            if (event.key === "Tab" && scope.current) {
                const focusable = Array.from(
                    scope.current.querySelectorAll<HTMLElement>(FOCUSABLE)
                ).filter((element) => element.offsetParent !== null);
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;

            // Return focus to the photograph that was being viewed.
            cardFor(latest.current.photoId)?.focus({ preventScroll: true });
        };
    }, [scope]);

    return (
        <div
            ref={scope}
            role="dialog"
            aria-modal="true"
            aria-label={`Gallery photograph: ${photo.title}`}
            className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-5 sm:px-8 sm:py-8"
        >
            {/* Backdrop — click to close */}
            <div
                ref={backdropRef}
                aria-hidden="true"
                className="absolute inset-0 bg-[#050608]/96 backdrop-blur-xl"
            />
            <button
                type="button"
                onClick={onClose}
                aria-label="Close image viewer"
                tabIndex={-1}
                className="absolute inset-0 cursor-default"
            />

            <div className="relative z-10 flex h-full max-h-[900px] w-full max-w-[1400px] flex-col">
                {/* LIGHTBOX TOP BAR */}
                <div data-lightbox-chrome="" className="flex shrink-0 items-center justify-between gap-5 pb-5">
                    <div className="flex items-center gap-3 text-ivory/65">
                        <Aperture size={18} className="text-blossom" strokeWidth={1.4} />

                        <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                            Cherry Blossom Gallery
                        </span>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close gallery"
                        className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-blossom hover:text-blossom focus-visible:outline-2 focus-visible:outline-blossom"
                    >
                        <X size={21} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-90" />
                    </button>
                </div>

                {/* MAIN LIGHTBOX IMAGE */}
                <div
                    ref={frameRef}
                    data-lightbox-frame=""
                    className="relative min-h-0 flex-1 overflow-hidden bg-[#131416]"
                    onTouchStart={(event) => {
                        touchStartX.current = event.touches[0]?.clientX ?? null;
                    }}
                    onTouchEnd={(event) => {
                        if (touchStartX.current === null || !multiple) return;
                        const dx = event.changedTouches[0].clientX - touchStartX.current;
                        if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
                        touchStartX.current = null;
                    }}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <m.div
                            key={photo.id}
                            className="absolute inset-0"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />
                        </m.div>
                    </AnimatePresence>

                    {/* Only the neighbours are fetched ahead, at the same size,
                        so stepping through is instant without loading everything. */}
                    {multiple ? (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
                            <Image src={nextPhoto.src} alt="" fill sizes="100vw" loading="eager" className="object-contain" />
                            {previousPhoto.id !== nextPhoto.id ? (
                                <Image src={previousPhoto.src} alt="" fill sizes="100vw" loading="eager" className="object-contain" />
                            ) : null}
                        </div>
                    ) : null}

                    {/* PREVIOUS / NEXT */}
                    {multiple && (
                        <>
                            <button
                                type="button"
                                onClick={() => onMove(-1)}
                                aria-label="Previous photograph"
                                className="group absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-colors duration-300 hover:border-blossom hover:bg-black/75 sm:left-6 sm:h-12 sm:w-12"
                            >
                                <ChevronLeft size={21} strokeWidth={1.4} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => onMove(1)}
                                aria-label="Next photograph"
                                className="group absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white backdrop-blur-sm transition-colors duration-300 hover:border-blossom hover:bg-black/75 sm:right-6 sm:h-12 sm:w-12"
                            >
                                <ChevronRight size={21} strokeWidth={1.4} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            </button>
                        </>
                    )}
                </div>

                {/* LIGHTBOX FOOTER — re-keyed so the caption eases in per photograph */}
                <div data-lightbox-chrome="" className="flex shrink-0 items-end justify-between gap-6 pt-5">
                    <div key={photo.id} className="cbg-enter-fade" style={{ animationDuration: "500ms" }}>
                        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-blossom">
                            {photo.categories.map(getCategoryLabel).join(" · ")}
                        </p>

                        <h3 className="mt-2 font-cormorant text-[27px] leading-none text-ivory sm:text-[34px]">
                            {photo.title}
                        </h3>

                        <p className="mt-2 hidden text-[12px] text-ivory/45 sm:block">
                            {photo.description}
                        </p>
                    </div>

                    <div className="shrink-0 font-cormorant text-[20px] text-ivory/60">
                        {String(index + 1).padStart(2, "0")}
                        <span className="mx-2 text-blossom">/</span>
                        {String(photos.length).padStart(2, "0")}
                    </div>
                </div>
            </div>
        </div>
    );
}
