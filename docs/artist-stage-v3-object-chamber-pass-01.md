# ARTIST STAGE v3 - Object Chamber Pass 01

## Goal
Transform `/works/mt-3` into the first Object Chamber v3 prototype.

## Current Problem
The page works functionally but still reads too much like a dark product-detail layout.

## Target
Artwork becomes a spatial object surface.

Acquisition panel becomes a collector instrument.

Interior preview becomes the beginning of an inspect mode.

Atmosphere supports the active work locally.

## Files Touched
Planned:

```txt
src/pages/works/[slug].astro
src/components/works/ObjectChamberHero.astro
src/components/commerce/CollectorAcquisitionPanel.astro
src/components/commerce/InteriorPreviewPanel.astro
```

Documentation:

```txt
docs/project-brief.md
docs/sources/artist-stage-v3-integration-map.md
docs/sources/artist-stage-v3-work-detail-pass-01.md
docs/artist-stage-v3-object-chamber-pass-01.md
```

## Not Touched
```txt
src/pages/api/checkout.ts
src/data/commerce/catalog.ts
src/data/site/works.ts
src/lib/living-atmosphere/*
src/components/living-atmosphere/*
src/pages/immersive/*
src/xr-core/*
src/xr-experiences/*
```

Checkout, catalog, Stripe, XR, route structure, and global atmosphere engine remain unchanged.

## QA Screenshots
Required after implementation:

- `/works/mt-3` desktop top
- `/works/mt-3` preview open
- `/works/mt-3` mobile 390
- `/works/figure-in-ash-light` desktop top
- `/works/mt-3` mid-scroll with proof cards and adjacent manifestations

## QA Checklist
- `/works/mt-3` opens.
- Default Original still shows EUR 850.
- Size chips update price, format, route, proof, material, production, return, and delivery.
- Preview in interior opens and closes.
- Escape closes preview.
- Buy now checkout logic remains wired.
- Trust links still work.
- Adjacent manifestations still link.
- Mobile 390px has no horizontal overflow.
- Tablet 768px does not look broken.
- Build passes.

## Acceptance
- `/works/mt-3` no longer reads as two generic dark cards.
- Artwork feels like a spatial object surface.
- Acquisition panel feels like a collector instrument.
- Preview in interior feels closer to inspect mode, not accordion.
- Checkout behavior unchanged.
- Size chip behavior unchanged.
- No catalog/API/XR/atmosphere changes.
- Mobile is not broken.
- `/works/figure-in-ash-light` still works with long title.
- `npm run build` passes.

## Implementation Notes
Status: implemented.

Baseline build before edits: pass on 2026-06-05.

Post-edit build: pass on 2026-06-05.

Existing non-blocking warnings:

- Dynamic `getStaticPaths()` warnings on SSR dynamic pages.
- Vite chunk size warning.

Implemented:

- Added `object-chamber-v3`, `is-object-ready`, `is-collector-ready`, and `data-object-chamber-state="awake"` to the work detail chamber shell.
- Added `data-spatial-artwork` and object surface classes around the artwork media.
- Preserved the existing artwork image source and data flow.
- Added collector instrument zoning classes without removing commerce data hooks.
- Added inspect foundation classes to Interior Preview while preserving close controls and preview metadata hooks.
- Added minimal inspect state behavior:
  - opening preview sets `data-object-chamber-state="inspecting"` and `is-inspect-open`
  - closing preview or pressing Escape returns `data-object-chamber-state="awake"`
- Added local Pass 01 CSS in `src/pages/works/[slug].astro`.

## QA Result
Local dev server:

```txt
http://127.0.0.1:4322
```

Build:

```txt
npm run build
```

Result: pass.

Headless interaction QA:

```txt
Initial active option: Original
Initial price: EUR 850
Initial format: A3 - 29.7 x 42 cm
Selected 30x40 price: EUR 220
Selected 30x40 route: Limited edition print
Preview open state: inspecting
Escape close state: awake
Mobile 390 overflow: false
Tablet 768 overflow: false
Figure in Ash Light overflow: false
```

Notes:

