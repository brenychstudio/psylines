# ARTIST STAGE v3 - Current Development Handoff

## Snapshot

Date: 2026-07-06

Project: ARTIST STAGE  
Stack: Astro + React + TypeScript + CSS custom properties + vanilla JS cinematic systems + Three/AR preview modules  
Current status: advanced cinematic prototype / core route system implemented / collector Work Detail and Process route integrated / Series WebGL atmosphere in active art-direction review

## Core Concept

ARTIST STAGE is not a conventional portfolio, landing page, or product grid. It is a living cinematic artwork field.

The current route logic is:

```txt
Home living field
-> Series WebGL constellation map
-> Series cinematic chapter
-> Fullscreen photo inspector
-> View work
-> Work detail / collector route
-> Process / technique support route
-> Contact / collector handoff
```

The most important conceptual decision:

```txt
Series = context, chapter, atmosphere, immersive viewing.
Works / Work Detail = canonical object record, collector action, print/original options, AR/scale preview.
```

Do not turn the Series inspector into a product-card interface. Keep it image-first and use `View work` as the bridge into `/works/[slug]`.

## Main Navigation

Current header order:

```txt
Home -> Series -> Works -> Immersive -> Artist -> Process -> Contact
```

The public shell has been aligned so the main routes share a consistent header axis and wide-screen frame.

## Key Current Features

### Home

Home is a living selected-manifestations field.

- Hero remains the top authored entry.
- Selected manifestations are treated as a spatial image field, not a normal grid.
- The field now has smoother cinematic switching and softer floating motion.
- Background works revive on hover and can be clicked to become the active work.
- A `Next` gesture moves the user into the next section without fighting the carousel scroll behavior.
- Route to object detail is handled through canonical `/works/[slug]`.

Relevant files:

- `src/pages/index.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`
- `docs/artist-stage-v3-home-selected-manifestations-field.md`
- `docs/artist-stage-v3-home-cinematic-field-motion.md`

### Series Map

`/series` is an interactive constellation field with WebGL atmosphere.

- Nodes are spatially placed, not gridded.
- Active/hovered nodes have visual life and atmosphere.
- Drag and wheel panning are supported.
- Clicking/selecting nodes pans the camera smoothly.
- Connections are living neural traces, not simple straight lines.
- Footer is removed from the route.
- WebGL cloud/backdrop layer now sits behind the constellation and reacts to field movement and active tone.
- The WebGL host is mounted outside the React island so React hydration does not delete the canvas.

Relevant files:

- `src/pages/series/index.astro`
- `src/components/series/SeriesWebGLBackdrop.astro`
- `src/components/series/SeriesConstellationField.tsx`
- `public/scripts/kool-berk-background.js`
- `src/data/site/series.ts`
- `docs/artist-stage-v3-series-field-route.md`
- `docs/artist-stage-v3-series-webgl-atmosphere-field.md`

### Series Chapter

`/series/[slug]` is a cinematic chapter page.

Implemented:

- Left chapter copy.
- Wide spatial hero carousel.
- Active hero frame opens fullscreen inspector.
- Inactive hero frame first becomes active.
- Lower living sequence field opens the same inspector.
- Fullscreen inspector supports prev/next, wheel, swipe, keyboard, progress bar.
- `View work` CTA routes to canonical `/works/[slug]`.
- Inspector opening/closing was stabilized to remove blinking and duplicate image layers.
- When a user changes images inside the inspector and closes it, the carousel stays on the last viewed image.

Relevant files:

- `src/pages/series/[slug].astro`
- `public/scripts/artist-stage-cinematic-transition.js`
- `docs/artist-stage-v3-series-chapter-route.md`

### Work Detail

`/works/[slug]` is the canonical work/object/acquisition page.

Implemented:

- Object chamber.
- Collector acquisition panel.
- Process-aware metadata and method language.
- Format/price switching.
- Inquiry/acquire hierarchy.
- Stripe checkout hooks.
- Interior scale preview.
- AR / 3D print preview host.
- Artwork surface lens/magnifier.
- Collector details cinematic reveal.
- Related/adjacent works.
- Atmosphere override per work.

Not final:

- Production mobile AR GLB/USDZ hosting and device QA.
- Final AR frame/material realism.
- Live production-sales verification.
- Final legal/policy review.
- Full artwork metadata audit.

Relevant files:

- `src/pages/works/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/modules/print-ar/`
- `src/features/print-ar-host/`
- `docs/artist-stage-v3-work-detail-collector-ar-completion.md`

### Process / Technique

`/process` is the canonical public route for the Body Manifestation Process.

Implemented:

