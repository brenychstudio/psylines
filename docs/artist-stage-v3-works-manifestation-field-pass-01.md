# ARTIST STAGE v3 - Works Manifestation Field Pass 01

## Goal
Transform `/works` from archive/grid into a cycle-led manifestation field.

## Source systems
- Series Constellation Field
- Living Scroll Flow Mechanism
- Field / Spatial navigation
- Object Chamber v3

## Current problem
Works is functional but still too close to archive/gallery grid.

## Target
A field-led page with cycle register, manifestation field mode, compact index mode, and clear route into object pages.

## Files touched
- `src/pages/works/index.astro`
- `src/components/works/WorksArchive.tsx`
- `src/components/works/CuratedGrid.tsx`
- `src/components/works/CompactGrid.tsx`
- `src/styles/global.css`
- `docs/artist-stage-v3-works-manifestation-field-pass-01.md`

## Not touched
Checkout, Work Detail, commerce, XR, AR, atmosphere engine.

## What improved
- Reframed `/works` around Works Field language instead of archive/gallery browsing.
- Renamed visible modes from Curated/Compact to Field/Index while preserving internal state names.
- Reworked supported filters into a quieter cycle register: All, Meta-Bodies, Night Water, Studies, Editions.
- Converted Field mode into asymmetric manifestation entries with image-led planes and reduced product-card signals.
- Kept Index mode as a scannable compact view with persistent cycle/year/title metadata.
- Preserved filter count updates, work links, and atmosphere mood dispatch.

## QA screenshots
- `screenshots/v3-12-works-field-desktop.png`
- `screenshots/v3-12-works-index-desktop.png`
- `screenshots/v3-12-works-filter-metabodies.png`
- `screenshots/v3-12-works-mobile-390.png`
- `screenshots/v3-12-works-tablet-768.png`
- `screenshots/v3-12-home-regression.png`
- `screenshots/v3-12-mt3-regression.png`

## Build status
Pass on 2026-06-06:

```txt
npm run build
```

Existing non-blocking warnings remain:

- SSR dynamic route `getStaticPaths()` warnings.
- Vite chunk-size warning.

Local dev server started:

```txt
npm run dev -- --force --host 127.0.0.1
http://127.0.0.1:4323/
```

Route QA:

- `/works` 200
- `/` 200
- `/works/mt-3` 200
- `/works/figure-in-ash-light` 200
- `/artist` 200
- `/contact` 200

Screenshot QA notes:

- Field mode now shows an authored asymmetric manifestation field rather than a uniform product grid.
- Index mode remains dense and scannable with visible title/year/cycle signals.
- Meta-Bodies filter updates active state and count to 8 manifestations in register.
- Mobile 390px no longer clips the title and shows the first artwork plane in the initial scroll field.
- Home and MT-3 regression screenshots remained visually stable.

## Remaining issues
- Field mode is a first pass, not a draggable constellation; future review can tune per-work placement once screenshots are approved.
- Originals are not exposed as a filter yet because the current Works data does not provide a safe explicit originals flag.

## Pass 13 - Works Rhythm System + Scalable Index

### Goal
Replace chaotic field layout with a controlled rhythm system and a scalable archive index.

### Key decision
Field mode is not the full archive. Field mode is a curated entry surface.
Index mode is the scalable registry for all works, including future 100+ works.

### Changed files
- `src/pages/works/index.astro`
- `src/components/works/WorksArchive.tsx`
- `src/components/works/CuratedGrid.tsx`
- `src/components/works/CompactGrid.tsx`
- `src/styles/global.css`
- `docs/artist-stage-v3-works-manifestation-field-pass-01.md`

### What improved
- Field mode now limits visible works to a curated entry set of 9 while Index keeps the complete filtered archive.
- Intro right side now carries a quiet field register with count and active register state.
- Field rhythm uses controlled lead/support/normal spans instead of masonry-like offsets.
- Index mode metadata moved into a stable archive-register structure below thumbnails.
- Mobile field and index modes normalize into predictable columns.

### QA screenshots
- `screenshots/v3-13-works-field-desktop.png`
- `screenshots/v3-13-works-index-desktop.png`
- `screenshots/v3-13-works-metabodies-field.png`
- `screenshots/v3-13-works-mobile-390.png`
- `screenshots/v3-13-home-regression.png`
- `screenshots/v3-13-mt3-regression.png`

### Build status
Pass on 2026-06-06:

```txt
npm run build
```

Existing non-blocking warnings remain:

- SSR dynamic route `getStaticPaths()` warnings.
- Vite chunk-size warning.

Local dev server:

```txt
npm run dev -- --force --host 127.0.0.1
http://127.0.0.1:4324/
```

Route QA:

- `/works` 200
- `/` 200
- `/works/mt-3` 200

Screenshot QA notes:

- Field mode now opens with a measured 9-work visual route instead of a single oversized artwork.
- Index mode shows a 5-column desktop registry with visible year/title/cycle metadata below thumbnails.
- Meta-Bodies register updates count and active register to 8 manifestations.
- Mobile 390px stacks the intro/register/filter controls without clipping.
- Home and MT-3 regression screenshots remained visually stable.

### Remaining issues
- Field ordering still uses current data order; a future pass may introduce explicit editorial priority metadata.
- Index mode is ready for a larger archive visually, but true 100+ support may later need pagination, year grouping, or virtualization.

## Current Update - Shell Alignment + Route Role

`/works` now sits on the same canonical shell/header axis as Home, Artist, Contact, and Process.

- Keep the intro field, register rail, and filter controls aligned to the shared shell frame.
- `/works` remains the canonical field/index route into object pages.
- Process/method explanation belongs downstream on `/works/[slug]` and `/process`, not as a large explanatory block on the Works index itself.