- Buy now button remains present and wired; no automated Stripe session was created during this pass.
- Checkout/API/catalog/XR/global atmosphere files were not edited.
- Existing build warnings remain non-blocking and unchanged in nature.

## Screenshot Artifacts
- `screenshots/object-chamber-pass-01-mt3-desktop-top.png`
- `screenshots/object-chamber-pass-01-mt3-preview-open.png`
- `screenshots/object-chamber-pass-01-mt3-mobile-390.png`
- `screenshots/object-chamber-pass-01-figure-desktop-top.png`
- `screenshots/object-chamber-pass-01-mt3-mid-scroll.png`

## Pass 02 Notes
Task:

```txt
Wide Object Chamber + Collector Instrument Compression
```

Status: implemented.

### What Changed
- Chamber width now uses a wide field target:

```txt
min(1680px, calc(100vw - clamp(40px, 7vw, 120px)))
```

- Header and footer width were minimally aligned with the wider site field.
- Artwork plane was enlarged and the object shell was quieted:
  - reduced inner frame feeling
  - stronger object depth
  - local glow remains subtle
  - no crop or hover effect added
- Collector panel was compressed:
  - route intro reduced to one short line
  - proof/material display values shortened
  - production, delivery, and returns remain in DOM behind a quiet details summary
  - all required `data-*` hooks remain present
- Lower proof cards and adjacent manifestations now align with the wider chamber field.
- Mobile header spacing was tightened so navigation does not clip at 390px.

### What Improved
- `/works/mt-3` no longer reads as a narrow centered column.
- Artwork is visibly more dominant and closer to an object-first surface.
- Collector panel has less visible table noise and a clearer acquisition route.
- Adjacent manifestations feel more connected to the chamber width.
- Mobile remains stable with no horizontal overflow.

### What Still Feels Weak
- Interior Preview is still an inline inspect foundation, not a full cinematic inspect layer.
- Lower proof cards are quieter and aligned, but they are still structurally simple.
- The next useful pass should focus on the real `Cinematic Inspect Reveal` behavior rather than more width tuning.

### QA Result
Build:

```txt
npm run build
```

Result: pass.

Headless QA summary:

```txt
Desktop chamber width: 1680px on 2048px viewport
Artwork box: approx. 434 x 651px on 2048px viewport
Original default: EUR 850
30x40 selected price: EUR 220
30x40 route: Limited edition print
30x40 proof: Edition of 30 - signed - certificate
30x40 material: Pigment print / archival paper
Preview open state: inspecting
Escape close state: awake
Desktop overflow: false
Tablet 768 overflow: false
Mobile 390 overflow: false
Figure in Ash Light overflow: false
```

No checkout/API/catalog/XR/global atmosphere files were edited.

### Pass 02 Screenshot Artifacts
- `screenshots/object-chamber-pass-02-mt3-desktop-top.png`
- `screenshots/object-chamber-pass-02-mt3-preview-open.png`
- `screenshots/object-chamber-pass-02-mt3-mobile-390.png`
- `screenshots/object-chamber-pass-02-figure-desktop-top.png`
- `screenshots/object-chamber-pass-02-mt3-lower-section.png`

## Pass 03 Notes
Task:

```txt
De-carded Object Field
```

Status: implemented.

### What Changed
- Main chamber presentation was de-carded:
  - visible container borders were reduced
  - object/panel card backgrounds were quieted
  - grid structure remains, but reads more like a spatial field
- Artwork now reads more as a suspended object plane:
  - no decorative frame
  - stronger shadow and local field glow
  - label behaves more like a museum caption than a badge
- Collector panel became a quiet annotation/acquisition rail:
  - primary CTA is now `Acquire`
  - `data-buy-now` is preserved
  - proof/material/route are shown as one quiet collector signal line
  - production, delivery, and returns are behind `Collector details`
- Edition proof cards became a conceptual signal band.
- Adjacent manifestations became `Adjacent traces`.
- Interior Preview opens as a floating inspect foundation on desktop, not another inline card.

### What Improved
- Page no longer primarily reads as image card + product card.
- Artwork is the dominant visual event.
- Visible acquisition text is substantially quieter.
- Lower Material/Cycle/Route layer no longer reads as generic cards.
- Adjacent works read less like ecommerce recommendations.
- Mobile remains stable.

