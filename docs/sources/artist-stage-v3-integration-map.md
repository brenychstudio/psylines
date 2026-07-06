# ARTIST STAGE v3 - Integration Map Source

## Source
Imported from the user-provided file:

`C:\Users\CONCEPT2048\Downloads\artist-stage-v3-integration-map.md`

This document is treated as a project source for ARTIST STAGE v3 decisions.

## Core Conclusion
The current ARTIST STAGE build has a useful functional foundation: route structure, works archive, work detail acquisition, Stripe test checkout, interior preview MVP, trust/policy surfaces, SEO metadata, and a first Living Atmosphere layer.

The problem is not product architecture. The problem is the visual operating model.

Current site behavior:

```txt
page -> section -> card -> copy -> CTA
```

ARTIST STAGE v3 target behavior:

```txt
field -> state -> active surface -> inspect mode -> collector route -> spatial continuation
```

## Master Concept
Working name:

```txt
ARTIST STAGE v3 - Living Manifestation Interface
```

Product sentence:

```txt
ARTIST STAGE is a living collector-facing field where artworks appear as manifestations, editions become collector objects, and spatial continuation remains separate from commerce.
```

Operating formula:

```txt
signal -> state -> atmosphere -> reveal -> memory
```

Current user-facing flow to preserve:

```txt
Home -> Works Field -> Work Detail / Object Chamber -> Buy now / Preview in interior -> Stripe test checkout or collector route
```

## Source Systems
FIELD OS is the master behavior language. It gives the grammar of signal, state, atmosphere, reveal, and memory.

Living Site Environment is the umbrella web architecture. Pages should not behave as static templates:

```txt
Home = expressive living entry
Works = visual field / index
Work detail = object chamber
Contact / policies = calm collector desk
Immersive = experimental spatial continuation
```

Living Atmosphere Engine exists, but it should not be expanded into a full autonomous system yet. Use authored, low-intensity, local atmosphere first.

Content-Aware Atmosphere must remain local. It should influence object halo, inspect wall wash, collector panel edge, and focus lines. It should not recolor the whole page from artwork colors.

Cinematic Inspect Reveal is the highest-value system for `/works/mt-3`. Interior Preview should evolve from an inserted panel into an inspect mode where the base chamber stays mounted and dims while the preview layer appears.

Spatial Memory Depth should make the artwork feel like a controlled physical surface with subtle depth, not a static thumbnail or card.

Spatial Editions Field defines collector logic: selected edition/original becomes the active collector object; other sizes become supporting edition signals.

Living Home Canvas, Cinematic Frame Field, Series Constellation Field, Living Scroll Flow, Chameleon Header, sound systems, AR, and WhisperXR are later phases.

## Integration Priority
Tier 1, apply immediately to `/works/mt-3`:

```txt
Cinematic Inspect Reveal
Spatial Memory Depth
Content-Aware local halo
Spatial Editions object logic
FIELD OS state vocabulary
```

Tier 2, after Object Chamber v3 is approved:

```txt
Living Home Canvas
Cinematic Frame Field
Series Constellation Field
Living Scroll Flow
```

Tier 3, later enhancement:

```txt
Chameleon Header
Flowing Cinematic Menu
Premium Micro-Sound UI
Real AR module integration
```

Tier 4, hold:

```txt
WhisperXR production scene
Reality Composer
Full autonomous atmosphere
Collector Room route
```

## Object Chamber v3 State Model
Internal state vocabulary:

```txt
latent
awake
focused
inspecting
collector
returning
```

These names must not be exposed in visible UI.

## Object Chamber v3 Anatomy
Main shell:

```txt
ObjectChamberShell
- one stable wrapper
- controls page-scale or dim only during inspect
- no root remount
```

Artwork surface:

```txt
SpatialArtworkSurface
- large object plane
- subtle depth shadow
- image-safe parallax later
- local atmosphere halo
- no aggressive crop
```

Collector instrument:

```txt
CollectorInstrumentPanel
- not a product card
- reads like an object instrument / acquisition console
- size chips as edition signals
- Buy now remains primary
- Preview in interior opens inspect mode
```

Inspect layer:

```txt
CinematicInspectLayer
- persistent markup
- opacity + pointer-events
- base chamber dims
- interior preview and metadata appear as mode
- Escape / Return closes
```

Adjacent manifestations:

```txt
ManifestationRail
- supporting signals only
- no ecommerce recommendation feeling
- can become cinematic archive later
```

## First Manual Pass Scope
Edit:

```txt
src/pages/works/[slug].astro
src/components/works/ObjectChamberHero.astro
src/components/commerce/CollectorAcquisitionPanel.astro
src/components/commerce/InteriorPreviewPanel.astro
```

Avoid:

```txt
src/pages/api/checkout.ts
src/data/commerce/catalog.ts
src/lib/living-atmosphere/*
src/components/living-atmosphere/*
src/xr-core/*
src/xr-experiences/*
```

Optional later extraction:

```txt
src/components/works/SpatialArtworkSurface.astro
src/components/commerce/CinematicInspectLayer.astro
src/styles/object-chamber-v3.css
```

## Guardrails
- Do not add Collector Room route.
- Do not change Stripe behavior.
- Do not add real AR in pass 01.
- Do not change XR.
- Do not use full-page color tint from artwork.
- Do not build a generic modal.
- Do not animate root blur or backdrop-filter heavily.
- Do not remount the base scene on inspect open.
- Do not make purchase harder.
- Keep Buy now visible and direct.
- Keep Preview in interior secondary.

## QA Requirements
Capture and check:

```txt
/works/mt-3 desktop top
/works/mt-3 desktop mid
/works/mt-3 preview open
/works/mt-3 mobile 390px
/works/mt-3 tablet 768px
/works/figure-in-ash-light desktop top
```

Acceptance:

```txt
- artwork no longer feels like image inside card
- purchase panel no longer feels like dark SaaS card
- Preview in interior opens as a mode, not a small inserted panel
- atmosphere supports object, not whole-page tint
- Buy now still works
- size chips still update metadata
- mobile has no horizontal overflow
- page feels significantly different from current baseline
```

