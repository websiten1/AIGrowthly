# AIGrowthly — Agency Website

Modern, dark-themed marketing site for **AIGrowthly**, an AI-native digital studio
with offices in Iași, București, Milano and Dallas. Built as a static, single-page
site (HTML + CSS + JS) — no framework required.

## What's in the box

- `index.html` — full landing page (hero, services, metrics, case studies, process,
  tech stack, testimonials, locations, insights, awards, inquiry form, footer)
- `styles.css` — custom design system (Inter + Instrument Serif + JetBrains Mono,
  dark palette, gradient accents, responsive grid)
- `script.js` — scroll reveal, animated counters, sticky header, local-time clocks
  per office, cursor-aware card glow, inquiry form handling
- `assets/logo.svg` — custom wordmark + geometric "A" mark
- `assets/favicon.svg` — square badge mark

## Run locally

Any static server will do. The simplest:

```bash
cd aigrowthly-website
python3 -m http.server 8000
# open http://localhost:8000
```

## Services presented

1. Website Design & Engineering (Next.js, Astro, headless)
2. CRM Platforms & Automation (HubSpot, Salesforce, bespoke)
3. SEO & Organic Growth (technical + programmatic)
4. AI Applications & Workflows (RAG, copilots, agents)

## Offices

- **Iași (HQ)** — Palas Campus
- **București** — One Floreasca Tower
- **Milano** — Corso Como
- **Dallas** — Ross Avenue

## Notes

- No external images used — all visuals are hand-crafted SVGs so the site stays
  lightweight and ships under 40 kB gzipped.
- Fonts are loaded from Google Fonts. Swap to `font-display: optional` or self-host
  for production.
- Form posts are currently handled client-side (demo). Wire the handler in
  `script.js` to your backend / HubSpot / Attio endpoint.
