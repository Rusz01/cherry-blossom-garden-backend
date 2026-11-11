"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Flower2, X } from "lucide-react";
import { AnimatePresence, m, type Variants } from "motion/react";

import Petal from "@/components/frontend/ui/petal";
import { cn } from "@/lib/frontend/cn";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { duration, ease, stagger, type CubicBezier } from "@/lib/frontend/motion/tokens";
import type { TodaysSpecials } from "@/types/specials";
import SpecialMenuItem from "./specialMenuItem";

const FOCUSABLE =
    'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

type TodaySpecialsModalProps = {
    open: boolean;
    onClose: () => void;
    /** Null until the restaurant-local date is known (after hydration). */
    today: TodaysSpecials | null;
    /** Development-data notice shown under the list. */
    notice?: string;
    dialogId: string;
    /** Element that receives focus again when the dialog closes. */
    returnFocus: RefObject<HTMLElement | null>;
};

const subscribeNever = () => () => {};

/** False on the server and during hydration, true afterwards. */
function useIsClient() {
    return useSyncExternalStore(subscribeNever, () => true, () => false);
}

/* One set of variants; reduced motion keeps the same states with short
   durations (MotionConfig already skips the transforms). */
function makeVariants(reduced: boolean) {
    const t = (seconds: number, curve: CubicBezier = ease.out) => ({
        duration: reduced ? duration.reduced : seconds,
        ease: curve,
    });

    return {
        backdrop: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: t(0.5) },
            exit: { opacity: 0, transition: { ...t(0.4, ease.inOut), delay: reduced ? 0 : 0.1 } },
        },
        panel: {
            hidden: { opacity: 0, scale: 0.97, y: 18 },
            visible: { opacity: 1, scale: 1, y: 0, transition: t(0.8) },
            exit: { opacity: 0, scale: 0.98, y: 10, transition: t(0.35, ease.inOut) },
        },
        photo: {
            hidden: { clipPath: "inset(100% 0% 0% 0%)" },
            visible: { clipPath: "inset(0% 0% 0% 0%)", transition: t(1.1, ease.mask) },
        },
        photoZoom: {
            hidden: { scale: 1.12 },
            visible: { scale: 1, transition: t(1.8) },
        },
        copy: {
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: reduced ? 0 : stagger.base,
                    delayChildren: reduced ? 0 : 0.35,
                },
            },
        },
        fade: {
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: t(0.8) },
        },
        rise: {
            hidden: { y: "105%" },
            visible: { y: "0%", transition: t(0.9) },
        },
        line: {
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: t(0.9, ease.mask) },
        },
        badge: {
            hidden: { opacity: 0, y: -6 },
            visible: { opacity: 1, y: 0, transition: { ...t(0.7), delay: reduced ? 0 : 0.3 } },
        },
        list: {
            hidden: {},
            visible: {
                transition: {
                    staggerChildren: reduced ? 0 : stagger.base,
                    delayChildren: reduced ? 0 : 0.45,
                },
            },
        },
        item: {
            hidden: { opacity: 0, y: 14 },
            visible: { opacity: 1, y: 0, transition: t(0.7) },
        },
        divider: {
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: t(1, ease.mask) },
        },
    } satisfies Record<string, Variants>;
}

/**
 * Today's Specials dialog. Rendered into <body> through a portal, above the
 * navigation. While open: page scroll is locked, everything else is inert,
 * Tab stays inside, Escape and the backdrop close it; on close, focus
 * returns to whatever opened it.
 */
