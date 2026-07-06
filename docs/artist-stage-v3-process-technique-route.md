# ARTIST STAGE v3 - Process / Technique Route

## Purpose

Formalize `/process` as the canonical public route for the Body Manifestation Process.

This route translates the studio method canon into site language that can be used across:

- Artist statement
- Series context
- Work Detail / collector metadata
- Gallery dossier support material
- Future COA / metadata standards
- WhisperXR process bridge

The route is not a long internal essay and should not behave like a PDF dump. It is a short authored support route inside the cinematic system.

## Canonical Role

`/process` exists to explain how the work is made without collapsing the site into an educational or product-first structure.

Rule:

```txt
Artist = practice field
Series = context / chapter / image-led atmosphere
Work Detail = canonical object / collector route
Process = support route for method / technique / language canon
```

This keeps the method visible and trustworthy while preserving the main cinematic navigation logic.

## Content Source

The route is derived from the studio source document:

```txt
Meta_Bodies_Technique_Body_Manifestation_Process_UK.pdf
```

Working source naming used during implementation:

```txt
Meta Bodies - Method of Body Manifestation
Body Manifestation Process
```

Notes:

- The PDF is the primary studio reference and lives outside the repo.
- `/process` is a distilled public route, not a verbatim republication of the source document.
- The same canon should feed Artist, Series support language, Work Detail metadata, and future COA/dossier text.

Its public role is to make the following points clear:

- the work does not begin from photographic copying;
- the body is found inside a charcoal line field;
- fixation, acrylic medium, color field, and final charcoal-pencil structure are part of the method;
- Inner Structures are not ornament but internal routes / codes / replacements for anatomy.

## Route Structure

The route currently includes:

1. Threshold statement:
   `The body appears from gesture, not reference.`
2. Canon section:
   short public definition of the Body Manifestation Process
3. Seven-stage sequence:
   `gesture -> looking -> contour reveal -> fixed trace -> acrylic membrane -> color field -> return of the line`
4. Material stack:
   charcoal, fixative, acrylic medium, acrylic paint, charcoal pencil, archival paper
5. Public language section:
   not copied / not sketch / not ornament
6. Work Detail / COA / metadata section:
   technique, reference policy, layers, type
7. WhisperXR bridge:
   physical process -> spatial translation

## UX / Design Rules

- Keep the route cinematic and atmospheric, consistent with the rest of V3.
- Do not add product cards, pricing, collector action modules, or commerce logic to this page.
- Do not over-explain with academic or institutional filler.
- Use calm, precise, collector-legible language.
- The page may use artwork-derived traces and details; real studio process photography is optional for a future pass.

## Integration Points

Current integrations:

- `/artist` now links to `/process` and includes a compact method section.
- `/series/[slug]` links to `/process` as a support route from the cinematic chapter.
- `/works/[slug]` collector details now expose:
  - Method
  - Process
  - Reference
  - Layers
  - Process link in trust routes
- Footer includes `Process` as a quiet support link.

Relevant files:

- `src/pages/process.astro`
- `src/data/site/process.ts`
- `src/pages/artist.astro`
- `src/pages/series/[slug].astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/data/site/artworkMeta.ts`

## Metadata Contract

The process pass introduced structured technique fields in `ArtworkMeta`:

- `technique`
- `techniqueNote`
- `primaryGesture`
- `surfaceLayer`
- `colorLayer`
- `finalLine`
- `referencePolicy`
- `processNote`

These fields support:

- Work Detail collector language
- future COA formatting
- gallery dossier exports
- content QA across the active archive

## Current Limitations

- The route currently uses artwork-derived imagery, not dedicated studio process photography.
- Metadata fields are structurally ready but still need author verification per work.
- The route is implemented as a support layer and should remain shorter than the internal source canon.

## Current Update - Cinematic Stillness Behavior

The Process route now includes an experimental stillness layer.

Intent:

```txt
When the visitor stops interacting, secondary content gradually recedes and the route becomes quieter.
When the visitor moves, scrolls, or uses input again, the content returns smoothly.
```

This is not a hiding gimmick. It is a potential reusable ARTIST STAGE interaction language for contemplative pages where the artwork or atmosphere should become more present during inactivity.

Implementation reference:

- `src/components/cinematic/CinematicIdleField.astro`
- `src/pages/process.astro`

Current rule:

- content should not disappear all at once;
- fade timing should feel staged and hypnotic;
- important navigation and accessibility should remain recoverable through ordinary activity;
- respect reduced-motion preferences.

Watch item:

This is promising, but it still needs future art-direction tuning before being applied globally.

## Documentation Rule

If the source PDF changes, keep these layers in sync:

1. `src/data/site/process.ts`
2. `/process`
3. Artist practice-method excerpts
4. Work Detail technique/reference/layer metadata language
5. This document and the current development handoff

## Next Useful Pass

Recommended follow-up:

1. Review `/process` on desktop/mobile with final art direction.
2. Decide whether to add real process images:
   hand / charcoal / fixative / acrylic medium / color / inner-structure details.
3. Audit all active works for paper, medium, reference policy, and layer accuracy.
4. Reuse the same language for gallery dossier / COA output when that layer is implemented.
