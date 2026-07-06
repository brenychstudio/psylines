# ARTIST STAGE v3 - Works Query Filtering / Series-aware Index

## Goal
Make `/works?series=<series-slug>` open Works in a real series-filtered state.

## Current problem
Series pages can link to `/works?series=...`, but Works still needs to read the query and show the correct filtered context.

## Target
Works becomes a scalable index that supports all works, selected contexts, and series-specific views.

## Query behavior
- /works = all works
- /works?series=meta-bodies = Meta-Bodies works
- /works?series=night-water = Night Water works
- /works?series=studies = Studies works

## Files touched
- src/pages/works/index.astro
- src/data/site/artworkCollections.ts
- docs/artist-stage-v3-artwork-content-model-series-taxonomy.md

## Not touched
Checkout, commerce catalog, Work Detail, Home, XR, AR, atmosphere engine.

## QA screenshots
- screenshots/v3-33-works-all.png
- screenshots/v3-33-works-meta-bodies-field.png
- screenshots/v3-33-works-meta-bodies-index.png
- screenshots/v3-33-works-night-water.png
- screenshots/v3-33-works-studies.png
- screenshots/v3-33-works-invalid-series.png
- screenshots/v3-33-works-mobile-390.png
- screenshots/v3-33-series-meta-regression.png
- screenshots/v3-33-mt3-regression.png

## Query behavior notes
- `/works` keeps the full field and index behavior unchanged.
- `/works?series=<slug>` uses taxonomy helpers to scope the works list before any UI-level filtering.
- Series filter buttons now route to canonical query URLs instead of relying on legacy in-page-only state.
- `Editions` remains an in-page filter layered on top of the current works context.

## Observed counts
- `/works` -> 13 works
- `/works?series=meta-bodies` -> 6 works
- `/works?series=night-water` -> 1 work
- `/works?series=studies` -> 4 works
- `/works?series=wrong-slug` -> 0 works

## Sparse series behavior
- Night Water currently renders one confirmed work and does not invent additional content.
- Series-aware empty states stay calm and point back to the series chapter or full works field.

## Invalid query behavior
- `/works?series=wrong-slug` does not crash.
- The page shows a quiet invalid register state with links to `/series` and `/works`.

## Build status
`npm run build` passes.

Existing dynamic-route prerender warnings and chunk-size warnings remain project-level warnings and were not introduced by this pass.

## Remaining issues
- V3-35 supersedes the older lightweight filter-only behavior with centralized server-side query context for `series`, `view` and `register`.
- `npx tsc --noEmit` remains unavailable until `typescript` is added as a tooling dependency in a later task.

## Status
PASS

## V3-35 - Works Index Scalability / 100+ Ready

`/works` now separates curated Field mode from complete Index mode and supports taxonomy-aware query contexts for series, selected, flagship and standalone views.

### Query additions
- `/works?view=index`
- `/works?series=meta-bodies&view=index`
- `/works?register=selected`
- `/works?register=flagship`
- `/works?register=standalone`

### Data-flow change
Works query state is centralized in `src/data/site/worksIndex.ts` so Field mode can stay curated while Index mode renders the complete filtered register.
