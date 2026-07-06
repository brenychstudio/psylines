# ARTIST STAGE v3 — Artwork Content Model + Series Taxonomy

## Goal
Create a canonical content model for artworks, series, standalone works, flagship works and selected works.

## Problem
The visual system and living atmosphere are now strong, but artwork navigation and taxonomy are not yet developed enough for 100+ works.

## Key decision
Series are not filters. Series are authored fields / chapters.

## Taxonomy
- Series works
- Standalone works
- Flagship works
- Selected works
- All works index

## Future routes enabled
- /series
- /series/[slug]
- /works
- /works/[slug]

## Files created
- src/data/site/series.ts
- src/data/site/artworkMeta.ts
- src/data/site/artworkCollections.ts

## Not touched
Checkout, commerce catalog, XR, AR, atmosphere engine, visual layouts.

## Implementation notes
- `src/data/site/series.ts` now contains the canonical `artworkSeries` model while preserving the existing legacy `series` export used by the current `/series` pages.
- `src/data/site/artworkMeta.ts` acts as a metadata overlay by slug and does not replace `works.ts`.
- `src/data/site/artworkCollections.ts` enriches existing works with metadata and canonical series references.
- Unknown facts are marked with `needs_author_review` or left optional.
- Standalone works are not represented as a fake series.

## QA
- Build must pass.
- Existing routes must remain visually unchanged.
- Existing `/series` pages must keep using the legacy `series` route data until a dedicated migration pass.
- No checkout, commerce, XR, AR, or atmosphere files were changed.

## V3-33 - Series-aware Works Query Filtering

`/works` now supports `?series=<series-slug>` and uses taxonomy metadata to render a filtered Works context.
