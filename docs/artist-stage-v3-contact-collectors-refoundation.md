# ARTIST STAGE v3 - Contact + Collectors Refoundation

## Goal
Rebuild `/contact` and `/collectors` so they match the V3 living interface and do not feel like generic utility pages.

## Current problem
Contact and Collectors are useful, but less authored than Home, Series, Works, Artist and Object Chamber.

## Target
- Contact = routing field for collector / curatorial / studio dialogue.
- Collectors = acquisition process field for works, editions, preview, checkout and inquiry.
- No backend form.
- No checkout changes.
- No new routes.

## Files touched
- src/pages/contact.astro
- src/pages/collectors.astro

## Not touched
Checkout, commerce catalog, Work Detail, Home, Series, Works, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-36-contact-desktop.png
- screenshots/v3-36-contact-mobile-390.png
- screenshots/v3-36-collectors-desktop.png
- screenshots/v3-36-collectors-mobile-390.png
- screenshots/v3-36-home-regression.png
- screenshots/v3-36-series-regression.png
- screenshots/v3-36-works-regression.png
- screenshots/v3-36-mt3-regression.png

## Contact route behavior
- `/contact` is framed as `CONTACT / ROUTING FIELD`.
- Collector, curatorial/gallery and studio routes are presented as thin register rows.
- No backend form, CRM, email automation or invented contact address was added.
- Direct acquisition is reinforced as starting from Work Detail.
- Route signals point to `/works`, `/series`, `/collectors`, `/works/mt-3`.

## Collector process behavior
- `/collectors` is framed as `COLLECTOR PROCESS`.
- Acquisition is presented as a four-step process register: select a work, choose the route, preview scale, complete acquisition.
- Copy uses cautious language: secure checkout where available and collector inquiry where needed.
- Trust surfaces link to `/policies/shipping`, `/policies/returns`, `/policies/terms`, `/policies/privacy`, and `/contact`.

## Build status
PASS - `npm run build` completed successfully.

Route smoke returned 200 for:
- `/contact`
- `/collectors`
- `/`
- `/series`
- `/series/meta-bodies`
- `/works`
- `/works/mt-3`
- `/artist`
- `/policies/shipping`
- `/policies/returns`

Existing Astro dynamic-route prerender warnings and the Vite chunk-size warning remain project-level warnings and were not introduced by this pass.

## Remaining issues
- Mobile screenshots were captured with Chrome headless; the global header remains unchanged by rule and can still visually crowd narrow captures.
- V3-37 should review Contact and Collectors again inside the full production readiness sweep.

## Status
PASS

## V3-36R - Contact Clarity + Direct Communication Route

### Problem
The V3 Contact page became conceptually aligned but not practical enough. It did not clearly show how to contact the artist/studio and created too much routing friction.

### Goal
Make `/contact` immediately understandable:
- direct contact method visible
- clear message context
- collector / curatorial / studio inquiry routes explained simply
- direct acquisition note kept short
- `/collectors` becomes supporting context, not required navigation

### Files touched
- src/pages/contact.astro
- src/pages/collectors.astro

### Not touched
Checkout, commerce catalog, Work Detail, Works, Series, Home, XR, AR, atmosphere engine.

### Confirmed contact method used
- `info@brenych.com`
- `mailto:info@brenych.com?subject=ARTIST%20STAGE%20inquiry`

### QA screenshots
- screenshots/v3-36r-contact-direct-desktop.png
- screenshots/v3-36r-contact-contexts.png
- screenshots/v3-36r-contact-mobile-390.png
- screenshots/v3-36r-collectors-supporting.png
- screenshots/v3-36r-home-regression.png
- screenshots/v3-36r-works-regression.png
- screenshots/v3-36r-mt3-regression.png

### Contact behavior
- `/contact` now opens with direct email contact above the fold.
- `Open mail` uses the confirmed `mailto:` route.
- `Copy email` uses local progressive enhancement and falls back to a readable visible email if clipboard access fails.
- Collector, curatorial, and studio contexts remain visible as guidance, not competing action blocks.
- Studio links remain secondary through Instagram, YouTube, and TikTok.

### Collectors behavior
- `/collectors` now clearly states that it explains the process and that direct questions should go to Contact.
- `Contact the studio` is visible near the top of the collector page.
- `/collectors` stays supporting and does not behave like the required first step before making contact.

### Build status
- PASS - `npm run build`

### Remaining watch items
- Mobile 390px should be visually checked against the global header because the header itself is unchanged by this pass.
- If a future public phone, WhatsApp, or gallery contact route is confirmed, it can be added as secondary direct contact without changing the primary email-first structure.

## Current Update - Wide Shell / Direct Contact Calibration

`/contact` now sits on the same canonical shell/header axis as the other main public routes.

- Direct email remains the first and clearest action above the fold.
- The route should stay spacious on wide viewports rather than collapsing into small utility-page typography.
- `/collectors` remains supporting context, not a required pre-step before direct contact.
