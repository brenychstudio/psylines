# ARTIST STAGE v3 - Work Detail Final Metadata Polish

## Goal
Connect Work Detail pages to the V3 artwork metadata and series taxonomy.

## Current problem
The Object Chamber is visually strong, but metadata is still not fully aligned with the new artwork content model.

## Target
Each work detail page should read as an art-object record: inventory, year, series/standalone context, format, dimensions, technique, materials, signature, certificate and collector route.

## Files touched
- src/pages/works/[slug].astro
- src/components/works/ObjectChamberHero.astro
- src/components/commerce/CollectorAcquisitionPanel.astro
- src/components/commerce/EditionProofCards.astro
- docs/artwork-content-gaps.md

## Not touched
Checkout API, commerce catalog, atmosphere engine, XR, AR, Home, Works, Series.

## QA routes
- /works/mt-3
- /works/mt-1
- /works/mt-2
- /works/figure-in-ash-light

## QA screenshots
- screenshots/v3-34-mt3-metadata-rail.png
- screenshots/v3-34-mt1-metadata-rail.png
- screenshots/v3-34-ash-standalone-metadata.png
- screenshots/v3-34-mt3-details-open.png
- screenshots/v3-34-mt3-mobile-390.png
- screenshots/v3-34-series-meta-regression.png
- screenshots/v3-34-works-regression.png

## Metadata fields visible
- Compact collector record: inventory, confirmed year and series/standalone context.
- Primary material line: medium line from taxonomy.
- Collector details: series/context, inventory, year, format, technique, surface, paper, materials, signature, certificate, routes and logistics.
- Signal band: series context, material context and object record.
- Hero identity line now uses taxonomy context instead of legacy series/year fields.

## Hidden / unknown behavior
- Missing years are not shown in the compact object record.
- Missing dimensions are omitted from the format row rather than filled with fake values.
- Standalone works use Independent Manifestation context.
- Works without a commerce catalog entry render a metadata/inquiry rail without checkout or scale-preview controls.
- Pending values remain documented as watch items instead of being invented in public copy.

## Build status
`npm run build` passes.

Existing dynamic-route prerender warnings and chunk-size warnings remain project-level warnings and were not introduced by this pass.

## Remaining watch items
- Several works still need author review for exact year, dimensions, technique note and acquisition status.
