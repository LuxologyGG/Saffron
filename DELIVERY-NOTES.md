# DELIVERY NOTES, flags for owner confirmation

Compiled 2026-07-17 during the autonomous build. Each item is safe as shipped but deserves a
30-second confirmation from the owner.

1. Dizzy price: ASSUMED at 25.99. The printed menu lists "Dizzy, lamb shank, potato, beans" with
   an illegible price. It does not appear on the live Grubhub menu, and DoorDash and Uber Eats are
   bot-walled. 25.99 matches the Lamb Shank with Baghali Polo tier. Correct in one line in
   assets/js/data.js (menu.stews, id "dizzy").

2. Hours: shown as Daily 11:00 AM to 8:00 PM. Sources agree (Grubhub live ordering schedule,
   Instagram bio, Restaurant Guru mirror of Google, checked 2026-07-17) but none is a first-party
   Google Business Profile fetch. The site adds "call to confirm holiday hours."

3. Venue naming: public listings for this address are split between the legacy "Saffron Food
   Mart" and "South Bay Food Hall". No listing yet uses "Saffron and Rice". The site uses the
   ground-truth brand only. The owner may want listings updated so search, Grubhub, and the site
   agree.

4. Order links: only the verified live Grubhub store is linked (listed there under South Bay
   Food Hall). DoorDash and Uber Eats listings exist but could not be verified live through bot
   walls; add them to data.js orderLinks when confirmed.

5. Phone: (310) 504-0310 everywhere per ground truth and the printed menu. A second number,
   (310) 504-0102, circulates on South Bay Food Hall directory listings; not shown.

6. Photography: dishes are represented with curated license-free photography (see
   research/photos/PHOTO-MAP.md); every slot swaps to a real photo in one line in data.js. The
   only real photos found online are watermarked listing photos, unusable in production. A real
   shoot of the koobideh plate, the stews, and the storefront would lift the site further.

7. Reviews: quotes shown are real, new-era (2024 to 2026), attributed by first name, rating, and
   platform, from the listings for this address. Aggregate scores were NOT printed on the site
   because platform listings still mix the old market identity with the new kitchen.