### What Still Feels Weak
- Interior Preview is still a foundation, not the final Cinematic Inspect Reveal.
- A future pass should move inspect into a deliberate chamber layer with stronger spatial behavior.
- Header is quieter, but the full Chameleon Header system is still later work.

### QA Result
Build:

```txt
npm run build
```

Result: pass.

Headless QA summary:

```txt
CTA text: Acquire
Original default: EUR 850
Artwork box: approx. 466 x 699px on 2048px viewport
30x40 selected price: EUR 220
30x40 route: Limited edition print
30x40 proof: Edition of 30 - signed - certificate
30x40 material: Pigment print / archival paper
Preview open state: inspecting
Escape close state: awake
Desktop overflow: false
Tablet 768 overflow: false
Mobile 390 overflow: false
Figure in Ash Light overflow: false
```

No checkout/API/catalog/XR/global atmosphere files were edited.

### Pass 03 Screenshot Artifacts
- `screenshots/object-field-pass-03-mt3-desktop-top.png`
- `screenshots/object-field-pass-03-mt3-preview-open.png`
- `screenshots/object-field-pass-03-mt3-mobile-390.png`
- `screenshots/object-field-pass-03-figure-desktop-top.png`
- `screenshots/object-field-pass-03-mt3-lower-field.png`

## Pass 04 - Spatial Scale + Presence

Task:

```txt
Spatial Scale + Artwork Presence Pass
```

Status: implemented.

### Goal
Increase artwork presence and rebalance the collector rail without returning to card UI or product-page styling.

### Changed
- Added a new CSS override layer after Pass 03:
  - `V3 Object Field - Pass 04: Spatial Scale + Presence`
- Rebalanced the desktop object field:
  - chamber width targets a wider but controlled field
  - artwork column now carries more visual weight
  - collector rail is wider, taller, and easier to read
  - lower spacing after the main chamber is tighter
- Increased artwork scale:
  - MT-3 desktop QA artwork box is approximately `512 x 768px`
  - Figure in Ash Light uses the same object scale safely
  - image remains contained with `object-fit: contain`
- Added spatial object presence:
  - local atmospheric halo
  - floor shadow
  - subtle plane depth
  - small hover/focus lift
  - reduced-motion override keeps the plane still
- Increased collector rail readability:
  - larger title and statement
  - larger size chips
  - stronger price/format values
  - taller, more tactile actions
  - visible proof line remains one quiet signal line
- Repositioned Interior Preview for the larger rail:
  - desktop preview is now anchored to the collector route area
  - panel is visible in the first viewport after opening
  - tablet/mobile return preview to normal document flow

### QA Screenshots
- `screenshots/object-spatial-pass-04-mt3-desktop-top.png`
- `screenshots/object-spatial-pass-04-mt3-preview-open.png`
- `screenshots/object-spatial-pass-04-mt3-mobile-390.png`
- `screenshots/object-spatial-pass-04-figure-desktop-top.png`
- `screenshots/object-spatial-pass-04-mt3-lower-section.png`

### QA Result
Build:

```txt
npm run build
```

Result: pass.

Headless QA summary:

```txt
CTA text: Acquire
Original default: EUR 850
Desktop MT-3 artwork box: approx. 512 x 768px
Desktop collector rail box: approx. 560 x 829px
50x70 selected price: EUR 390
50x70 format: 50 x 70 cm
50x70 route: Limited edition print
50x70 proof: Edition of 30 - signed - certificate
50x70 material: Pigment print / archival paper
Preview open state: inspecting
Escape close state: awake
Desktop overflow: false
Tablet 768 overflow: false
Mobile 390 overflow: false
Figure in Ash Light overflow: false
Works page overflow: false
Home page overflow: false
```

### Remaining Issues
- Interior Preview is now visible and stable, but still remains the earlier inspect foundation.
- Next likely pass: Cinematic Inspect Reveal, if the main object field is accepted.
- Full Chameleon Header remains future work.

No checkout/API/catalog/XR/global atmosphere files were edited.
