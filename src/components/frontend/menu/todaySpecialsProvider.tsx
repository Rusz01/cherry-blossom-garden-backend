"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { useRestaurantDate } from "@/hooks/frontend/useRestaurantDate";
import { specialsForDate } from "@/lib/frontend/specials";
import type { ResolvedSpecial } from "@/types/specials";
import TodaySpecialsModal from "./todaySpecialsModal";

/** Wait for the hero entrance before opening on first visit. */
const AUTO_OPEN_DELAY = 1400;
const SEEN_KEY = "cbg:today-specials-seen";

// Fallback when sessionStorage is blocked (private mode, disabled storage).
let seenInMemory = false;

function hasSeen() {
    try {
        return seenInMemory || window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
        return seenInMemory;
    }
}

function markSeen() {
    seenInMemory = true;
    try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
        // Memory fallback above is enough for this page view.
    }
}

type TodaySpecialsContextValue = {
    /** Open the popup; focus returns to `opener` on close. */
    openSpecials: (opener?: HTMLElement | null) => void;
    isOpen: boolean;
    dialogId: string;
};

const TodaySpecialsContext = createContext<TodaySpecialsContextValue | null>(null);

export function useTodaySpecials() {
    const context = useContext(TodaySpecialsContext);
    if (!context) throw new Error("useTodaySpecials must be used inside <TodaySpecialsProvider>.");

    return context;
}

type TodaySpecialsProviderProps = {
    /** All active specials, joined with their menu items (see resolveSpecials). */
    specials: ResolvedSpecial[];
    notice?: string;
    children: ReactNode;
};

/**
 * Owns the Today's Specials popup for the menu page: one dialog instance,
 * its open state, and the first-visit-per-session auto open. Which specials
 * apply is decided on the client from the Asia/Kathmandu date, because the
 * page itself is prerendered.
 */
export default function TodaySpecialsProvider({ specials, notice, children }: TodaySpecialsProviderProps) {
    const date = useRestaurantDate();
    const today = useMemo(() => (date ? specialsForDate(specials, date) : null), [specials, date]);
    const [isOpen, setIsOpen] = useState(false);
    const returnFocus = useRef<HTMLElement | null>(null);
    const dialogId = useId();

    const openSpecials = useCallback((opener?: HTMLElement | null) => {
        returnFocus.current = opener ?? null;
        markSeen();
        setIsOpen(true);
    }, []);

    const closeSpecials = useCallback(() => setIsOpen(false), []);

    // First visit in this browser session, and only when there is something to show.
    const hasSpecials = Boolean(today?.specials.length);
    useEffect(() => {
        if (!hasSpecials || hasSeen()) return;

        const timer = window.setTimeout(() => {
            if (hasSeen()) return;
            const active = document.activeElement;
            openSpecials(active instanceof HTMLElement && active !== document.body ? active : null);
        }, AUTO_OPEN_DELAY);

        return () => window.clearTimeout(timer);
    }, [hasSpecials, openSpecials]);

    const value = useMemo(() => ({ openSpecials, isOpen, dialogId }), [openSpecials, isOpen, dialogId]);

    return (
        <TodaySpecialsContext.Provider value={value}>
            {children}
            <TodaySpecialsModal
                open={isOpen}
                onClose={closeSpecials}
                today={today}
                notice={notice}
                dialogId={dialogId}
                returnFocus={returnFocus}
            />
        </TodaySpecialsContext.Provider>
    );
}
