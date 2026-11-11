import type { Metadata } from "next";

import MenuContactCTA from "@/components/frontend/menu/menuContactCTA";
import MenuExplorer from "@/components/frontend/menu/menuExplorer";
import MenuHero from "@/components/frontend/menu/menuHero";
import TodaySpecialsProvider from "@/components/frontend/menu/todaySpecialsProvider";
import { menuCategories, menuItems, SAMPLE_MENU_NOTICE } from "@/data/menu";
import { dailySpecials, SAMPLE_SPECIALS_NOTICE } from "@/data/specials";
import { resolveSpecials } from "@/lib/frontend/specials";

export const metadata: Metadata = {
    title: "Menu | Cherry Blossom Garden",
    description:
        "Explore the Cherry Blossom Garden menu: handcrafted coffee, breakfast, small plates, mains, noodles, grill, sharing plates, desserts and drinks.",
};

export default function MenuPage() {
    // Joined on the server; the popup picks today's (Asia/Kathmandu) on the client.
    const specials = resolveSpecials(dailySpecials, menuItems);

    return (
        <div className="min-h-screen bg-midnight font-inter text-ivory">
            <TodaySpecialsProvider specials={specials} notice={SAMPLE_SPECIALS_NOTICE}>
                <MenuHero />

                <main id="main-content">
                    <MenuExplorer items={menuItems} categories={menuCategories} />

                    {/* Development notice — remove once real menu data is in place */}
                    <p className="mx-auto -mt-10 mb-12 max-w-[1500px] px-5 text-center font-inter text-[11px] text-ivory/60 sm:px-8 lg:px-12 xl:px-16">
                        {SAMPLE_MENU_NOTICE}
                    </p>

                    <MenuContactCTA />
                </main>
            </TodaySpecialsProvider>
        </div>
    );
}
