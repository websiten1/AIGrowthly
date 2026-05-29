# AIGrowthly — SMU Student Website Studio

This repository now hosts the updated AIGrowthly website design from the provided
Anthropic design bundle. It is a fully custom, multi-page static site built for
small business owners by SMU students.

## What’s included

- `index.html` — home page with the new student-hustle messaging, pricing
  hook, data-driven trust sections, and modern visual identity.
- `services.html` — details of the custom site services offered.
- `portfolio.html` — examples and proof points for small-business websites.
- `pricing.html` — honest pricing from $240 and comparison highlights.
- `process.html` — how the 48-hour student website process works.
- `about.html` — the SMU story and student team credibility.
- `faq.html` — answers for common small business website questions.
- `contact.html` — contact form and email call-to-action.
- `styles.css` — shared design system for the new site.
- `script.js` — shared interactive behavior, scroll reveal, counters, FAQ,
  contact form, and mobile nav.

## Run locally

Any static server will do. The simplest:

```bash
cd aigrowthly-website
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- The site uses a white base with modern violet, amber, coral, and teal accent colors
  while preserving black sections for contrast and credibility.
- The contact form opens a mailto draft to `aigrowthly@outlook.com`.
- The design bundle was sourced from the provided Anthropic design archive and
  implemented as the current website pages.
