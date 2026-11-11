"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import styles from "@/app/privacy-policy/privacyPolicy.module.css";

type ContentsItem = {
    id: string;
    title: string;
};

/**
 * Sticky table of contents with an active-section indicator.
 * Links are plain anchors: the browser handles scrolling (smooth when
 * motion is allowed), the URL hash, history and focus. This component only
 * watches which section is being read and moves a hairline beside it.
 */
export default function PolicyContents({ sections }: { sections: ContentsItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);
    const navRef = useRef<HTMLElement>(null);

    // Which section is in the reading band (upper third of the viewport).
    useEffect(() => {
        const elements = sections
            .map((section) => document.getElementById(section.id))
            .filter((element): element is HTMLElement => Boolean(element));

        const visible = new Set<string>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) visible.add(entry.target.id);
                    else visible.delete(entry.target.id);
                });

                // First section in document order wins; keep the last one
                // while scrolling through the gaps between sections.
                const current = sections.find((section) => visible.has(section.id));
                if (current) setActiveId(current.id);
            },
            { rootMargin: "-18% 0px -62% 0px" }
        );

        elements.forEach((element) => observer.observe(element));

        // A hash in the URL (deep link or history) marks its section at once.
        const syncHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (sections.some((section) => section.id === id)) setActiveId(id);
        };
        syncHash();
        window.addEventListener("hashchange", syncHash);

        return () => {
            observer.disconnect();
            window.removeEventListener("hashchange", syncHash);
        };
    }, [sections]);

    // Measure the active link so the indicator can glide to it.
    useLayoutEffect(() => {
        const nav = navRef.current;
        const link = activeId
            ? nav?.querySelector<HTMLElement>(`a[href="#${activeId}"]`)
            : null;

        if (!nav || !link) return;

        const measure = () => setIndicator({ top: link.offsetTop, height: link.offsetHeight });
        measure();

        const resize = new ResizeObserver(measure);
        resize.observe(nav);

        return () => resize.disconnect();
    }, [activeId]);

    return (
        <nav ref={navRef} aria-label="Privacy policy contents" className={styles.contentsNav}>
            <span
                aria-hidden="true"
                className={styles.sidebarIndicator}
                style={
                    indicator
                        ? { transform: `translateY(${indicator.top}px)`, height: indicator.height, opacity: 1 }
                        : undefined
                }
            />

            {sections.map((section, index) => (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={styles.sidebarLink}
                    aria-current={activeId === section.id ? "location" : undefined}
                >
                    <span className={styles.sidebarNumber}>
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.sidebarTitle}>{section.title}</span>
                </a>
            ))}
        </nav>
    );
}
