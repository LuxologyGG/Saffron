/* =============================================================
   Saffron and Rice, site content. Single source of truth.
   Every string the site renders lives here. Pages read window.SITE.

   PROVENANCE (checked 2026-07-17, see research/business/BUSINESS.md)
   - Name, tagline, address, phone, services, halal claims, all menu
     items, descriptions, and prices: the owner's printed trifold menu
     (June 2026 scan, research/business/assets), authoritative.
   - Hours: Grubhub live ordering schedule (store 7933240), Instagram
     bio @saffronfmb, Restaurant Guru mirror of Google. All agree on
     daily 11 AM to 8 PM. Not first-party GBP confirmed, so the site
     adds a call-to-confirm softener. See DELIVERY-NOTES.md item 2.
   - Dizzy price: ASSUMED 25.99 (illegible on the printed menu, absent
     from the live Grubhub menu; matches the lamb shank tier). See
     DELIVERY-NOTES.md item 1.
   - Reviews: real customer quotes from public listings for this
     address, new era only, attributed first name + rating + platform.
   - Order link: Grubhub store verified live 2026-07-17.
   - Photography: curated license-free images (Pexels license), mapped
     in research/photos/PHOTO-MAP.md. Swap any slot to a real photo by
     changing one filename here. Representative-imagery note ships in
     the footer.
   HOUSE RULE: no em dashes anywhere, in copy or comments.
   ============================================================= */
