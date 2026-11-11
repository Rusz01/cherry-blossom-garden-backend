import type { MenuCategory, MenuItem } from "@/types/menu";

/*
 * =====================================================================
 *  SAMPLE MENU — DEVELOPMENT DATA ONLY
 * ---------------------------------------------------------------------
 *  These dishes, descriptions, prices, ingredients and dietary details
 *  are placeholders for building and testing the /menu page. They are
 *  NOT the restaurant's verified menu, prices or allergen information.
 *
 *  Exceptions: Sakura Roll, Miso Glazed Salmon, Matcha Blossom and
 *  Sakura King Prawns reuse the dishes already shown on the homepage
 *  ("A Taste of the Garden"). The six dishes featured in Today's
 *  Specials (src/data/specials.ts) are sample menu items like the rest.
 *
 *  Before launch, replace `menuItems` with confirmed data (or load it
 *  from a CMS) and have dietary/allergen details checked by the kitchen.
 *  The page derives counts, filters, sorting and pagination from this
 *  data, so nothing else needs to change.
 * =====================================================================
 */

export const SAMPLE_MENU_NOTICE =
    "Sample menu for development — dishes, prices and dietary details are not yet confirmed.";

export const menuCategories: MenuCategory[] = [
    { id: "coffee", label: "Coffee", description: "Espresso classics, lattes and slow-brewed favourites." },
    { id: "breakfast", label: "Breakfast", description: "Morning plates to start the day beautifully." },
    { id: "small-plates", label: "Small Plates", description: "Light bites made for sharing and grazing." },
    { id: "mains", label: "Mains", description: "Our signature dishes and generous main plates." },
    { id: "noodles-rice", label: "Noodles & Rice", description: "Comforting bowls of noodles and rice." },
    { id: "grill-bbq", label: "Grill & BBQ", description: "Flame-grilled favourites from the rooftop." },
    { id: "sharing", label: "Sharing", description: "Platters and boards for the whole table." },
    { id: "desserts", label: "Desserts", description: "Sweet endings inspired by the season." },
    { id: "drinks", label: "Drinks", description: "Juices, teas, sake and handcrafted drinks." },
];

