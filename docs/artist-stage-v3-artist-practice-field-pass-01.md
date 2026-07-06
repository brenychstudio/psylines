# ARTIST STAGE v3 - Artist Practice Field Pass 01

## Goal
Transform `/artist` into a living practice field, not a conventional artist statement page.

## Source systems
- Living Editorial Surface System
- Living Home Canvas
- Object Chamber v3
- Works Manifestation Field

## Current problem
Artist page explains the practice but still reads too much like a text/about page.

## Target
A spatial practice field: statement, image traces, cycles, material logic and collector trust as one authored interface.

## Files touched
- src/pages/artist.astro

## Not touched
Home, Works, Work Detail, checkout, commerce, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-14-artist-desktop-top.png
- screenshots/v3-14-artist-statement-mid.png
- screenshots/v3-14-artist-materials.png
- screenshots/v3-14-artist-mobile-390.png
- screenshots/v3-14-artist-tablet-768.png
- screenshots/v3-14-home-regression.png
- screenshots/v3-14-works-regression.png
- screenshots/v3-14-mt3-regression.png

## Build status
Pass on 2026-06-06:

```txt
npm run build
```

Existing non-blocking warnings remain:

- SSR dynamic route `getStaticPaths()` warnings.
- Vite chunk-size warning.

Route QA:

- `/artist` 200
- `/` 200
- `/works` 200
- `/works/mt-3` 200
- `/contact` 200

## QA notes
- `/artist` now opens as a practice field with spatial title, route signals, and authored artwork traces.
- Statement copy is separated into a spatial field instead of a manifesto wall.
- Practice logic is a thin signal band, not cards.
- Cycles read as a conceptual register with linked rows.
- Materials and editions read as a collector trust layer without product-card treatment.
- Home, Works, and MT-3 regression screenshots remained visually stable.

## Remaining issues
- Future pass can tune the exact trace artwork and placement once the practice-field direction is approved.

## Pass 15 - Artist Statement Spine + Practice Traces

### Goal
Recompose `/artist` around a statement spine and visual practice traces.

### Problem
The current page is visually closer to a large statement/about page and repeats the Home/Object Chamber composition too directly.

### Key decision
Artist page should not have a dominant hero artwork like Home or Work Detail.
It should use smaller traces, crops, and textual rhythm to explain the practice.

### Changed files
- src/pages/artist.astro

### Not touched
Home, Works, Work Detail, checkout, commerce, XR, AR, atmosphere engine.

### QA screenshots
- screenshots/v3-15-artist-desktop-top.png
- screenshots/v3-15-artist-statement-spine.png
- screenshots/v3-15-artist-practice-logic.png
- screenshots/v3-15-artist-materials-handoff.png
- screenshots/v3-15-artist-mobile-390.png
- screenshots/v3-15-home-regression.png
- screenshots/v3-15-works-regression.png
- screenshots/v3-15-mt3-regression.png

### QA notes
- `/artist` now opens as a statement spine with quieter practice traces instead of a Home-like hero/object composition.
- The dominant right artwork has been replaced by smaller trace planes, with MT-3 kept secondary rather than used as the main object.
- Statement, practice logic, cycle register, material route, and collector handoff remain present but are reduced into an editorial field rhythm.
- Mobile 390px QA is stable with the trace field simplified to one main image plane.
- Regression screenshots were captured for Home, Works, and MT-3.

### Build status
Pass on 2026-06-06:

```txt
npm run build
```

Existing non-blocking Astro SSR `getStaticPaths()` warnings and Vite chunk-size warnings remain unchanged.

## Current Update - Practice Field + Process Sync

`/artist` now does two jobs at once without turning into a generic About page:

- stays a living practice field with traces and statement rhythm;
- links into `/process` as the canonical method explanation route;
- shares the same wide shell/frame alignment as Home, Works, Contact, and Process.

Keep the page image-light and statement-led. Method depth should expand through `/process`, not by turning `/artist` into a long essay wall.