window.SITE = {
  company: {
    name: "Saffron & Rice",
    plainName: "Saffron and Rice",
    tagline: "Persian, Middle Eastern Kitchen",
    scriptFa: "زعفران و برنج", /* zafaran o berenj, saffron and rice */
    scriptFaTranslit: "Za’faran o berenj, saffron and rice",
    address: {
      street: "3801 Pacific Coast Hwy",
      city: "Torrance",
      state: "CA",
      zip: "90505",
      full: "3801 Pacific Coast Hwy, Torrance, CA 90505",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Saffron%20and%20Rice%203801%20Pacific%20Coast%20Hwy%20Torrance%20CA%2090505",
      lat: 33.8107,
      lng: -118.3494
    },
    phone: "(310) 504-0310",
    phoneHref: "tel:+13105040310",
    services: ["Dine-in", "Pickup", "Delivery", "Catering"],
    hours: {
      label: "Open daily, 11:00 AM to 8:00 PM",
      short: "Daily 11 AM to 8 PM",
      note: "Call to confirm holiday hours.",
      days: [
        { d: "Monday to Sunday", t: "11:00 AM to 8:00 PM" }
      ]
    },
    halal: {
      beef: "100% certified grass fed, halal, Black Angus beef.",
      chicken: "100% all natural, no added hormone, halal chicken."
    },
    intro: "A Persian and Middle Eastern deli and catering kitchen on Pacific Coast Highway in Torrance. Kabab off the flame, stews that simmer all morning, saffron rice under everything.",
    story: "Under new management. The market that stood here for years now cooks. Same address, new fire.",
    mission: "Kabab, stews, and saffron rice, daily 11 to 8 on Pacific Coast Highway."
  },

  orderLinks: [
    { label: "Order on Grubhub", href: "https://www.grubhub.com/restaurant/south-bay-food-hall-3801-pacific-coast-hwy-torrance/7933240" }
  ],

  social: [
    { label: "Instagram", href: "https://www.instagram.com/saffronfmb/" }
  ],

  disclaimer: "Please be aware that the consumption of raw or undercooked meats, eggs, poultry, seafood, or shellfish, carries a risk of foodborne illness. This risk is higher for individuals with certain medical conditions. Prices are subject to change without notice.",

  imageNote: "Dishes shown with representative photography while our own plates get their portraits taken.",

  /* Menu. Names, descriptions, and prices are verbatim from the
     printed menu. veg = price of the vegetarian version where one
     exists. fa = Persian script annotation (decorative, transliterated
     name is always present in the item name). */
  menu: {
    sections: [
      {
        id: "appetizers",
        title: "Appetizers",
        fa: "پیش غذا",
        translit: "Pish ghaza",
        photo: "menu-appetizers.jpg",
        items: [
          { id: "ash-e-jo", name: "Ash-e-Jo", price: 10.99, desc: "Barley, fresh herbs, whey." },
          { id: "ash-e-reshteh", name: "Ash-e-Reshteh", price: 10.99, desc: "Spinach, persian noodle, chickpeas, onion, garlic, dried mint, whey." },
          { id: "lentil-soup", name: "Lentil Soup", price: 8.99, desc: "Red lentils, onion, garlic, mixed vegetables." },
          { id: "olovieh-salad", name: "Olovieh Salad", price: 13.99, priceLabel: "Large 13.99 / Small 7.99", desc: "Chicken, green peas, potato, eggs, carrots, pickles." },
          { id: "shirazi-salad", name: "Shirazi Salad", price: 9.99, desc: "Cucumber, tomato, red onions, parsley." },
          { id: "greek-salad", name: "Greek Salad", price: 11.99, desc: "Mixed greens, tomato, cucumber, red onion, feta cheese, olives." },
          { id: "green-salad", name: "Green Salad", price: 9.99, desc: "Lettuce, onion, cucumber, tomato." },
          { id: "kashk-e-bademjoon", name: "Kashk-e-Bademjoon", price: 11.99, desc: "Eggplant, onion, garlic, dried mint." },
          { id: "hummus", name: "Hummus", price: 6.99, desc: "Chickpeas, tahini, garlic, lemon." },
          { id: "masto-khyar", name: "Masto Khyar", price: 7.99, desc: "Yogurt, cucumber, mint." },
          { id: "masto-mosir", name: "Masto Mosir", price: 7.99, desc: "Yogurt, shallot." },
          { id: "kuku-sabzi", name: "Kuku Sabzi", price: 11.99, desc: "Parsley, cilantro, dill, chives, green onion, eggs." },
          { id: "kotlet", name: "Kotlet", price: 2.99, priceLabel: "2.99 each", desc: "Potato, ground beef." },
          { id: "shole-zard", name: "Shole Zard", price: 8.99, desc: "Saffron rice pudding." }
        ]
      },
      {
        id: "kababs",
        title: "Grill & Kababs",
        fa: "کباب",
        translit: "Kabab",
        photo: "menu-kabab.jpg",
        note: "Served off the flame.",
        items: [
          { id: "beef-koobideh", name: "Beef Koobideh", price: 19.99, desc: "Ground beef." },
          { id: "chicken-koobideh", name: "Chicken Koobideh", price: 19.99, desc: "Ground chicken." },
          { id: "beef-chicken-koobideh", name: "Beef & Chicken Koobideh", price: 19.99, desc: "" },
          { id: "boneless-chicken", name: "Boneless Chicken", price: 20.99, desc: "Chicken tender." },
          { id: "chicken-shish", name: "Chicken Shish Kabab", price: 22.99, desc: "" },
          { id: "beef-shish", name: "Beef Shish Kabab", price: 25.99, desc: "Filet mignon pieces." },
          { id: "beef-barg", name: "Beef Barg", price: 31.99, desc: "Filet mignon." },
          { id: "chicken-barg", name: "Chicken Barg", price: 24.99, desc: "Chicken tender." },
          { id: "beef-soltani", name: "Beef Soltani", price: 35.99, desc: "Barg and koobideh." },
          { id: "chicken-soltani", name: "Chicken Soltani", price: 30.99, desc: "Barg and koobideh." },
          { id: "cornish-hen", name: "Cornish Hen Kabab", price: 24.99, desc: "" },
          { id: "salmon-kabab", name: "Salmon Kabab", price: 24.99, desc: "" }
        ]
      },
      {
        id: "stews",
        title: "Home Style Stews",
        fa: "خورش",
        translit: "Khoresh",
        photo: "menu-stew.jpg",
        note: "The second price is the vegetarian version.",
        items: [
          { id: "ghorme-sabzi", name: "Ghorme Sabzi", price: 18.99, veg: 15.99, desc: "Green herbs, beef, kidney beans." },
          { id: "gheyme", name: "Gheyme", price: 17.99, veg: 14.99, desc: "Beef, yellow lentils, black lemon." },
          { id: "gheyme-bademjan", name: "Gheyme Bademjan", price: 18.99, veg: 16.99, desc: "" },
          { id: "bademjan", name: "Bademjan", price: 21.99, veg: 18.99, desc: "Beef, eggplant, tomato sauce, onions." },
          { id: "fasenjoon", name: "Fasenjoon", price: 18.99, veg: 16.99, desc: "Walnut, pomegranate molasses, chicken." },
          /* desc below is verbatim from the printed menu (authoritative
             transcription); it is a sourced claim, not marketing copy. */
          { id: "lamb-shank", name: "Lamb Shank with Baghali Polo", price: 25.99, desc: "New Zealand, grass-fed, halal." },
          { id: "dizzy", name: "Dizzy", price: 25.99, priceAssumed: true, desc: "Lamb shank, potato, beans." },
          { id: "tahchin", name: "Tahchin", price: 15.99, veg: 13.99, desc: "" }
        ]
      },
      {
        id: "rice",
        title: "Rice",
        fa: "برنج",
        translit: "Berenj",
        photo: "menu-rice.jpg",
        items: [
          { id: "baghali-polo", name: "Baghali Polo", price: 11.99, desc: "Rice, fava beans, dill." },
          { id: "zereschk-polo", name: "Zereschk Polo", price: 12.99, desc: "Rice, barberries." },
          { id: "loobia-polo", name: "Loobia Polo", price: 16.99, desc: "Rice, green beans, tomato, ground beef." }
        ]
      },
      {
        id: "sandwiches",
        title: "Sandwiches",
        fa: "ساندویچ",
        translit: "Sandevich",
        photo: "menu-appetizers.jpg",
        note: "Wrap or soft baguette.",
        items: [
          { id: "sw-beef-koobideh", name: "Beef Koobideh", price: 13.99, desc: "Lettuce, tomato, pickles." },
          { id: "sw-chicken-koobideh", name: "Chicken Koobideh", price: 13.99, desc: "Lettuce, tomato, pickles." },
          { id: "sw-chicken-boneless", name: "Chicken Boneless", price: 14.99, desc: "Lettuce, tomato, pickles." },
          { id: "sw-kotlet", name: "Kotlet", price: 13.99, desc: "Lettuce, tomato, pickles." },
          { id: "sw-kuku-sabzi", name: "Kuku Sabzi", price: 13.99, desc: "Masto khyar, tomato." },
          { id: "sw-olovieh", name: "Olovieh", price: 13.99, desc: "Lettuce, tomato, pickles." },
          { id: "sw-kalbas", name: "Kalbas", price: 13.99, desc: "Lettuce, tomato, pickles." }
        ]
      },
      {
        id: "platters",
        title: "Party Platters",
        fa: "مهمانی",
        translit: "Mehmani",
        photo: "catering-platters.jpg",
        items: [
          { id: "family-combo", name: "Family Combo", price: 69.99, desc: "6 koobideh, 1 boneless. Serves 3 to 4.", serves: "3-4" },
          { id: "deluxe-family-combo", name: "Deluxe Family Combo", price: 98.99, desc: "4 koobideh, 1 boneless, 1 beef barg, 1 beef shish kabab. Serves 5 to 6.", serves: "5-6" },
          { id: "stews-combo", name: "Stews Combo", price: 49.99, desc: "Gheyme, ghorme sabzi, fasenjoon." },
          { id: "platter-10", name: "Party Platter for 10", price: 199, wholePrice: true, desc: "8 skewers of chicken or beef koobideh, 4 boneless chicken, 10 tomatoes, choice of 1 stew.", serves: "10" },
          { id: "platter-20", name: "Party Platter for 20", price: 319, wholePrice: true, desc: "16 skewers of chicken or beef koobideh, 8 boneless chicken, 20 tomatoes, choice of 2 stews.", serves: "20" },
          { id: "platter-30", name: "Party Platter for 30", price: 449, wholePrice: true, desc: "24 skewers of chicken or beef koobideh, 12 boneless chicken, 30 tomatoes, choice of 3 stews.", serves: "30" }
        ]
      }
    ]
  },

  /* Real customer quotes, new era only, public listings for this
     address. Attribution: first name, rating, platform. */
  reviews: [
    { quote: "After long time I actually found the right taste and right quality food in this place, and customer service is great, all my family members are a regular customer to this place.", who: "Shakira", stars: 5, src: "Google", date: "2026" },
    { quote: "Persian food was delicious. We ordered pickup, quite a large order, and had all the koobideh and boneless chicken in aluminum pan family style, came with bbq'd tomatoes and onions.", who: "Florence", stars: 5, src: "Yelp", date: "2026" },
    { quote: "We drive by this place all the time. Finally went in today and so glad we did.", who: "Frida", stars: 5, src: "Yelp", date: "2024" },
    { quote: "I just wanted something simple, healthy and tasty and that's exactly what I got. The lamb kabob was tender and seasoned just right.", who: "Walter", stars: 5, src: "Yelp", date: "2024" }
  ],

  /* Image slot map. One-line swap per slot; see PHOTO-MAP.md. */
  images: {
    "home-hero": "assets/img/home-hero.jpg",
    "home-story": "assets/img/home-story.jpg",
    "home-menu-teaser": "assets/img/home-menu-teaser.jpg",
    "menu-hero": "assets/img/menu-hero.jpg",
    "menu-appetizers": "assets/img/menu-appetizers.jpg",
    "menu-kabab": "assets/img/menu-kabab.jpg",
    "menu-stew": "assets/img/menu-stew.jpg",
    "menu-rice": "assets/img/menu-rice.jpg",
    "catering-hero": "assets/img/catering-hero.jpg",
    "catering-platters": "assets/img/catering-platters.jpg",
    "about-hero": "assets/img/about-hero.jpg",
    "about-kitchen": "assets/img/about-kitchen.jpg",
    "contact-hero": "assets/img/contact-hero.jpg",
    "texture-1": "assets/img/texture-1.jpg",
    "kitchen-people": "assets/img/kitchen-people.jpg",
    "texture-2": "assets/img/texture-2.jpg"
  }
};