- Dedicated authored route for the process / technique layer.
- Public language distilled from `Meta_Bodies_Technique_Body_Manifestation_Process_UK.pdf`.
- Seven-stage manifestation sequence.
- Material stack and reference-policy language.
- Work-detail / COA / metadata phrasing aligned to the same canon.
- WhisperXR bridge language so the digital layer extends the physical method instead of replacing it.
- Cinematic stillness behavior: during inactivity, secondary content gradually recedes and returns on activity.

Relevant files:

- `src/pages/process.astro`
- `src/data/site/process.ts`
- `src/components/cinematic/CinematicIdleField.astro`
- `docs/artist-stage-v3-process-technique-route.md`

### Global Shell / Frame

Shared shell refinements now affect the main public routes.

Implemented:

- Canonical header/frame alignment across Home, Works, Artist, Contact, Process, and Series.
- Wide public-route text/image compositions now sit on the same shell axis instead of ad hoc per-page widths.
- Shared `Top` return gesture for long routes.
- Footer and header support link to `/process`.

Relevant files:

- `src/layouts/BaseLayout.astro`
- `src/components/navigation/SiteScrollTop.astro`
- `docs/artist-stage-v3-global-shell-header-calibration.md`

## Cinematic Transition System

Global route transition manager:

- `public/scripts/artist-stage-cinematic-transition.js`

Current important behavior:

- Supports `[data-cinematic-cover]`.
- Supports route payloads through `sessionStorage`.
- Supports `data-cinematic-source-selector`, used by `View work` in the Series inspector so the transition starts from the fullscreen image.
- Collection index routes such as `/series` no longer accept an arrival morph fallback, which prevents black placeholder covers during route entry.
- `/series` preloads its key constellation covers so the active field appears populated immediately on load.

Do not remove this unless replacing it with a full equivalent route transition layer.

## Fullscreen Inspector Stability Contract

The Series inspector uses multiple layers:

```txt
source DOM image
fixed morph image
final panel image
shift image
```

Important fixes already made:

- Panel remains hidden until morph handoff.
- `data-handoff` is not set during opening.
- Morph image is pinned to final transform before cancelling WAAPI animation.
- Old source image hiding was removed.
- `data-handoff` is cleaned during close/force close.
- Inspector close now syncs the Series chapter carousel to the last active inspector image.

If blinking or double images return, inspect the staging order in:

- `src/pages/series/[slug].astro`

Search for:

```txt
openInspector
hideMorphLayer
data-handoff
series-inspector__panel
series-inspector__morph
```

## Performance Status

`npm run build` currently passes.

Implemented performance foundations:

- responsive generated WebP assets under `public/generated/`;
- responsive image helper;
- reduced expensive atmosphere work during scroll/transition;
- preloaded critical `/series` constellation covers;
- WebGL backdrop guarded behind a stable host and disabled when WebGL cannot initialize;
- Vite watcher ignores for heavy local diagnostic folders.

Known warnings:

- Astro dynamic route warnings in server mode.
- Vite chunk-size warning, likely related to immersive/Three/XR/AR dependencies.

These warnings are known and not currently blocking.

## Current Risks / Watch Items

- Series WebGL atmosphere is promising but still needs art-direction tuning: density, color sync, foreground/background integration, and low-powered hardware QA.
- AR/3D preview is integrated but frame/material realism remains prototype quality.
- Mobile AR needs production GLB/USDZ hosting, asset validation, and device testing.
- Final author review is still needed for titles, statements, years, series membership, status, edition data.
- Work metadata supports method/layer/reference language, but values should still be audited work-by-work.
- Commerce exists but is not fully production-sales approved.
- Mobile/tablet QA should be repeated for Home, Series, inspector, Work Detail, Process, and AR overlay.
- Several visual systems are pass-layered; after art direction approval, CSS consolidation would be valuable.

## Recommended Next Work

Recommended next sequence:

```txt
1. Visual QA the current Home -> Series -> Chapter -> Inspector -> Work Detail path.
2. Tune Series WebGL atmosphere so the cloud field breathes with the artworks instead of sitting as a separate background.
3. Run an AR/3D realism pass for frame depth, paper surface, mat, glass/reflection, wall light, and scale.
4. Mobile/tablet pass for Home field, Series map, Series chapter inspector, Work Detail, Process, and AR overlay.
5. Content author review across all active works.
6. Commerce staging/legal/policy readiness audit.
7. CSS consolidation after visual direction is approved.
```

## Do Not Break

- Hero section on Home unless explicitly requested.
- Home background artwork click-to-activate behavior.
- Series inspector as image-first viewing layer.
- `View work` as the bridge to `/works/[slug]`.
- `/process` as a support route for method, not a product/marketing page.
- Route atmosphere handoff behavior.
- Responsive generated image usage.
- Existing checkout hooks and data attributes in Work Detail.
- WebGL Series backdrop host placement outside the React island.
