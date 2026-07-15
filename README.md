# ARTIST STAGE

ARTIST STAGE is an Astro + React artist site built around a living cinematic artwork system.

The current V3 route is:

```txt
Home living field
-> Series WebGL constellation map
-> Series cinematic chapter
-> Fullscreen photo inspector
-> Work detail / collector route
-> Process / technique support route
-> Contact / Collectors
```

The project is now focused on an authored viewing flow rather than a conventional grid gallery. `Series` is the immersive chapter/context layer; `Works` and `/works/[slug]` remain the canonical object, acquisition, print/original, and collector-detail layer.

## Current Status

ARTIST STAGE is currently an advanced cinematic art-direction beta. The primary route architecture,
living atmosphere systems and collector journey are implemented. Route-specific environment art
direction, authentic content, AR realism, commerce approval and production-device QA remain active
work.

Core routes are active:

- `/`
- `/series`
- `/series/[slug]`
- `/works`
- `/works?series=<slug>`
- `/works/[slug]`
- `/process`
- `/artist`
- `/contact`
- `/collectors`

Secondary and experimental routes remain available, but are outside the primary public-launch perimeter:

- `/prints`
- `/prints/[slug]`
- `/collectors/works/[slug]`
- `/collectors/prints/[slug]`
- `/exhibitions`
- `/exhibitions/[slug]`
- `/immersive`
- `/immersive/experience`

## Current UX Decisions

- Home is a living selected-manifestations field, not a landing page or archive grid.
- `/series` is a spatial constellation map of authored series and object signals with a WebGL atmosphere backdrop.
- `/series/[slug]` is a cinematic chapter page with a wide hero carousel, living sequence field, and fullscreen photo inspector.
- Clicking a work image inside a Series chapter opens the fullscreen inspector first.
- The fullscreen inspector stays clean and image-led; `View work` is the deliberate route to `/works/[slug]`.
- `/works/[slug]` remains the canonical collector/object page for acquisition, print/original options, details, scale preview, AR/3D preview, and surface inspection.
- `/process` is the canonical public explanation of the Body Manifestation Process and supports Artist, Series, and Work Detail language.
- The process/method layer is derived from the studio source document `Meta_Bodies_Technique_Body_Manifestation_Process_UK.pdf` and then distilled into public route language.
- Long routes now share the same canonical frame / header axis and use a shared `Top` return gesture where the page length needs it.
- `/series` now preloads key covers and no longer flashes black placeholder surfaces during route arrival.
- Home selected manifestations now use smoother cinematic switching, floating artwork motion, hover/click activation of background works, and a `Next` gesture into the next section.
- Site-wide inactivity is directed by the Presence system: content settles, disperses and reforms in
  continuing dream acts instead of ending in a frozen fade.
- Process, Artist and Contact share a bounded Living Background lifecycle but use distinct route
  cinematography. Works intentionally uses canvas-free archive illumination instead of duplicating
  paintings in a full-screen WebGL layer.

## Local Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`

Create a local `.env` from `.env.example` before testing checkout flows. `PUBLIC_SITE_URL` may use
the local development URL; `STRIPE_SECRET_KEY` must remain private and is only required by the
server-side checkout endpoint.

## Build Notes

- Output mode is server-rendered Astro with `@astrojs/node`.
- `npm run build` currently passes.
- Known non-blocking warnings remain:
  - dynamic route `getStaticPaths()` warnings in server mode;
  - Vite large chunk warning, likely tied to immersive/XR dependencies.

## Key Handoff Docs

- `docs/project-brief.md`
- `docs/artist-stage-v3-current-status-2026-07-15.md`
- `docs/artist-stage-v3-roadmap.md`
- `docs/artist-stage-v3-current-development-handoff.md`
- `docs/artist-stage-v3-next-chat-handoff.md`
- `docs/artist-stage-v3-living-background-route-profiles.md`
- `docs/living-background-environment-universal-tool.md`
- `docs/artist-stage-v3-series-chapter-route.md`
- `docs/artist-stage-v3-series-field-route.md`
- `docs/artist-stage-v3-home-selected-manifestations-field.md`
- `docs/artist-stage-v3-process-technique-route.md`
- `docs/artist-stage-v3-work-detail-collector-ar-completion.md`
- `docs/artist-stage-v3-series-webgl-atmosphere-field.md`
- `docs/artist-stage-v3-home-cinematic-field-motion.md`
- `docs/artist-stage-v3-global-shell-header-calibration.md`
- `docs/artist-stage-v3-performance-stability-pass.md`