export default function TodaySpecialsModal({
    open,
    onClose,
    today,
    notice,
    dialogId,
    returnFocus,
}: TodaySpecialsModalProps) {
    const isClient = useIsClient();
    const rootRef = useRef<HTMLDivElement>(null);

    // Latest onClose for the listener, without re-running the effect.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    /* ---------- Scroll lock, inert background, keyboard, focus ---------- */
    useEffect(() => {
        const root = rootRef.current;
        if (!open || !root) return;

        // Set by the opener before `open` flips, so read it now.
        const opener = returnFocus.current;
        const body = document.body;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;

        // Compensate for the scrollbar so the page doesn't shift sideways.
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

        // Nothing behind the dialog can be focused, clicked or read.
        const background = Array.from(body.children).filter(
            (element): element is HTMLElement =>
                element instanceof HTMLElement &&
                element !== root &&
                !element.contains(root) &&
                !element.inert &&
                element.tagName !== "SCRIPT"
        );
        background.forEach((element) => (element.inert = true));

        // The dialog itself takes focus, so its title and description are
        // announced; Tab then reaches the close button.
        const panel = root.querySelector<HTMLElement>('[role="dialog"]');
        panel?.focus({ preventScroll: true });

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            // Keep Tab inside the dialog.
            if (event.key === "Tab" && root) {
                const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
                    (element) => element.offsetParent !== null
                );
                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                const active = document.activeElement;
                const inside = root.contains(active) && active !== panel;

                if (event.shiftKey && (active === first || !inside)) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && (active === last || !inside)) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            background.forEach((element) => (element.inert = false));
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;

            // Back to the trigger; the exit animation plays on without focus.
            if (opener?.isConnected) opener.focus({ preventScroll: true });
        };
    }, [open, returnFocus]);

    if (!isClient) return null;

    return createPortal(
        <AnimatePresence>
            {open ? (
                <SpecialsDialog
                    key="today-specials"
                    rootRef={rootRef}
                    onClose={onClose}
                    today={today}
                    notice={notice}
                    dialogId={dialogId}
                />
            ) : null}
        </AnimatePresence>,
        document.body
    );
}

type SpecialsDialogProps = Omit<TodaySpecialsModalProps, "open" | "returnFocus"> & {
    rootRef: RefObject<HTMLDivElement | null>;
};

