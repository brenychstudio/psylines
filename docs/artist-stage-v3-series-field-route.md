# ARTIST STAGE v3 - Series Field Route

## Goal
Create `/series` as a cinematic field of authored series.

## Current problem
Series currently exist only as taxonomy/data and are not yet navigable as a dedicated authored layer.

## Target
Series are presented as fields / chapters, not filters.

## Files touched
- src/pages/series/index.astro
- src/layouts/BaseLayout.astro if nav update is needed

## Not touched
Checkout, commerce catalog, Work Detail, Works layout, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-31-series-desktop.png
- screenshots/v3-31-series-mobile-390.png
- screenshots/v3-31-series-tablet-768.png
- screenshots/v3-31-home-regression.png
- screenshots/v3-31-works-regression.png
- screenshots/v3-31-mt3-regression.png

## Visible series
- Meta-Bodies / Inner Structures (`meta-bodies`, active)
- Night Water (`night-water`, future)
- Studies / Fragments (`studies`, studies)

## Link behavior
Series nodes link to `/works?series=...` for V3-31 so the route does not depend on the next chapter route pass.

V3-32 can retarget nodes to `/series/[slug]`.

## Nav decision
Series is now included in the main nav between Home and Works.

## Build status
`npm run build` passes.

Warnings observed during build are existing dynamic-route prerender/chunk-size warnings and are not introduced by this task.

## Route smoke
- `/series` - 200
- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/artist` - 200
- `/contact` - 200

## Query link smoke
- `/works?series=meta-bodies` - 200
- `/works?series=night-water` - 200
- `/works?series=studies` - 200

## Pass V3-31R - Series Field Cinematic Composition

### Problem
The first `/series` pass created the route, but the lower field still reads like a simple card layout.

### Goal
Recompose `/series` as a cinematic field of authored series / chapters.

### Key decisions
- Meta-Bodies becomes the dominant active series node.
- Night Water is shown as latent / submerged / future.
- Studies is shown as fragmentary / material / study-state.
- Series nodes are spatial surfaces, not cards.
- Text is field notation, not poster overlay.
- Links remain `/works?series=<slug>` until `/series/[slug]` exists.

### Files touched
- src/pages/series/index.astro

### Not touched
Home, Works, Work Detail, checkout, commerce, XR, AR, atmosphere engine.

### Screenshots
- screenshots/v3-31r-series-desktop-top.png
- screenshots/v3-31r-series-field-composition.png
- screenshots/v3-31r-series-mobile-390.png
- screenshots/v3-31r-series-tablet-768.png
- screenshots/v3-31r-home-regression.png
- screenshots/v3-31r-works-regression.png
- screenshots/v3-31r-mt3-regression.png

### What changed from V3-31
- Replaced equal-weight node/card styling with a 12-column spatial field.
- Split each series node into an artwork surface and nearby notation.
- Removed large text over artwork centers.
- Added distinct active, future and studies treatments.
- Kept existing atmosphere handoff attributes.

### Hierarchy decision
- Meta-Bodies is the largest active node.
- Night Water is lower, dimmer and more submerged.
- Studies remains smaller and more material/fractured.

### V3-31R build status
`npm run build` passes.

Warnings observed during build are existing dynamic-route prerender/chunk-size warnings and are not introduced by this task.

### V3-31R route smoke
- `/series` - 200
- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/artist` - 200
- `/contact` - 200

## Pass V3-31S - Series Field Micro Calibration

### Goal
Small visual calibration of `/series` after V3-31R.

### Issues addressed
- Night Water was too hidden.
- Threshold-to-field transition felt slightly static.
- Series nodes needed a stronger sense of one connected field.
- Mobile spacing required a quick stability check.

### Files touched
- src/pages/series/index.astro

### Not touched
Home, Works, Work Detail, checkout, commerce, taxonomy data, XR, AR, atmosphere engine.

### Screenshots
- screenshots/v3-31s-series-desktop-top.png
- screenshots/v3-31s-series-field-calibrated.png
- screenshots/v3-31s-series-mobile-390.png
- screenshots/v3-31s-series-tablet-768.png
- screenshots/v3-31s-home-regression.png
- screenshots/v3-31s-works-regression.png
- screenshots/v3-31s-mt3-regression.png

### Micro-calibration notes
- Added a dedicated V3-31S override block at the end of the local Series CSS.
- Lifted Night Water notation and surface slightly without making it compete with Meta-Bodies.
- Added a connective field wash and notation route line so the lower section reads as one field.
- Softened the threshold-to-field handoff with tighter spacing and a low-opacity fade.
- Kept safe `/works?series=...` links and existing atmosphere handoff attributes.

### Final status
PASS WITH WATCH ITEMS

