
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ArrowUpRight,
    ChevronDown,
    Menu,
    X,
} from "lucide-react";

const floorLinks = [
    {
        number: "01",
        label: "Ground Floor",
        description: "Café & Family Space",
        href: "/explore/ground-floor",
    },
    {
        number: "02",
        label: "First Floor",
        description: "Dining & Entertainment",
        href: "/explore/dining-entertainment",
    },
    {
        number: "03",
        label: "Second Floor",
        description: "Rooftop BBQ & Events",
        href: "/explore/rooftop-bbq-events",
    },
];

const mobileLinks = [
    { label: "Explore", href: "/#three-levels" },
    { label: "Menu", href: "/menu" },
    { label: "Experience", href: "/experiences" },
    { label: "Kids & Family", href: "/kids-play" },
    { label: "Gallery", href: "/gallery" },
];

/*
 * The navbar remounts on every route (each page renders it), so its
 * entrance plays only on the first document load — never on client-side
 * navigation, where it would only slow the page down.
 */
let entrancePlayed = false;

const desktopLinks = [
    { label: "Menu", href: "/menu" },
    { label: "Experience", href: "/experiences" },
    { label: "Kids & Family", href: "/kids-play" },
    { label: "Gallery", href: "/gallery" },
];

/* Shared look for desktop items: colour shift plus an underline that draws
   from the left on hover/focus and stays drawn for the current page. */
const desktopLinkClass = (active: boolean) => `
    group/nav relative inline-flex items-center gap-2 py-1
    font-inter text-inherit transition-colors duration-300
    hover:text-blossom focus-visible:text-blossom
    ${active ? "text-blossom" : ""}
`;

function NavUnderline({ active }: { active: boolean }) {
    return (
        <span
            aria-hidden="true"
            className={`
                pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left bg-blossom
                transition-transform duration-500 ease-brand
                group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100
                ${active ? "scale-x-100" : "scale-x-0"}
            `}
        />
    );
}

