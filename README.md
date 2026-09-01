# Mini Bike Klub — Website Scaffold

Plain HTML / CSS / JS, static site, no build step. Matches the design spec:
minimalist, luxury, editorial, black & white, thin borders, no rounded corners.

## What's built

- **9 core pages**: index, shop, about, testimonials, contact, blog, cart, checkout, order-confirmation
- **17 product detail pages** in `/products/` (7 drift trikes, 4 mini bikes, 6 parts), all sourced from `js/products.js`
- **4 blog post pages** in `/blog/` (the other 6 articles listed on the blog page link back to `blog.html` until written — add more `.html` files in `/blog/` following the same pattern)
- **Dark/light mode** with localStorage persistence + system-preference fallback, no flash-of-wrong-theme (inline script in `<head>`)
- **Cart** — add/remove/update qty, localStorage persistence, free-shipping logic (3+ bikes/trikes), shared across every page
- **Checkout** — two-column layout, field validation, Chime/Zelle/Apple Pay method reveal, agreement checkbox, placeholder order creation
- Fully responsive (tested 390px–1600px+), semantic HTML, visible focus states, `prefers-reduced-motion` respected

## Running locally

No build step needed:
```
cd mini-bike-klub
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Deploying to Vercel

Static site — just deploy the folder as-is (no framework preset needed), same pattern as your other projects. Add a `vercel.json` only if you want custom rewrites/redirects later.

## What still needs real content before launch

1. **Images** — see `images/README.md` for the exact file list and paths. Nothing here uses placeholder/stock image URLs, per spec.
2. **Video** — see `videos/README.md` for `drift-trike-riding.mp4` + poster.
3. **Testimonials** — `testimonials.html` currently has placeholder quote text. Replace with real, approved customer reviews before publishing (spec explicitly prohibits fabricated testimonials presented as real).
4. **Contact info** — phone/email placeholders (`+1 XXX XXX XXXX`, `xxxxx@gmail.com`) appear in the header/footer/contact/checkout — search-and-replace once real contact details are ready.
5. **Privacy Policy / Terms & Conditions** — `privacy-policy.html` and `terms.html` are minimal placeholders (footer links to them). Not in the original spec's page list, but needed since the checkout agreement references them.

## Backend / integrations (not yet wired — architecture is prepared)

- **Resend** — `js/checkout.js` has a comment marking where a serverless function call belongs; `js/newsletter.js` has the same. Follow the AVD pattern: a `/api/*` serverless function holds the API key, never the frontend.
- **Tawk.to** — `window.MBK_CONFIG` in `js/main.js` holds `TAWK_TO_PROPERTY_ID` / `TAWK_TO_WIDGET_ID`; the embed snippet is commented out in every page's script block, ready to uncomment once IDs are set.
- **Security (spec §45)** — current cart/checkout math is client-side for UX only. Before accepting real orders: validate products, prices, quantities, and free-shipping eligibility server-side; never trust the frontend total.
- **Shipping** — `FLAT_SHIPPING_RATE` in `js/cart.js` is a placeholder ($75). Replace with real store rates.

## File structure

Matches the spec's recommended structure (see `mini_bike_klub_website_specification.pdf` §38), with an added `privacy-policy.html` / `terms.html` and per-page `README.md` files under `images/` and `videos/`.