function SpecialsDialog({ rootRef, onClose, today, notice, dialogId }: SpecialsDialogProps) {
    const reduced = usePrefersReducedMotion();
    const v = useMemo(() => makeVariants(reduced), [reduced]);

    const titleId = `${dialogId}-title`;
    const descriptionId = `${dialogId}-description`;
    const specials = today?.specials ?? [];
    const verified = today?.verified ?? false;

    return (
        <m.div
            ref={rootRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[120] flex items-center justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pt-[max(1.5rem,env(safe-area-inset-top))] md:px-[6.5vw] md:py-[6dvh] lg:px-[8vw]"
        >
            {/* BACKDROP — click to close */}
            <m.div
                aria-hidden="true"
                variants={v.backdrop}
                onClick={onClose}
                className="absolute inset-0 bg-midnight/80 backdrop-blur-md"
            />

            {/* DIALOG */}
            <m.div
                id={dialogId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                variants={v.panel}
                tabIndex={-1}
                className="relative flex max-h-full w-full max-w-[1320px] flex-col overflow-clip rounded-[20px] border border-champagne/35 bg-midnight shadow-[0_40px_120px_-24px_rgba(0,0,0,0.9)] outline-none md:h-[min(100%,860px,max(600px,56vw,62dvh))] md:flex-row"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close today's specials"
                    className="group focus-ring absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 bg-midnight/70 text-ivory transition-colors duration-300 hover:border-blossom hover:text-blossom sm:right-5 sm:top-5 md:right-6 md:top-6 md:h-12 md:w-12"
                >
                    <X aria-hidden="true" size={20} strokeWidth={1.4} className="transition-transform duration-500 group-hover:rotate-90" />
                </button>

                {/* LEFT — photograph and heading (a compact header on mobile) */}
                <div className="relative isolate shrink-0 overflow-clip md:h-full md:w-[40%] lg:w-[41.5%]">
                    <m.div variants={v.photo} className="absolute inset-0 -z-20">
                        <m.div variants={v.photoZoom} className="absolute inset-0">
                            <Image
                                src="/assets/story-main.png"
                                alt=""
                                fill
                                sizes="(min-width: 768px) 42vw, 100vw"
                                className="object-cover object-[50%_72%] md:object-center"
                            />
                        </m.div>
                    </m.div>

                    {/* Legibility: text sits on the dark upper half */}
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/90 via-midnight/70 to-midnight/90 md:via-midnight/75 md:via-55% md:to-midnight/15" />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-midnight/70 via-midnight/30 to-transparent md:block" />

                    {/* Blossom branch over the top-right corner */}
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-16 -z-10 h-48 w-48 rotate-[200deg] opacity-75 md:-right-16 md:-top-10 md:h-[300px] md:w-[300px] md:opacity-90">
                        <div className="cbg-sway absolute inset-0">
                            <Image src="/assets/story-blossom.png" alt="" fill sizes="300px" className="object-contain" />
                        </div>
                    </div>
                    <Petal className="left-[14%] top-[64%] rotate-[24deg]" size="sm" delay={-2} />
                    <Petal className="right-[18%] top-[46%] -rotate-12" delay={-5} />

                    <m.div variants={v.copy} className="relative px-6 pb-6 pt-7 pr-16 sm:px-9 sm:pb-8 md:px-[12%] md:pb-10 md:pt-[16%] lg:pt-[13%] [@media(max-height:560px)]:md:pt-9">
                        <m.p variants={v.fade} className="font-inter text-[10px] font-medium uppercase tracking-[0.26em] text-ivory/85 sm:text-[11px] sm:tracking-[0.34em]">
                            Cherry Blossom Garden
                        </m.p>


                        <h2
                            id={titleId}
                            className="mt-3 font-cormorant text-[38px] font-normal leading-[0.95] tracking-[-0.01em] sm:text-[46px] md:mt-6 md:text-[clamp(52px,min(6vw,10dvh),92px)] md:leading-[0.9]"
                        >
                            <span className="inline-block overflow-hidden pb-[0.08em] md:block">
                                <m.span variants={v.rise} className="block text-champagne">
                                    Today&rsquo;s
                                </m.span>
                            </span>{" "}
                            <span className="inline-block overflow-hidden pb-[0.08em] md:block">
                                <m.span variants={v.rise} className="block text-ivory">
                                    Specials
                                </m.span>
                            </span>
                        </h2>

                        <m.span variants={v.line} aria-hidden="true" className="mt-4 block h-px w-12 origin-left bg-champagne md:mt-8" />

                        <m.p
                            id={descriptionId}
                            variants={v.fade}
                            className="mt-4 max-w-[340px] font-inter text-[12.5px] leading-[1.7] text-ivory/85 sm:text-[13px] max-md:[@media(max-height:700px)]:hidden [@media(max-height:560px)]:hidden md:mt-8 md:text-[15px] lg:text-[16px]"
                        >
                            A handpicked selection of seasonal dishes, created with the freshest
                            ingredients and inspired by Asian flavours.
                        </m.p>
                    </m.div>
                </div>

                {/* RIGHT — badge and scrollable list */}
                <div className="relative flex min-h-0 flex-1 flex-col md:h-full">
                    {/* On mobile the neutral label would repeat the heading, so it shows only when verified */}
                    <div className={cn("shrink-0 px-5 pb-4 pt-5 sm:px-8 sm:pb-5 md:block md:px-[6%] md:pb-6 md:pr-24 md:pt-9", !verified && "hidden")}>
                        <m.p
                            variants={v.badge}
                            className="inline-flex h-10 items-center gap-3 rounded-full border border-blossom/30 bg-blossom/15 px-5 font-inter text-[10px] font-medium uppercase tracking-[0.28em] text-ivory sm:h-[52px] sm:gap-4 sm:px-7 sm:text-[12px]"
                        >
                            {verified ? "Available today only" : "Today’s Specials"}
                        </m.p>
                    </div>

                    <div
                        role="region"
                        aria-label="Specials list"
                        tabIndex={0}
                        className="scrollbar-elegant relative min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-champagne/15 px-5 focus-visible:-outline-offset-2 sm:px-8 md:ml-[6%] md:mr-3 md:px-0 md:pr-[5%]"
                    >
                        {specials.length ? (
                            <m.ul variants={v.list}>
                                {specials.map((special) => (
                                    <SpecialMenuItem
                                        key={special.id}
                                        special={special}
                                        variants={v.item}
                                        dividerVariants={v.divider}
                                    />
                                ))}
                            </m.ul>
                        ) : (
                            <p className="py-12 font-inter text-[14px] leading-relaxed text-ivory/75">
                                There are no specials today. Please ask our team about the
                                chef&rsquo;s suggestions when you visit.
                            </p>
                        )}

                        {notice ? (
                            <p className="pb-6 pt-5 font-inter text-[11px] text-ivory/60">{notice}</p>
                        ) : null}
                    </div>

                    {/* Blossom spray in the bottom-right corner */}
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-14 hidden h-44 w-44 -rotate-12 opacity-50 md:block">
                        <div className="cbg-sway absolute inset-0">
                            <Image src="/assets/story-blossom.png" alt="" fill sizes="176px" className="object-contain" />
                        </div>
                    </div>
                </div>
            </m.div>
        </m.div>
    );
}
