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

## Setting up Resend (order + newsletter emails)

The code is live in `/api/send-order-email.js` and `/api/newsletter.js` — you just need to configure Resend and add environment variables in Vercel.

1. **Verify your sending domain in Resend** — in the Resend dashboard, go to Domains → Add Domain, enter `minibikeklub.com`, and add the DNS records it gives you (in Namecheap, same place you added the Vercel records). This can take a few minutes to verify. You can't send from `orders@minibikeklub.com` until this shows verified.
2. **Create an API key** — Resend dashboard → API Keys → Create. Copy it once; you won't see it again.
3. **Add environment variables in Vercel** — Project → Settings → Environment Variables:
   - `RESEND_API_KEY` — the key from step 2
   - `ORDER_FROM_EMAIL` — e.g. `orders@minibikeklub.com` (must be on the verified domain)
   - `ORDER_ADMIN_EMAIL` — where you want new-order notifications sent, e.g. your real inbox
   - `RESEND_AUDIENCE_ID` — optional, only if you create a Resend Audience for newsletter signups (Resend dashboard → Audiences). Without it, newsletter signups just email `ORDER_ADMIN_EMAIL` instead, so nothing is lost.
4. **Redeploy** — env vars only take effect on the next deployment. Vercel → Deployments → Redeploy (or push any small commit).
5. **Test it**:
   - Add an item to cart, go through checkout with your own real email address, place the order.
   - Check your inbox for the confirmation, and `ORDER_ADMIN_EMAIL`'s inbox for the notification.
   - If nothing arrives, check Vercel → your project → Deployments → the latest deployment → Functions → `send-order-email` for error logs, and check the Resend dashboard's "Emails" log for delivery status/bounces.
   - Test the newsletter signup on the homepage the same way.

**Security note (still applies, spec §45):** `send-order-email.js` currently trusts the price/total numbers the browser sends — it only checks that required fields are present. Before taking real payments at scale, add server-side re-validation of product IDs, prices, and free-shipping eligibility inside that function.

## Setting up Tawk.to (live chat)

1. Create a Tawk.to account and property for the site, and grab your Property ID and Widget ID from Tawk.to → Administration → Chat Widget.
2. In `js/main.js`, find `window.MBK_CONFIG` near the bottom and fill in both IDs.
3. In every page's script block (search for "Tawk.to live chat" in any `.html` file), uncomment the `<script>` block that loads the Tawk.to embed.
4. Since it's the same snippet on every page, easiest is a find-and-replace across all `.html` files for the commented block — ask Claude to do this in bulk once you have your IDs, rather than editing 30 files by hand.

## File structure

Matches the spec's recommended structure (see `mini_bike_klub_website_specification.pdf` §38), with an added `privacy-policy.html` / `terms.html` and per-page `README.md` files under `images/` and `videos/`.