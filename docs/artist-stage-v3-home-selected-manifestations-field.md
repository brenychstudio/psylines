# ARTIST STAGE v3 - Home Selected Manifestations Field

## Goal
Connect Home to the V3 artwork taxonomy and make it driven by selected works rather than hardcoded MT-3.

## Current problem
Home visually works as Living Manifestation Canvas, but the selected artwork logic is not yet data-driven.

## Target
Home uses `getSelectedArtworks()` as the source for active manifestation and peripheral traces.

## Key rule
Selected works are author-selected current works. They may belong to a series or be standalone works.

## Files touched
- src/pages/index.astro

## Not touched
Checkout, commerce catalog, Work Detail, Works layout, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-30-home-selected-desktop.png
- screenshots/v3-30-home-selected-mobile-390.png
- screenshots/v3-30-home-selected-tablet-768.png
- screenshots/v3-30-mt3-regression.png
- screenshots/v3-30-works-regression.png

## Selected works used
- MT-3
- MT-1
- MT-2
- ASH-1

## Active selected work
- MT-3 (`mt-3`)

## Trace works
- MT-1 (`mt-1`)
- MT-2 (`mt-2`)
- ASH-1 (`figure-in-ash-light`)

## Build status
`npm run build` passes.

Warnings observed during build are existing route prerender/chunk-size warnings and are not introduced by this task.

