import type { DailySpecial } from "@/types/specials";

/*
 * =====================================================================
 *  SAMPLE SPECIALS — DEVELOPMENT DATA ONLY
 * ---------------------------------------------------------------------
 *  These specials feature sample dishes from src/data/menu.ts. Their
 *  descriptions, prices and availability are placeholders, NOT the
 *  restaurant's confirmed specials.
 *
 *  None of them has `availableOn`, so the popup shows them under the
 *  neutral "Today's Specials" label. To schedule a real special, give it
 *  restaurant-local dates (Asia/Kathmandu), e.g.
 *      availableOn: ["2026-10-27"]
 *  On those dates only the scheduled specials are shown, and the popup
 *  says "Available today only".
 *
 *  Replace this array with confirmed data (or a CMS / API response of the
 *  same shape); the popup needs no other change.
 * =====================================================================
 */

export const SAMPLE_SPECIALS_NOTICE =
    "Sample specials for development — dishes, prices and availability are not yet confirmed.";

export const dailySpecials: DailySpecial[] = [
    {
        id: "special-cherry-blossom-prawns",
        menuItemId: "cherry-blossom-prawns",
        description: "Pan-seared prawns with a delicate cherry blossom glaze, served with seasonal greens.",
        currency: "NPR",
        chefsChoice: true,
        active: true,
        order: 1,
    },
    {
        id: "special-yuzu-salmon",
        menuItemId: "yuzu-salmon",
        description: "Grilled salmon with yuzu sauce, pickled vegetables and sesame.",
        currency: "NPR",
        active: true,
        order: 2,
    },
    {
        id: "special-truffle-mushroom-rice",
        menuItemId: "truffle-mushroom-rice",
        description: "Fragrant rice with wild mushrooms, truffle oil and fresh herbs.",
        currency: "NPR",
        active: true,
        order: 3,
    },
    {
        id: "special-spicy-tuna-roll",
        menuItemId: "spicy-tuna-roll",
        description: "Fresh tuna, avocado and cucumber topped with spicy mayo.",
        currency: "NPR",
        active: true,
        order: 4,
    },
    {
        id: "special-matcha-tiramisu",
        menuItemId: "matcha-tiramisu",
        description: "Layers of matcha, mascarpone and ladyfingers.",
        currency: "NPR",
        active: true,
        order: 5,
    },
    {
        id: "special-mango-sake",
        menuItemId: "mango-sake",
        description: "Refreshing blend of mango, sake and citrus.",
        currency: "NPR",
        isNew: true,
        active: true,
        order: 6,
    },
];