### Watch items
- Night Water remains intentionally faint at the narrowest mobile capture. It is more readable than before, but still should be watched again once `/series/[slug]` introduces deeper chapter context.

### V3-31S build status
`npm run build` passes.

Warnings observed during build are existing dynamic-route prerender/chunk-size warnings and are not introduced by this task.

### V3-31S route smoke
- `/series` - 200
- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/artist` - 200
- `/contact` - 200
- `/works?series=meta-bodies` - 200
- `/works?series=night-water` - 200
- `/works?series=studies` - 200

## Remaining issues
- `/works?series=...` still opens the general Works index until the later series-aware filtering pass.
- `npx tsc --noEmit` remains unavailable until `typescript` is added as a tooling dependency in a later task.

## Pass V3-32 - Series Chapter Route

### Change
Series overview nodes now link to `/series/[slug]` because dedicated chapter routes exist.

### Safe routes
- /series/meta-bodies
- /series/night-water
- /series/studies

### Link behavior
- `/series` overview nodes now route to `/series/[slug]`
- chapter routes still provide `/works?series=<slug>` as the bridge into the Works field
- flagship and register links route into `/works/[slug]`

### Screenshots
- screenshots/v3-32-series-overview-regression.png
- screenshots/v3-32-series-meta-bodies-top.png
- screenshots/v3-32-series-night-water-latent.png
- screenshots/v3-32-series-studies.png

### Not touched
Checkout, commerce, XR, AR, atmosphere engine.

## Current Update - Constellation Field Route

### Current status
The `/series` route has evolved from the early spatial card field into an interactive constellation map.

Current behavior:

- Series and selected object signals live on a large spatial plane.
- Covers are separated with generous field spacing.
- Active node receives stronger scale, clarity, and atmosphere.
- Hovered inactive nodes revive visually without changing the selected route.
- Clicking a node selects it and pans the camera smoothly toward it.
- Drag and wheel panning are supported.
- Cover CTA opens the relevant series/object route.
- Footer is removed from this route to keep the field immersive.

### Connection system
The earlier straight connector lines were replaced by a more living field language:

- curved/dashed neural connections;
- subtle pulse/trace behavior;
- connections read as an organism rather than a diagram.

### UX rule
`/series` is the chapter map. It should invite exploration before commitment.

Use this route logic:

```txt
/series
-> select / pan / inspect the field
-> /series/[slug]
-> fullscreen image inspector
-> View work
-> /works/[slug]
```

### Related implementation
- `src/pages/series/index.astro`
- `src/components/series/SeriesConstellationField.tsx`
- `src/pages/series/[slug].astro`
- `src/data/site/series.ts`
- `src/data/site/artworkCollections.ts`

## Current Update - Route Entry Stabilization

The `/series` route now guards against black placeholder cover flashes during route entry.

Implemented:

- key constellation covers are preloaded before the field settles;
- collection index routes such as `/series` no longer accept an arrival morph fallback from the global transition layer;
- route entry now reveals real covers immediately instead of temporary black surfaces.

Relevant files:

- `src/pages/series/index.astro`
- `src/layouts/BaseLayout.astro`
- `public/scripts/artist-stage-cinematic-transition.js`

### Current watch items
- Keep performance stable; avoid expensive full-screen canvas/WebGL for the connector system unless absolutely necessary.
- Maintain enough spacing between nodes so the route reads as a field, not a crowded gallery.
- Continue to prefer authored tone tokens over automatic pixel extraction until the visual language is locked.

## Current Update - WebGL Atmosphere Field

The `/series` constellation now includes a WebGL atmosphere layer adapted from the local extract:

- source/reference folder: `backdrop-16-kool-berk-webgl-background-extract/`
- runtime script: `public/scripts/kool-berk-background.js`
- Astro mount component: `src/components/series/SeriesWebGLBackdrop.astro`

Important implementation decision:

```txt
The WebGL host is mounted in `src/pages/series/index.astro`, outside the React island.
```

This prevents React hydration from removing the canvas after it appears for a moment. Do not move the WebGL host back inside `SeriesConstellationField.tsx` unless the React component becomes responsible for owning and preserving the canvas lifecycle.

Current behavior:

- background cloud field is visible behind the constellation;
- atmosphere receives active tone variables from the selected series/object;
- drag/wheel/selection movement sends motion energy to the background;
- node halos use authored tone variables so artworks feel more attached to the surrounding atmosphere;
- legacy heavy overlays were reduced so the WebGL layer can remain visible.

Watch items:

- Continue tuning density, darkness, and color response so the WebGL field supports artworks instead of becoming a separate decorative sky.
- Keep the artwork surfaces visually primary.
- Keep low-powered hardware performance in mind; this is a living field, not a full-screen WebGL demo page.