export default function Navbar({
                                   light = false,
                               }: {
    light?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);
    const [mobileExploreOpen, setMobileExploreOpen] =
        useState(false);

    const pathname = usePathname();
    // Server and first client render agree (false → class present); later
    // mounts skip the entrance.
    const [playEntrance] = useState(() => !entrancePlayed);
    useEffect(() => {
        entrancePlayed = true;
    }, []);
    const enter = (delay: number) =>
        playEntrance
            ? { className: "cbg-enter-fade", style: { animationDelay: `${delay}s`, animationDuration: "700ms" } }
            : { className: "", style: undefined };

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const exploreButtonRef = useRef<HTMLButtonElement>(null);
    const exploreRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
                setMobileExploreOpen(false);
                menuButtonRef.current?.focus();
                return;
            }

            // Keep Tab inside the open menu.
            if (event.key === "Tab" && mobileMenuRef.current) {
                const focusable = Array.from(
                    mobileMenuRef.current.querySelectorAll<HTMLElement>(
                        'a[href], button:not([disabled])'
                    )
                ).filter((element) => !element.closest("[inert]"));
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
        };

        const media = window.matchMedia("(min-width: 1024px)");

        const handleDesktop = () => {
            if (media.matches) {
                setIsOpen(false);
                setMobileExploreOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        media.addEventListener("change", handleDesktop);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            media.removeEventListener("change", handleDesktop);
        };
    }, [isOpen]);

    // Desktop dropdown: close on outside click or Escape.
    useEffect(() => {
        if (!exploreOpen) return;

        const handleOutsideClick = (event: PointerEvent) => {
            if (
                exploreRef.current &&
                !exploreRef.current.contains(event.target as Node)
            ) {
                setExploreOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setExploreOpen(false);
                exploreButtonRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleOutsideClick
            );
            document.removeEventListener("keydown", handleEscape);
        };
    }, [exploreOpen]);

    const closeMenu = () => {
        setIsOpen(false);
        setMobileExploreOpen(false);
    };

    // Closing with the × returns focus to the button that opened the menu.
    const closeMenuAndReturn = () => {
        closeMenu();
        menuButtonRef.current?.focus();
    };

    const exploreActive = pathname?.startsWith("/explore") ?? false;

    return (
        <header
            className={`
    relative z-50 mt-4 font-inter lg:py-6
    ${
                light
                    ? "text-charcoal"
                    : "text-ivory"
            }
  `}
        >

            {/* ===========================================
          DESKTOP NAVBAR — ORIGINAL DESIGN
          =========================================== */}
            <div className="hidden items-center justify-evenly lg:flex">
                <div {...enter(0.05)}>
                    <Link href="/" className="group/logo block rounded-sm">
                        <Image
                            src="/Cherry-Blossom-Garden-Logo.png"
                            alt="Cherry Blossom Garden Logo"
                            width={190}
                            height={76}
                            className={`
    h-auto w-38
    transition-[opacity,scale,filter] duration-500 ease-brand
    group-hover/logo:scale-[1.03] group-hover/logo:brightness-110
  `}
                        />
                    </Link>
                </div>

                <div {...enter(0.15)}>
                    <nav aria-label="Main navigation">
                        <ul className="flex justify-center gap-8">

                            {/* EXPLORE DROPDOWN */}
                            <li
                                ref={exploreRef}
                                className="relative"
                                onMouseEnter={() => setExploreOpen(true)}
                                onMouseLeave={() => setExploreOpen(false)}
                                onBlur={(event) => {
                                    if (
                                        !event.currentTarget.contains(
                                            event.relatedTarget as Node | null
                                        )
                                    ) {
                                        setExploreOpen(false);
                                    }
                                }}
                            >
                                <button
                                    ref={exploreButtonRef}
                                    type="button"
                                    onClick={() =>
                                        setExploreOpen((previous) => !previous)
                                    }
                                    aria-expanded={exploreOpen}
                                    aria-controls="desktop-explore-dropdown"
                                    className={`${desktopLinkClass(exploreActive || exploreOpen)} focus-ring`}
                                >
                                    Explore
                                    <NavUnderline active={exploreActive || exploreOpen} />

                                    <ChevronDown
                                        size={14}
                                        strokeWidth={1.5}
                                        className={`
                      transition-transform duration-300
                      ${exploreOpen ? "rotate-180" : ""}
                    `}
                                    />
                                </button>

                                {/* Dropdown */}
                                <div
                                    id="desktop-explore-dropdown"
                                    inert={!exploreOpen}
                                    className={`
                    absolute left-1/2 top-full z-50
                    w-[350px] -translate-x-1/2 pt-5
                    origin-top
                    transition-[translate,scale,opacity,visibility] duration-400
                    ease-brand
                    motion-reduce:transition-none
                    ${
                                        exploreOpen
                                            ? "visible translate-y-0 scale-100 opacity-100"
                                            : "invisible pointer-events-none translate-y-2 scale-[0.98] opacity-0"
                                    }
                  `}
                                >
                                    <div
                                        className="
                      relative overflow-hidden
                      border border-champagne/25
                      bg-[#101113]/95 p-3
                      shadow-[0_24px_65px_rgba(0,0,0,0.4)]
                      backdrop-blur-xl
                    "
                                    >
                                        {/* Top accent */}
                                        <div
                                            className={`absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-r from-transparent via-blossom/70 to-transparent transition-transform duration-700 ease-brand ${
                                                exploreOpen ? "scale-x-100" : "scale-x-0"
                                            }`}
                                        />

                                        {/* Dropdown heading */}
                                        <div className="px-4 pb-4 pt-3">
                                            <p className="font-inter text-[9px] font-semibold uppercase tracking-[0.3em] text-blossom">
                                                Discover Our Spaces
                                            </p>

                                            <p className="mt-2 font-inter text-[17px] font-medium leading-snug text-ivory">
                                                Three Unique Experiences
                                            </p>
                                        </div>

                                        <div className="h-px bg-champagne/15" />

                                        {/* Three floors */}
                                        <div className="py-2">
                                            {floorLinks.map((floor, floorIndex) => (
                                                <Link
                                                    key={floor.number}
                                                    href={floor.href}
                                                    onClick={() => setExploreOpen(false)}
                                                    // Floors follow the panel in, one after another.
                                                    style={{ transitionDelay: exploreOpen ? `${80 + floorIndex * 60}ms` : "0ms" }}
                                                    className={`
                            group/floor flex items-center
                            gap-4 px-4 py-4
                            transition-[background-color,opacity,translate] duration-500 ease-brand
                            hover:bg-blossom/[0.07]
                            focus-visible:bg-blossom/[0.07]
                            focus-visible:outline-none
                            motion-reduce:transition-none
                            ${exploreOpen ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"}
                          `}
                                                >
                          <span className="self-start pt-1 font-inter text-[10px] tracking-[0.1em] text-blossom/75">
                            {floor.number}
                          </span>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-inter text-[14px] font-medium leading-tight text-ivory transition-colors duration-300 group-hover/floor:text-blossom">
                                                            {floor.label}
                                                        </p>

                                                        <p className="mt-2 font-inter text-[10px] tracking-[0.03em] text-ivory/45">
                                                            {floor.description}
                                                        </p>
                                                    </div>

                                                    <ArrowUpRight
                                                        size={16}
                                                        strokeWidth={1.4}
                                                        className="
                              shrink-0 text-ivory/30
                              transition-all duration-300
                              group-hover/floor:-translate-y-0.5
                              group-hover/floor:translate-x-0.5
                              group-hover/floor:text-blossom
                            "
                                                    />
                                                </Link>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="border-t border-champagne/15 px-4 py-3">
                                            <p className="font-inter text-[11px] italic text-blossom/75">
                                                Where moments bloom.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* ORIGINAL NAVIGATION LINKS ("Menu" replaces "Food & Drinks"). */}
                            {desktopLinks.map((link) => {
                                const active = !link.href.includes("#") && pathname === link.href;

                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            aria-current={active ? "page" : undefined}
                                            className={`${desktopLinkClass(active)} focus-ring`}
                                        >
                                            {link.label}
                                            <NavUnderline active={active} />
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div {...enter(0.25)}>
                    {/* Blossom fill sweeps in from the left on hover/focus. */}
                    <Link
                        href="/reservation"
                        aria-current={pathname === "/reservation" ? "page" : undefined}
                        className="
                          focus-ring relative isolate inline-block overflow-hidden
                          border-1 border-blossom px-6 py-3 text-blossom
                          transition-colors duration-500 ease-brand
                          before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0
                          before:bg-blossom before:transition-transform before:duration-500 before:ease-brand
                          hover:text-midnight hover:before:scale-x-100
                          focus-visible:text-midnight focus-visible:before:scale-x-100
                          active:scale-[0.98]
                        "
                    >
                        Reserve A Table
                    </Link>
                </div>
            </div>

            {/* ===========================================
          MOBILE / TABLET NAVBAR — ORIGINAL DESIGN
          =========================================== */}
            <div className="flex items-center justify-between border-b border-champagne/15 px-5 pb-4 sm:px-8 lg:hidden">

                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Cherry Blossom Garden homepage"
                    className={`relative z-10 transition-opacity duration-300 active:opacity-80 ${enter(0.05).className}`}
                    style={enter(0.05).style}
                >
                    <Image
                        src="/Cherry-Blossom-Garden-Logo.png"
                        alt="Cherry Blossom Garden"
                        width={170}
                        height={70}
                        priority
                        className={`
    h-auto w-[125px] sm:w-[145px]
  `}
                    />
                </Link>

                {/* Menu Trigger */}
                <button
                    ref={menuButtonRef}
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open navigation menu"
                    aria-controls="mobile-navigation"
                    aria-expanded={isOpen}
                    className={`
  group flex h-11 w-11 items-center justify-center
  border transition-all duration-300
  active:scale-95
  ${
                        light
                            ? "text-[#302c28] hover:border-blossom hover:bg-[#f6e7e3]"
                            : "border-champagne/35 text-ivory hover:border-blossom hover:bg-blossom/10"
                    }
`}
                >
                    <Menu
                        size={22}
                        strokeWidth={1.4}
                        className="transition-transform duration-300 group-hover:scale-110"
                    />
                </button>
            </div>

            {/* ===========================================
          ANIMATED MOBILE NAVIGATION OVERLAY
          =========================================== */}
            <div
                ref={mobileMenuRef}
                id="mobile-navigation"
                role="dialog"
                aria-modal={isOpen}
                aria-label="Mobile navigation"
                aria-hidden={!isOpen}
                inert={!isOpen}
                className={`
          fixed inset-0 z-[100] overflow-y-auto
          bg-[#0b0d0e] text-ivory lg:hidden
          transition-[clip-path,opacity] ease-mask
          motion-reduce:transition-none
          ${
                    isOpen
                        ? "[clip-path:inset(0_0_0_0)] opacity-100 duration-700"
                        : "pointer-events-none [clip-path:inset(0_0_100%_0)] opacity-0 duration-400"
                }
        `}
            >
                {/* Atmospheric Gradient */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
              radial-gradient(
                ellipse at 90% 22%,
                rgba(198, 123, 138, 0.12) 0%,
                transparent 50%
              ),
              radial-gradient(
                ellipse at 4% 100%,
                rgba(197, 160, 106, 0.07) 0%,
                transparent 45%
              )
            `,
                    }}
                />

                {/* Decorative vertical line */}
                <div className="pointer-events-none absolute bottom-0 right-[12%] top-0 hidden w-px bg-gradient-to-b from-transparent via-champagne/10 to-transparent sm:block" />

                <div className="relative mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))] sm:px-10">

                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            onClick={closeMenu}
                            aria-label="Cherry Blossom Garden homepage"
                        >
                            <Image
                                src="/Cherry-Blossom-Garden-Logo.png"
                                alt="Cherry Blossom Garden"
                                width={170}
                                height={70}
                                className={`
    h-auto w-[125px] sm:w-[145px]
  `}
                            />
                        </Link>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={closeMenuAndReturn}
                            className="group flex h-11 w-11 items-center justify-center border border-champagne/35 text-ivory transition-all duration-300 hover:border-blossom hover:bg-blossom/10 active:scale-95"
                        >
                            <X
                                size={22}
                                strokeWidth={1.4}
                                className="transition-transform duration-500 group-hover:rotate-90"
                            />
                        </button>
                    </div>

                    {/* Navigation Content */}
                    <div className="mt-12 sm:mt-16">

                        {/* Eyebrow */}
                        <div
                            className={`
                mb-6 flex items-center gap-3
                transition-all duration-700 delay-100
                motion-reduce:transition-none
                ${
                                isOpen
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                            }
              `}
                        >
                            <span className="h-px w-8 bg-blossom" />

                            <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.3em] text-blossom">
                                Discover Our World
                            </p>
                        </div>

                        {/* Animated Navigation Links */}
                        <nav aria-label="Mobile main navigation">
                            <ul>
                                {mobileLinks.map((link, index) => (
                                    <li
                                        key={link.label}
                                        className="border-b border-ivory/10"
                                    >
                                        {link.label === "Explore" ? (
                                            <>
                                                {/* EXPLORE ACCORDION TRIGGER */}
                                                <button
                                                    type="button"
                                                    aria-expanded={mobileExploreOpen}
                                                    aria-controls="mobile-explore-dropdown"
                                                    onClick={() =>
                                                        setMobileExploreOpen((previous) => !previous)
                                                    }
                                                    style={{
                                                        transitionDelay: isOpen
                                                            ? `${150 + index * 75}ms`
                                                            : "0ms",
                                                    }}
                                                    className={`
                            group flex w-full items-center
                            justify-between gap-5 py-3
                            text-left
                            transition-all duration-700
                            ease-brand
                            motion-reduce:transition-none
                            ${
                                                        isOpen
                                                            ? "translate-y-0 opacity-100"
                                                            : "translate-y-6 opacity-0"
                                                    }
                          `}
                                                >
                                                    <div className="flex items-baseline gap-4">
                            <span className="font-inter text-[10px] tracking-wider text-blossom/70">
                              01
                            </span>

                                                        <span className="font-inter text-[clamp(2.2rem,7vw,3.8rem)] leading-[1.05] font-normal text-ivory transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-blossom">
                              Explore
                            </span>
                                                    </div>

                                                    <ChevronDown
                                                        size={21}
                                                        strokeWidth={1.2}
                                                        className={`
                              shrink-0 text-ivory/35
                              transition-all duration-300
                              group-hover:text-blossom
                              ${
                                                            mobileExploreOpen
                                                                ? "rotate-180 text-blossom"
                                                                : ""
                                                        }
                            `}
                                                    />
                                                </button>

                                                {/* EXPANDABLE FLOOR LINKS */}
                                                <div
                                                    id="mobile-explore-dropdown"
                                                    inert={!mobileExploreOpen}
                                                    className={`
                            grid
                            transition-[grid-template-rows,opacity]
                            duration-500
                            ease-brand
                            motion-reduce:transition-none
                            ${
                                                        mobileExploreOpen
                                                            ? "grid-rows-[1fr] opacity-100"
                                                            : "grid-rows-[0fr] opacity-0"
                                                    }
                          `}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div className="mb-5 ml-8 border-l border-champagne/25 pl-5 sm:ml-10 sm:pl-7">

                                                            <p className="mb-2 mt-4 font-inter text-[9px] font-semibold uppercase tracking-[0.25em] text-blossom">
                                                                Discover Our Spaces
                                                            </p>

                                                            <p className="mb-4 font-inter text-[12px] text-ivory/55">
                                                                Three Unique Experiences
                                                            </p>

                                                            {floorLinks.map((floor) => (
                                                                <Link
                                                                    key={floor.number}
                                                                    href={floor.href}
                                                                    onClick={closeMenu}
                                                                    className="
                                    group/floor flex items-center
                                    justify-between gap-3
                                    border-t border-ivory/10
                                    py-4
                                  "
                                                                >
                                                                    <div className="flex items-start gap-4">
                                    <span className="pt-0.5 font-inter text-[9px] tracking-wider text-blossom/65">
                                      {floor.number}
                                    </span>

                                                                        <div>
                                                                            <p className="font-inter text-[15px] font-medium leading-tight text-ivory transition-colors duration-300 group-hover/floor:text-blossom">
                                                                                {floor.label}
                                                                            </p>

                                                                            <p className="mt-2 font-inter text-[10px] tracking-[0.04em] text-ivory/40">
                                                                                {floor.description}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <ArrowUpRight
                                                                        size={17}
                                                                        strokeWidth={1.3}
                                                                        className="shrink-0 text-ivory/30 transition-colors group-hover/floor:text-blossom"
                                                                    />
                                                                </Link>
                                                            ))}

                                                            <p className="mt-2 font-inter text-[11px] italic text-blossom/70">
                                                                Where moments bloom.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* ORIGINAL MOBILE LINKS */
                                            <Link
                                                href={link.href}
                                                onClick={closeMenu}
                                                aria-current={!link.href.includes("#") && pathname === link.href ? "page" : undefined}
                                                style={{
                                                    transitionDelay: isOpen
                                                        ? `${150 + index * 75}ms`
                                                        : "0ms",
                                                }}
                                                className={`
                          group flex items-center justify-between
                          gap-5 py-3
                          transition-all duration-700
                          ease-brand
                          motion-reduce:transition-none
                          ${
                                                    isOpen
                                                        ? "translate-y-0 opacity-100"
                                                        : "translate-y-6 opacity-0"
                                                }
                        `}
                                            >
                                                <div className="flex items-baseline gap-4">
                          <span className="font-inter text-[10px] tracking-wider text-blossom/70">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                                                    <span className={`font-inter text-[clamp(2.2rem,7vw,3.8rem)] leading-[1.05] font-normal transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-blossom ${
                                                        !link.href.includes("#") && pathname === link.href ? "text-blossom" : "text-ivory"
                                                    }`}>
                            {link.label}
                          </span>
                                                </div>

                                                <ArrowUpRight
                                                    size={21}
                                                    strokeWidth={1.2}
                                                    className="shrink-0 text-ivory/35 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blossom"
                                                />
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Bottom Section */}
                    <div
                        className={`
              mt-auto pt-9
              transition-all duration-700 delay-500
              motion-reduce:transition-none
              ${
                            isOpen
                                ? "translate-y-0 opacity-100"
                                : "translate-y-5 opacity-0"
                        }
            `}
                    >
                        {/* Reservation CTA */}
                        <Link
                            href="/reservation"
                            onClick={closeMenu}
                            className="group flex w-full items-center justify-between bg-blossom px-6 py-4 font-inter text-[11px] font-semibold uppercase tracking-[0.17em] text-midnight transition-colors duration-300 hover:bg-ivory"
                        >
                            Reserve A Table

                            <ArrowUpRight
                                size={19}
                                strokeWidth={1.5}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                        </Link>

                        {/* Signature */}
                        <div className="flex items-center justify-between gap-4 pt-7">
                            <p className="font-inter text-[26px] italic text-blossom/80">
                                Where moments bloom.
                            </p>

                            <span className="font-inter text-[9px] uppercase tracking-[0.18em] text-ivory/35">
                Cherry Blossom Garden
              </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