export const menuItems: MenuItem[] = [
    /* ---------- Coffee ---------- */
    { id: "espresso", name: "Espresso", description: "Single shot, rich and bold", price: 2.5, category: "coffee", ingredients: ["espresso"], dietary: { glutenFree: true }, popularity: 70 },
    { id: "americano", name: "Americano", description: "Smooth and balanced", price: 2.8, category: "coffee", ingredients: ["espresso", "hot water"], dietary: { glutenFree: true }, popularity: 66 },
    { id: "cappuccino", name: "Cappuccino", description: "Espresso, steamed milk, velvety foam", price: 3.8, category: "coffee", ingredients: ["espresso", "milk"], dietary: { vegetarian: true }, popularity: 92 },
    { id: "flat-white", name: "Flat White", description: "Rich espresso, silky microfoam", price: 3.5, category: "coffee", ingredients: ["espresso", "milk"], dietary: { vegetarian: true }, popularity: 90 },
    { id: "vanilla-latte", name: "Vanilla Latte", description: "Espresso with vanilla, steamed milk", price: 3.9, category: "coffee", ingredients: ["espresso", "vanilla", "milk"], dietary: { vegetarian: true }, popularity: 86 },
    { id: "caramel-latte", name: "Caramel Latte", description: "Espresso, caramel, steamed milk", price: 3.9, category: "coffee", ingredients: ["espresso", "caramel", "milk"], dietary: { vegetarian: true }, popularity: 74 },
    { id: "iced-matcha-latte", name: "Iced Matcha Latte", description: "Premium matcha, oat milk, over ice", price: 4.2, category: "coffee", ingredients: ["matcha", "oat milk", "ice"], dietary: { vegan: true, glutenFree: true }, popularity: 80 },
    { id: "cold-brew", name: "Cold Brew", description: "Slow brewed, smooth and refreshing", price: 3.8, category: "coffee", ingredients: ["cold brew coffee", "ice"], dietary: { vegan: true, glutenFree: true }, popularity: 72 },

    /* ---------- Breakfast ---------- */
    { id: "cherry-blossom-breakfast", name: "Cherry Blossom Breakfast", description: "Eggs, sausage, bacon, beans, grilled tomato, toast", price: 8.5, category: "breakfast", ingredients: ["eggs", "sausage", "bacon", "beans", "tomato", "toast"], dietary: { containsGluten: true }, popularity: 95, signature: true },
    { id: "japanese-pancakes", name: "Japanese Pancakes", description: "Fluffy pancakes, seasonal berries", price: 6.5, category: "breakfast", ingredients: ["pancakes", "berries", "cream"], dietary: { vegetarian: true }, popularity: 78 },
    { id: "avocado-toast", name: "Avocado on Toast", description: "Smashed avocado, cherry tomato, seeds", price: 7.5, category: "breakfast", ingredients: ["avocado", "cherry tomato", "seeds", "sourdough"], dietary: { vegetarian: true }, popularity: 88 },
    { id: "miso-scrambled-eggs", name: "Miso Scrambled Eggs", description: "Creamy eggs with miso butter, chives", price: 6.8, category: "breakfast", ingredients: ["eggs", "miso", "butter", "chives"], dietary: { vegetarian: true, glutenFree: true }, popularity: 74 },
    { id: "breakfast-ramen", name: "Breakfast Ramen", description: "Mother broth, soft egg, spring onion", price: 8, category: "breakfast", ingredients: ["ramen noodles", "broth", "egg", "spring onion"], dietary: { containsGluten: true }, popularity: 70 },
    { id: "smoked-salmon-bagel", name: "Smoked Salmon Bagel", description: "Cream cheese, pickled cucumber, dill", price: 7.5, category: "breakfast", ingredients: ["smoked salmon", "bagel", "cream cheese", "cucumber", "dill"], dietary: { containsGluten: true }, popularity: 68 },

    /* ---------- Small plates ---------- */
    { id: "edamame", name: "Edamame", description: "Lightly salted steamed soybeans", price: 4.5, category: "small-plates", ingredients: ["edamame", "sea salt"], dietary: { vegan: true, glutenFree: true }, popularity: 76 },
    { id: "chicken-gyoza", name: "Chicken Gyoza", description: "Pan-fried dumplings, soy dip", price: 5.5, category: "small-plates", ingredients: ["chicken", "dumpling wrapper", "soy sauce"], dietary: { containsGluten: true }, popularity: 90 },
    { id: "truffle-fries", name: "Truffle Fries", description: "Crispy fries, truffle oil, parmesan", price: 5.5, category: "small-plates", ingredients: ["potato", "truffle oil", "parmesan"], dietary: { vegetarian: true }, popularity: 84 },
    { id: "miso-aubergine", name: "Miso Aubergine", description: "Chargrilled aubergine, miso glaze", price: 5.8, category: "small-plates", ingredients: ["aubergine", "miso", "sesame"], dietary: { vegan: true, glutenFree: true }, popularity: 73 },
    { id: "prawn-tempura", name: "Prawn Tempura", description: "Light batter, sweet chilli dip", price: 6.5, category: "small-plates", ingredients: ["prawns", "tempura batter", "sweet chilli"], dietary: { containsGluten: true }, popularity: 79 },
    { id: "crispy-tofu-bites", name: "Crispy Tofu Bites", description: "Chilli salt, spring onion, lime", price: 5.2, category: "small-plates", ingredients: ["tofu", "chilli", "spring onion", "lime"], dietary: { vegan: true, spicy: true }, popularity: 71 },
    { id: "korean-cauliflower", name: "Korean Fried Cauliflower", description: "Gochujang glaze, sesame seeds", price: 5.8, category: "small-plates", ingredients: ["cauliflower", "gochujang", "sesame"], dietary: { vegan: true, spicy: true }, popularity: 77 },
    { id: "salt-pepper-squid", name: "Salt & Pepper Squid", description: "Crispy squid, chilli, garlic", price: 6.2, category: "small-plates", ingredients: ["squid", "chilli", "garlic"], dietary: { spicy: true }, popularity: 75 },
    { id: "pork-bao-buns", name: "Pork Bao Buns", description: "Slow-cooked pork, pickles, hoisin", price: 6.5, category: "small-plates", ingredients: ["pork belly", "bao bun", "pickles", "hoisin"], dietary: { containsGluten: true }, popularity: 82 },
    { id: "cherry-blossom-prawns", name: "Cherry Blossom Prawns", description: "Pan-seared prawns, cherry blossom glaze, greens", price: 12.5, category: "small-plates", ingredients: ["prawns", "cherry blossom glaze", "seasonal greens"], dietary: {}, popularity: 81 },
    { id: "spicy-tuna-roll", name: "Spicy Tuna Roll", description: "Tuna, avocado, cucumber, spicy mayo", price: 10.5, category: "small-plates", ingredients: ["tuna", "avocado", "cucumber", "spicy mayo", "sushi rice"], dietary: { spicy: true }, popularity: 79 },

    /* ---------- Mains (first three as shown on the homepage) ---------- */
    { id: "sakura-roll", name: "Sakura Roll", description: "Fresh seafood, avocado and a touch of yuzu", price: 16, category: "mains", ingredients: ["seafood", "avocado", "yuzu", "sushi rice"], dietary: {}, popularity: 93, signature: true },
    { id: "miso-glazed-salmon", name: "Miso Glazed Salmon", description: "Grilled salmon, miso glaze, seasonal vegetables", price: 24, category: "mains", ingredients: ["salmon", "miso", "seasonal vegetables"], dietary: { glutenFree: true }, popularity: 91, signature: true },
    { id: "sakura-king-prawns", name: "Sakura King Prawns", description: "Seasonal herbs, blossom notes, signature sauce", price: 28, category: "mains", ingredients: ["king prawns", "herbs", "signature sauce"], dietary: {}, popularity: 85, signature: true },
    { id: "chicken-katsu-curry", name: "Chicken Katsu Curry", description: "Panko chicken, golden curry, steamed rice", price: 15.5, category: "mains", ingredients: ["chicken", "panko", "curry sauce", "rice"], dietary: { containsGluten: true }, popularity: 89 },
    { id: "teriyaki-chicken", name: "Teriyaki Chicken", description: "Glazed chicken thigh, pickled vegetables", price: 14.5, category: "mains", ingredients: ["chicken", "teriyaki", "pickled vegetables"], dietary: {}, popularity: 80 },
    { id: "tofu-katsu-curry", name: "Tofu Katsu Curry", description: "Crispy tofu, golden curry, steamed rice", price: 13.5, category: "mains", ingredients: ["tofu", "panko", "curry sauce", "rice"], dietary: { vegan: true, containsGluten: true }, popularity: 74 },
    { id: "black-cod-miso", name: "Black Cod Miso", description: "Marinated cod, pickled ginger", price: 26, category: "mains", ingredients: ["black cod", "miso", "ginger"], dietary: { glutenFree: true }, popularity: 70 },
    { id: "beef-tataki", name: "Beef Tataki", description: "Seared beef, ponzu, crispy shallots", price: 18, category: "mains", ingredients: ["beef", "ponzu", "shallots"], dietary: {}, popularity: 72 },
    { id: "duck-plum", name: "Duck Breast with Plum", description: "Roasted duck, plum sauce, greens", price: 19.5, category: "mains", ingredients: ["duck", "plum", "greens"], dietary: { glutenFree: true }, popularity: 69 },
    { id: "vegetable-tempura", name: "Vegetable Tempura Platter", description: "Seasonal vegetables, tentsuyu dip", price: 13, category: "mains", ingredients: ["seasonal vegetables", "tempura batter", "tentsuyu"], dietary: { vegetarian: true, containsGluten: true }, popularity: 66 },
    { id: "yuzu-salmon", name: "Yuzu Salmon", description: "Grilled salmon, yuzu sauce, pickled vegetables", price: 14, category: "mains", ingredients: ["salmon", "yuzu", "pickled vegetables", "sesame"], dietary: {}, popularity: 77 },

    /* ---------- Noodles & rice ---------- */
    { id: "chicken-ramen", name: "Chicken Ramen", description: "Rich broth, chashu chicken, soft egg", price: 13.5, category: "noodles-rice", ingredients: ["ramen noodles", "chicken", "broth", "egg"], dietary: { containsGluten: true }, popularity: 87 },
    { id: "spicy-miso-ramen", name: "Spicy Miso Ramen", description: "Miso broth, chilli oil, sweetcorn", price: 13.5, category: "noodles-rice", ingredients: ["ramen noodles", "miso", "chilli oil", "sweetcorn"], dietary: { vegetarian: true, spicy: true, containsGluten: true }, popularity: 82 },
    { id: "yaki-udon", name: "Yaki Udon", description: "Wok-fried udon, vegetables, sesame", price: 12.5, category: "noodles-rice", ingredients: ["udon", "vegetables", "sesame"], dietary: { vegetarian: true, containsGluten: true }, popularity: 73 },
    { id: "kimchi-fried-rice", name: "Kimchi Fried Rice", description: "Kimchi, fried egg, spring onion", price: 11.5, category: "noodles-rice", ingredients: ["rice", "kimchi", "egg", "spring onion"], dietary: { spicy: true }, popularity: 76 },
    { id: "chicken-pad-thai", name: "Chicken Pad Thai", description: "Rice noodles, tamarind, peanuts", price: 12.8, category: "noodles-rice", ingredients: ["rice noodles", "chicken", "tamarind", "peanuts"], dietary: { glutenFree: true }, popularity: 81 },
    { id: "jasmine-rice", name: "Steamed Jasmine Rice", description: "Fragrant and fluffy", price: 3.5, category: "noodles-rice", ingredients: ["jasmine rice"], dietary: { vegan: true, glutenFree: true }, popularity: 60 },
    { id: "truffle-mushroom-rice", name: "Truffle Mushroom Rice", description: "Wild mushrooms, truffle oil, fresh herbs", price: 11.5, category: "noodles-rice", ingredients: ["rice", "wild mushrooms", "truffle oil", "herbs"], dietary: { vegetarian: true }, popularity: 75 },

    /* ---------- Grill & BBQ ---------- */
    { id: "yakitori-skewers", name: "Yakitori Skewers", description: "Chicken thigh, tare glaze, spring onion", price: 8.5, category: "grill-bbq", ingredients: ["chicken", "tare", "spring onion"], dietary: {}, popularity: 83 },
    { id: "bbq-pork-ribs", name: "BBQ Pork Ribs", description: "Sticky gochujang glaze, slaw", price: 16.5, category: "grill-bbq", ingredients: ["pork ribs", "gochujang", "slaw"], dietary: { spicy: true }, popularity: 85 },
    { id: "lamb-cutlets", name: "Grilled Lamb Cutlets", description: "Miso rub, charred greens", price: 19, category: "grill-bbq", ingredients: ["lamb", "miso", "greens"], dietary: { glutenFree: true }, popularity: 74 },
    { id: "miso-corn", name: "Miso Corn on the Cob", description: "Charred corn, miso butter", price: 4.5, category: "grill-bbq", ingredients: ["corn", "miso", "butter"], dietary: { vegetarian: true, glutenFree: true }, popularity: 70 },
    { id: "rooftop-mixed-grill", name: "Rooftop Mixed Grill", description: "Chicken, lamb and prawns from the grill", price: 24, category: "grill-bbq", ingredients: ["chicken", "lamb", "prawns"], dietary: { glutenFree: true }, popularity: 88, signature: true },

    /* ---------- Sharing ---------- */
    { id: "garden-sharing-platter", name: "Garden Sharing Platter", description: "Gyoza, tempura, edamame and dips", price: 22, category: "sharing", ingredients: ["gyoza", "tempura", "edamame"], dietary: { containsGluten: true }, popularity: 86, signature: true },
    { id: "sushi-sharing-board", name: "Sushi Sharing Board", description: "Chef's selection of rolls and nigiri", price: 28, category: "sharing", ingredients: ["sushi rice", "salmon", "tuna", "nori"], dietary: {}, popularity: 79 },
    { id: "dim-sum-basket", name: "Dim Sum Basket", description: "Steamed dumplings, chilli oil", price: 16, category: "sharing", ingredients: ["dumplings", "chilli oil"], dietary: { spicy: true, containsGluten: true }, popularity: 78 },
    { id: "vegan-garden-platter", name: "Vegan Garden Platter", description: "Tofu bites, aubergine, edamame, rice", price: 19, category: "sharing", ingredients: ["tofu", "aubergine", "edamame", "rice"], dietary: { vegan: true }, popularity: 70 },

    /* ---------- Desserts ---------- */
    { id: "matcha-blossom", name: "Matcha Blossom", description: "Matcha dessert with seasonal fruits", price: 9, category: "desserts", ingredients: ["matcha", "seasonal fruit", "cream"], dietary: { vegetarian: true }, popularity: 90, signature: true },
    { id: "mochi-ice-cream", name: "Mochi Ice Cream", description: "Three flavours, seasonal selection", price: 6.5, category: "desserts", ingredients: ["mochi", "ice cream"], dietary: { vegetarian: true, glutenFree: true }, popularity: 84 },
    { id: "yuzu-cheesecake", name: "Yuzu Cheesecake", description: "Baked cheesecake, yuzu curd", price: 7.5, category: "desserts", ingredients: ["cream cheese", "yuzu", "biscuit base"], dietary: { vegetarian: true, containsGluten: true }, popularity: 80 },
    { id: "chocolate-fondant", name: "Chocolate Fondant", description: "Warm centre, vanilla ice cream", price: 7.5, category: "desserts", ingredients: ["chocolate", "vanilla ice cream"], dietary: { vegetarian: true }, popularity: 82 },
    { id: "sakura-panna-cotta", name: "Sakura Panna Cotta", description: "Cherry blossom cream, berry coulis", price: 6.8, category: "desserts", ingredients: ["cream", "cherry blossom", "berries"], dietary: { vegetarian: true, glutenFree: true }, popularity: 77 },
    { id: "matcha-tiramisu", name: "Matcha Tiramisu", description: "Matcha, mascarpone, ladyfingers", price: 6.5, category: "desserts", ingredients: ["matcha", "mascarpone", "ladyfingers"], dietary: { vegetarian: true, containsGluten: true }, popularity: 79 },

    /* ---------- Drinks ---------- */
    { id: "cherry-blossom-lemonade", name: "Cherry Blossom Lemonade", description: "House lemonade, sakura syrup", price: 4.5, category: "drinks", ingredients: ["lemon", "sakura syrup", "soda"], dietary: { vegan: true, glutenFree: true }, popularity: 88, signature: true },
    { id: "lychee-mojito", name: "Lychee Mojito", description: "Alcohol-free, lychee, mint, lime", price: 5.5, category: "drinks", ingredients: ["lychee", "mint", "lime", "soda"], dietary: { vegan: true, glutenFree: true }, popularity: 80 },
    { id: "mango-lassi", name: "Mango Lassi", description: "Mango, yoghurt, cardamom", price: 4.5, category: "drinks", ingredients: ["mango", "yoghurt", "cardamom"], dietary: { vegetarian: true, glutenFree: true }, popularity: 76 },
    { id: "hot-chocolate", name: "Hot Chocolate", description: "Rich chocolate, steamed milk", price: 3.9, category: "drinks", ingredients: ["chocolate", "milk"], dietary: { vegetarian: true }, popularity: 74 },
    { id: "jasmine-iced-tea", name: "Jasmine Iced Tea", description: "Cold-brewed jasmine, honey", price: 3.5, category: "drinks", ingredients: ["jasmine tea", "honey"], dietary: { vegetarian: true, glutenFree: true }, popularity: 72 },
    { id: "fresh-orange-juice", name: "Fresh Orange Juice", description: "Freshly squeezed", price: 3.8, category: "drinks", ingredients: ["orange"], dietary: { vegan: true, glutenFree: true }, popularity: 70 },
    { id: "sparkling-water", name: "Sparkling Water", description: "Chilled, with lemon", price: 2.5, category: "drinks", ingredients: ["sparkling water", "lemon"], dietary: { vegan: true, glutenFree: true }, popularity: 50 },
    { id: "mango-sake", name: "Mango Sake", description: "Mango, sake and citrus", price: 7.5, category: "drinks", ingredients: ["mango", "sake", "citrus"], dietary: {}, popularity: 73 },
];