## Route smoke
- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/works/mt-1` - 200
- `/artist` - 200
- `/contact` - 200

## Remaining issues
- `npx tsc --noEmit` remains unavailable until `typescript` is added as a tooling dependency in a later task.

## V3-36H - Home Selected Manifestations Spatial Field

### Problem
Home was data-driven after V3-30, but visually still behaved like the old single-object hero.

### Goal
Rebuild Home as a spatial selected manifestations field using selected works and temporary test works from the current archive.

### Key decision
Home is not the full archive. Home is an authored living entrance into the current field.

### Visual target
- active selected work
- peripheral selected traces
- series / works / object routes
- atmosphere-aware composition
- no carousel
- no product grid

### Files touched
- src/pages/index.astro
- src/data/site/artworkCollections.ts

### Not touched
Works, Work Detail, Series, checkout, commerce, XR, AR, atmosphere engine.

### Screenshot list
- screenshots/v3-36h-home-spatial-desktop.png
- screenshots/v3-36h-home-spatial-hover.png
- screenshots/v3-36h-home-selected-register.png
- screenshots/v3-36h-home-mobile-390.png
- screenshots/v3-36h-works-regression.png
- screenshots/v3-36h-series-regression.png
- screenshots/v3-36h-mt3-regression.png

### Selected works used
- MT-3 (`mt-3`)
- MT-1 (`mt-1`)
- MT-2 (`mt-2`)
- ASH-1 (`figure-in-ash-light`)
- MT-4 (`mt-4`)
- MT-5 (`mt-5`)
- MT-10 (`mt-10`)
- MT-6 (`mt-6`)

### Active work
- MT-3 (`mt-3`)

### Orbit works
- MT-1 (`mt-1`)
- MT-2 (`mt-2`)
- ASH-1 (`figure-in-ash-light`)
- MT-4 (`mt-4`)
- MT-5 (`mt-5`)
- MT-10 (`mt-10`)

### Register works
- MT-3 (`mt-3`)
- MT-1 (`mt-1`)
- MT-2 (`mt-2`)
- ASH-1 (`figure-in-ash-light`)
- MT-4 (`mt-4`)
- MT-5 (`mt-5`)

### Build status
PASS - `npm run build` completed successfully.

Route smoke returned 200 for:
- `/`
- `/works`
- `/works?view=index`
- `/series`
- `/series/meta-bodies`
- `/works/mt-3`
- `/artist`
- `/contact`

Existing Astro dynamic-route prerender warnings and the Vite chunk-size warning remain project-level warnings and were not introduced by this pass.

### Remaining watch items
- Home now uses temporary test archive works to fill the spatial field until final content is loaded.
- Chrome headless screenshot capture produced service-level USB/GCM warnings while still writing screenshots; these are capture-environment warnings, not app errors.
- The hover screenshot is captured as the same route state because no browser automation dependency was added for hover simulation.

## V3-36H-R - Home Selected Field Interaction + Lower Scene Refoundation

### Problem
Home became taxonomy-driven and more spatial, but it still behaves like a static hero and a dry selected works list.

### Goal
Make Home behave like a living selected manifestations field:
- active work changes on hover/focus
- selected nodes update active image/caption/route/atmosphere
- lower selected section becomes a spatial route scene
- register becomes secondary, not the main visual block

### Key decision
Home is not the full archive. Home is an authored threshold into the current field.

### Files touched
- src/pages/index.astro

### Not touched
Works, Work Detail, Series, checkout, commerce, XR, AR, atmosphere engine.

### QA screenshots
- screenshots/v3-36hr-home-hero-active.png
- screenshots/v3-36hr-home-hero-hover.png
- screenshots/v3-36hr-home-lower-scene.png
- screenshots/v3-36hr-home-lower-hover.png
- screenshots/v3-36hr-home-mobile-390.png
- screenshots/v3-36hr-works-regression.png
- screenshots/v3-36hr-series-regression.png
- screenshots/v3-36hr-mt3-regression.png

### Active behavior notes
- Orbit traces and lower scene nodes now share the same local Home enhancement hooks.
- Hover/focus updates the active hero image, caption, object route, and atmosphere handoff slug.
- JS is progressive enhancement only; all states remain valid links without scripting.
- Hero hover QA confirmed the active route updates from `mt-3` to `mt-1`.
- Lower scene hover QA confirmed the active route updates from `mt-3` to `mt-2`.

### Lower scene notes
- The previous dry selected register is replaced by a spatial selected route scene.
- A thin selected register remains below the stage as secondary reference only.
- The lower scene is authored as a route, not a full archive grid.

### Selected works used
- MT-3 (`mt-3`)
- MT-1 (`mt-1`)
- MT-2 (`mt-2`)
- ASH-1 (`figure-in-ash-light`)
- MT-4 (`mt-4`)
- MT-5 (`mt-5`)
- MT-10 (`mt-10`)
- MT-6 (`mt-6`)

### Build status
- PASS - `npm run build`

### Route smoke
- `/` - 200
- `/works` - 200
- `/works?view=index` - 200
- `/works?register=selected` - 200
- `/series` - 200
- `/series/meta-bodies` - 200
- `/works/mt-3` - 200
- `/artist` - 200
- `/contact` - 200

### Remaining watch items
- Mobile 390px capture passed without horizontal overflow on the fresh dev server.
- Lower scene hover screenshot is composition-led and confirms route-node emphasis, but a future pass may want a tighter framed active-state crop if art direction needs it.
- Keep temporary test works only until final Home field assets are uploaded.

## Current Update - Living Editorial Surface Direction

### Current status
Home has moved beyond the earlier selected-register model. The current direction is a living selected-manifestations surface:

- Hero section remains the top authored entry point.
- The `Selected Manifestations` area is now treated as a spatial image field rather than a normal grid.
- Covers are data-driven from the current artwork collection.
- Clicked works can open a cinematic focus state before routing to the canonical Work page.
- Atmospheric tone follows the selected/active work.

### Canonical UX rule
Home is not the full archive. Home is a curated living entrance into the current field.

Use this route logic:

```txt
Home selected surface
-> cinematic focus / route preview
-> /works/[slug]
```

Do not turn Home into a commerce page. Acquisition stays on Work Detail.

### Related implementation
- `src/pages/index.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`
- `src/data/site/artworkCollections.ts`
- `public/scripts/artist-stage-cinematic-transition.js`

### Current watch items
- Final artwork selection/order still needs author review.
- Mobile rhythm should remain readable rather than preserving every desktop spatial offset.
- The focus-state atmosphere should stay refined; avoid large obvious halos or product-card overlays.

## Current Update - Shell Alignment Sync

Home now follows the same canonical shell/header axis as the other main public routes.

- The top living field and left editorial copy should stay aligned to the shared shell frame.
- Do not drift Home back into a narrower or off-axis composition than the header/Series reference frame.
- Shared long-route `Top` behavior now comes from the global shell layer rather than a Home-only pattern.
