# ARTIST STAGE v3 - Works Index Scalability / 100+ Ready Pass

## Goal
Prepare `/works` for 100+ artworks by separating curated Field mode from complete Index mode.

## Current problem
`/works` works as a series-aware page, but it still needs a scalable registry model before the archive grows.

## Key decision
Field mode is an authored visual route.
Index mode is the full archive register.

## Query model
- /works
- /works?view=index
- /works?series=meta-bodies
- /works?series=meta-bodies&view=index
- /works?register=selected
- /works?register=flagship
- /works?register=standalone

## Files touched
- src/data/site/worksIndex.ts
- src/data/site/artworkCollections.ts
- src/pages/works/index.astro

## Not touched
Checkout, commerce catalog, Work Detail, Home, Series routes, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-35-works-field-all.png
- screenshots/v3-35-works-index-all.png
- screenshots/v3-35-works-meta-bodies-field.png
- screenshots/v3-35-works-meta-bodies-index.png
- screenshots/v3-35-works-selected.png
- screenshots/v3-35-works-flagship.png
- screenshots/v3-35-works-standalone.png
- screenshots/v3-35-works-invalid.png
- screenshots/v3-35-mobile-390.png
- screenshots/v3-35-mt3-regression.png

## Route behavior
- `/works` opens in Field mode and renders the curated field subset.
- `/works?view=index` opens the complete archive register.
- `/works?series=meta-bodies` opens Meta-Bodies in Field mode.
- `/works?series=meta-bodies&view=index` opens all Meta-Bodies works in Index mode.
- `/works?series=night-water` opens the sparse Night Water register without fake content.
- `/works?series=studies` opens the Studies register.
- `/works?register=selected` opens selected works.
- `/works?register=flagship` opens flagship works.
- `/works?register=standalone` opens standalone works.
- `/works?series=wrong-slug` renders a calm invalid register state.

## Counts observed
- `/works`: 12 Field entries from 13 total works.
- `/works?view=index`: 13 Index entries.
- `/works?series=meta-bodies`: 6 Field entries.
- `/works?series=meta-bodies&view=index`: 6 Index entries.
- `/works?series=night-water`: 1 Field entry.
- `/works?series=studies`: 4 Field entries.
- `/works?register=selected`: 4 Field entries.
- `/works?register=flagship`: 2 Field entries.
- `/works?register=standalone`: 2 Field entries.
- `/works?series=wrong-slug`: 0 entries with empty-register messaging.

## Build status
PASS - `npm run build` completed successfully.

Existing Astro dynamic-route prerender warnings and the chunk-size warning remain project-level warnings and were not introduced by this pass.

## Remaining watch items
- Some compact index thumbnails still depend on the existing source artwork visibility and asset preparation. This is an image/content watch item, not a V3-35 data-flow regression.
- Future archive filters remain documented only: format, orientation, year, availability, medium/material and acquisition status.
- `npx tsc --noEmit` remains unavailable until `typescript` is added as a tooling dependency in a later task.

## Status
PASS
