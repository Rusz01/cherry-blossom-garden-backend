"use client";

import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import LayoutMotion from "@/components/frontend/motion/layoutMotion";
import Container from "@/components/frontend/ui/container";
import { usePrefersReducedMotion } from "@/hooks/frontend/usePrefersReducedMotion";
import { buildMenu, MENU_PAGE_SIZE } from "@/lib/frontend/menu";
import type { DietFilter, MenuCategory, MenuItem, MenuSortKey, MenuView } from "@/types/menu";
import MenuCategorySection from "./menuCategorySection";
import MenuDietaryFilters from "./menuDietaryFilters";
import MenuEmptyState from "./menuEmptyState";
import MenuPagination from "./menuPagination";
import MenuPromoCard from "./menuPromoCard";
import MenuSearch from "./menuSearch";
import MenuSidebar, { MenuCategoryChips } from "./menuSidebar";
import MenuSort from "./menuSort";

type MenuExplorerProps = {
    items: MenuItem[];
    categories: MenuCategory[];
    pageSize?: number;
};

/**
 * The interactive menu: search, dietary filter, category view, sort and
 * pagination all combine through one pure function (buildMenu), so any
 * combination works and every count is derived from the data.
 * Only the current page renders, so the page stays fast at 500+ items.
 */
export default function MenuExplorer({ items, categories, pageSize = MENU_PAGE_SIZE }: MenuExplorerProps) {
    const [query, setQuery] = useState("");
    const [diet, setDiet] = useState<DietFilter>("all");
    const [view, setView] = useState<MenuView>("all");
    const [sort, setSort] = useState<MenuSortKey>("popular");
    const [page, setPage] = useState(1);
    const reduced = usePrefersReducedMotion();
    const headingRef = useRef<HTMLDivElement>(null);

    // Typing stays instant; filtering catches up a frame later.
    const deferredQuery = useDeferredValue(query);

    const menu = useMemo(
        () => buildMenu(items, categories, { query: deferredQuery, diet, view, sort, page, pageSize }),
        [items, categories, deferredQuery, diet, view, sort, page, pageSize]
    );

    const scrollToMenu = () => {
        headingRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    };

    // Any change to what is shown starts again from page one.
    const changeQuery = (value: string) => {
        setQuery(value);
        setPage(1);
    };
    const changeDiet = (value: DietFilter) => {
        setDiet(value);
        setPage(1);
    };
    const changeSort = (value: MenuSortKey) => {
        setSort(value);
        setPage(1);
    };
    const changeView = (value: MenuView, scroll = false) => {
        setView(value);
        setPage(1);
        if (scroll) scrollToMenu();
    };
    const changePage = (value: number) => {
        setPage(value);
        scrollToMenu();
    };
    const clearAll = () => {
        setQuery("");
        setDiet("all");
        setView("all");
        setPage(1);
    };

    const category = categories.find((c) => c.id === view);
    const title = view === "all" ? "All Menu" : view === "signature" ? "Signature Flavours" : category?.label ?? "Menu";
    const description =
        view === "all"
            ? "Discover our complete selection of food and drinks."
            : view === "signature"
                ? "Handpicked dishes loved by our guests."
                : category?.description ?? "";

    const total = menu.ordered.length;
    const firstShown = total ? (menu.page - 1) * pageSize + 1 : 0;
    const lastShown = Math.min(menu.page * pageSize, total);
    // Re-key the list on view-level changes so the new set eases in; typing
    // in the search keeps rows mounted (no flicker while searching).
    const listKey = `${view}|${diet}|${sort}|${menu.page}`;

    // Running row index per section, so the entrance stagger flows across sections.
    const sectionStarts = menu.sections.map((_, i) =>
        menu.sections.slice(0, i).reduce((sum, s) => sum + s.items.length, 0)
    );

    return (
        <LayoutMotion>
            <section aria-label="Menu" className="relative pb-20 pt-5 lg:pb-24 lg:pt-6">
                <Container>
                    {/* SEARCH + DIETARY FILTERS */}
                    <div className="cbg-enter flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5" style={{ animationDelay: "0.9s" }}>
                        <MenuSearch value={query} onChange={changeQuery} />
                        <MenuDietaryFilters value={diet} onChange={changeDiet} />
                    </div>

                    {/* Small screens: categories as chips */}
                    <div className="mt-6 md:hidden">
                        <MenuCategoryChips categories={categories} view={view} counts={menu.counts} onSelect={(v) => changeView(v)} />
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-[220px_minmax(0,1fr)] lg:mt-10 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)] xl:gap-10">
                        {/* SIDEBAR */}
                        <aside className="hidden md:block">
                            <div className="sticky top-6 space-y-6">
                                <MenuSidebar categories={categories} view={view} counts={menu.counts} onSelect={(v) => changeView(v, true)} />
                                <MenuPromoCard count={menu.counts.signature} onExplore={() => changeView("signature", true)} />
                            </div>
                        </aside>

                        {/* MENU CONTENT */}
                        <div className="min-w-0">
                            <div ref={headingRef} className="flex scroll-mt-6 flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-champagne/25 pb-5">
                                <div>
                                    <h2 className="flex items-center gap-3 font-cormorant text-[40px] font-normal leading-none text-ivory sm:text-[44px]">
                                        {view === "signature" ? (
                                            <Sparkles aria-hidden="true" size={26} strokeWidth={1.2} className="text-champagne" />
                                        ) : null}
                                        {title}
                                    </h2>
                                    <p className="mt-2 font-inter text-[13px] text-ivory/70">{description}</p>
                                </div>

                                <MenuSort value={sort} onChange={changeSort} />
                            </div>

                            {/* Announces results to screen readers as filters change */}
                            <p aria-live="polite" className="sr-only">
                                {total
                                    ? `Showing ${firstShown} to ${lastShown} of ${total} dishes${menu.pageCount > 1 ? `, page ${menu.page} of ${menu.pageCount}` : ""}.`
                                    : "No dishes match your search."}
                            </p>

                            {total ? (
                                <div key={listKey} className="mt-6 space-y-6">
                                    {menu.sections.map((section, index) => (
                                        <MenuCategorySection
                                            key={section.category.id}
                                            section={section}
                                            focused={view === section.category.id}
                                            startIndex={sectionStarts[index]}
                                            onViewAll={() => changeView(section.category.id, true)}
                                            onBackToAll={() => changeView("all", true)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-8">
                                    <MenuEmptyState onClear={clearAll} />
                                </div>
                            )}

                            <div className="mt-10">
                                <MenuPagination page={menu.page} pageCount={menu.pageCount} onChange={changePage} />
                            </div>

                            {/* The promo card follows the menu on small screens */}
                            <MenuPromoCard
                                className="mt-12 md:hidden"
                                count={menu.counts.signature}
                                onExplore={() => changeView("signature", true)}
                            />
                        </div>
                    </div>
                </Container>
            </section>
        </LayoutMotion>
    );
}
