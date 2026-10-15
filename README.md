# Ghee Culture — A2 Ghee & Thoughtful Gifting (prototype)

React 18 + TypeScript + Tailwind CSS 3 + React Router 6, built with Vite. Fonts (Fraunces, Manrope) are self-hosted via `@fontsource`.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit + journey tests (Vitest, Testing Library)
npm run build      # typecheck + production build into dist/
npm run preview    # serve the build
```

Routes use browser history. When deploying, configure the host to serve `index.html` for all paths (SPA fallback).

## Where to edit things

| What | File |
| --- | --- |
| Brand name, logo, prototype notice, contact channels, social links, integration status | `src/content/brand.ts` |
| Ghee variants, prices (integer paise), info sections & their approval status | `src/content/products.ts` |
| Gift boxes, contents, pack sizes, personalisation | `src/content/gifts.ts` |
| Corporate occasions, quantity/budget ranges, process, branding options, seasonal (Diwali) module | `src/content/corporate.ts` |
| FAQs | `src/content/faqs.ts` |
| Learn page copy and references | `src/content/learn.ts` |
| Images (all slots, alt text, art-direction briefs) | `src/content/images.ts` |
| Nav and policy page list | `src/content/navigation.ts` |
| Colours, type scale | `tailwind.config.js`, `src/index.css` |

**Images:** put optimised files in `public/images/`, then set `src` (and the true `width`/`height`) for the slot in `images.ts`. Until a `src` is set, the site shows a labelled placeholder frame.

The prototype currently uses openly licensed **stand-in photos from Wikimedia Commons** (CC0, CC BY, CC BY-SA). They are flagged `illustrative: true`, show a small "Illustrative" tag, and are credited on `/image-credits` (linked in the footer). Gift-box images are composites of real photos of each listed item; they are not Ghee Culture packaging. When you replace a stand-in with Ghee Culture's own photo, set `illustrative` to false (or remove it) and delete its `credits`. If you keep any CC BY / BY-SA image at launch, keep the credits page.

Still placeholders (need Ghee Culture's real product/packaging): back label, closed gift boxes, packaging close-ups (lid, insert, card), custom-box concept.

**Content status:** each fact carries `approved | sample | general | pending`. Pending facts show as "Awaiting information" on the site; change the status to `approved` and add the text once the business confirms it.

**Contact details / WhatsApp:** fill the fields in `brand.ts`. Footer and Contact page show only configured channels; the WhatsApp link appears only once `whatsapp` is set.

## Integrations (all disconnected)

- **Checkout/payment:** not connected. `/checkout` is a clearly labelled demo summary; no card details are collected. Connect a provider (e.g. Shopify, Razorpay) server-side and set `integrations.checkout`.
- **Quote form:** `src/lib/quote.ts` POSTs JSON to `integrations.quoteForm.endpoint` when `connected: true`, with loading/error/success states. Until then it shows "Demo only: your request has not been sent" and sends/stores nothing. Never put secret keys in `brand.ts` (it ships to the browser).
- **Contact form:** demo-only, same rule.
- **SEO:** `index.html` carries `noindex` for the prototype. Remove at launch. The site is client-rendered; for strong indexing, consider prerendering. No structured product data is emitted, so sample prices aren't published as offers.

## Cart

Stored in `localStorage` (`gheeculture.cart.v1`) as product IDs and quantities only. Prices are always recalculated from the catalogue. Malformed or unknown entries are discarded; quantities clamped 1–20.
