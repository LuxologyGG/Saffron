/* =============================================================
   Saffron & Rice, Site content (single source of truth)

   EVERY string and fact the site renders lives here. app.js and the
   pages read the global window.SITE.

   ---- PROVENANCE ----
   - Menu items and prices: provided verbatim by the owner (task brief,
     2026-07). AUTHORITATIVE. Do not alter names or prices.
   - Name, address, phone, service modes, halal claims: owner-provided
     (task brief). Address/phone cross-checked against public listings
     during discovery (see research/business/facts.md).
   - Hours, ratings, review quotes: filled only from verified public
     listings; anything unverifiable is softened or omitted.
   - History: formerly Saffron Food Market (supermarket) under prior
     ownership; now a Persian & Middle Eastern deli and catering
     kitchen under new management. Old site is gist-only, not a source.

   ---- HOUSE RULES ----
   1. NO em dashes anywhere. Hyphens for ranges only.
   2. Every photo self-hosted, referenced by slug key, one-line swap.
   3. Honesty over hype: representative imagery gets a disclosure;
      unverified facts get softened, not asserted.
   ============================================================= */
window.SITE = {
  company: {
    name: "Saffron & Rice",
    tagline: "Persian & Middle Eastern Kitchen",
    formerly: "Formerly Saffron Food Market, now under new management",
    address: "3801 Pacific Coast Hwy, Torrance, CA 90505",
    addressShort: "3801 Pacific Coast Hwy, Torrance",
    phone: "(310) 504-0310",
    phoneHref: "tel:+13105040310",
    serviceModes: ["Dine-In", "Pickup", "Delivery", "Catering"],
    halal: {
      beef: "100% Certified Grass Fed Halal, Black Angus Beef",
      chicken: "100% All Natural, No Added Hormone, Halal Chicken",
    },
    hours: null, // filled from verified listings post-discovery; render "Call for hours" when null
    intro: "A Persian and Middle Eastern kitchen in Torrance serving charcoal-kissed kababs, fragrant rice, and slow-simmered stews. Dine in, pick up, get it delivered, or let us cater your next gathering.",
  },

  disclaimers: {
    consumption: "Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness.",
    prices: "Prices are subject to change without notice.",
  },

  /* ---- MENU: AUTHORITATIVE, owner-provided. Do not edit. ---- */
  menu: [
    {
      slug: "party-platters",
      title: "Party Platters",
      note: null,
      items: [
        { name: "Family Combo", desc: "6 koobideh, 1 boneless (serves 3-4)", price: "69.99" },
        { name: "Deluxe Family Combo", desc: "4 koobideh, 1 boneless, 1 beef barg, 1 beef shish kabab (serves 5-6)", price: "98.99" },
        { name: "Stews Combo", desc: "Gheyme, ghorme sabzi, fasenjoon", price: "49.99" },
        { name: "Party Platter for 10", desc: "8 skewers of chicken or beef koobideh, 4 boneless chicken, 10 tomatoes, choice of 1 stew", price: "199" },
        { name: "Party Platter for 20", desc: "16 skewers of chicken or beef koobideh, 8 boneless chicken, 20 tomatoes, choice of 2 stews", price: "319" },
        { name: "Party Platter for 30", desc: "24 skewers of chicken or beef koobideh, 12 boneless chicken, 30 tomatoes, choice of 3 stews", price: "449" },
      ],
    },
    {
      slug: "rice",
      title: "Rice",
      note: null,
      items: [
        { name: "Baghali Polo", desc: "Rice, fava beans, dill", price: "11.99" },
        { name: "Zereschk Polo", desc: "Rice, barberries", price: "12.99" },
        { name: "Loobia Polo", desc: "Rice, green beans, tomato, ground beef", price: "16.99" },
      ],
    },
    {
      slug: "sandwiches",
      title: "Sandwiches",
      note: "Wrap or soft baguette",
      items: [
        { name: "Beef Koobideh", desc: "Lettuce, tomato, pickles", price: "13.99" },
        { name: "Chicken Koobideh", desc: "Lettuce, tomato, pickles", price: "13.99" },
        { name: "Chicken Boneless", desc: "Lettuce, tomato, pickles", price: "14.99" },
        { name: "Kotlet", desc: "Lettuce, tomato, pickles", price: "13.99" },
        { name: "Kuku Sabzi", desc: "Masto khyar, tomato", price: "13.99" },
        { name: "Olovieh", desc: "Lettuce, tomato, pickles", price: "13.99" },
        { name: "Kalbas", desc: "Lettuce, tomato, pickles", price: "13.99" },
      ],
    },
  ],

  testimonials: [], // filled only with verbatim verified review quotes post-discovery
};
