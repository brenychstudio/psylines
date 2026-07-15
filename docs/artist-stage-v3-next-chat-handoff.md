# ARTIST STAGE v3 - New Chat Handoff

Date: 2026-07-15
Repository: `https://github.com/brenychstudio/psylines`

## Use This Context First

Read in this order:

1. `docs/project-brief.md`
2. `docs/artist-stage-v3-current-status-2026-07-15.md`
3. `docs/artist-stage-v3-roadmap.md`
4. `docs/artist-stage-v3-current-development-handoff.md`
5. `docs/artist-stage-v3-living-background-route-profiles.md`
6. `docs/living-background-environment-universal-tool.md`

## Current Task

Continue route-specific living background art direction. The direction is approved, but Process,
Artist, Contact and Works still need a second quality pass. Do not copy Home across these routes.

Priority order:

```txt
Process -> Artist -> Contact -> Works -> cross-route review -> selective Immersive reassessment
```

## Non-Negotiable Context

- Use only authentic artwork already present in the project unless the user supplies new studio
  material.
- Home is the approved pigment overture and should not be casually changed.
- Process is a trace/material field under raking work light.
- Artist is a dissolved practice palimpsest with localized memory planes.
- Contact is a quiet near-black signal chamber.
- Works is a clean archive with canvas-free broad museum light; do not restore duplicated full-screen
  painting WebGL.
- Immersive is a dedicated pressure membrane and must stay visually distinct.
- Series is cinematic context; Work Detail is the canonical collector/object route.
- Presence/idle must keep transforming without flicker or freezing in a terminal blurred state.

## First Engineering Action

Before editing, inspect the current route at desktop and mobile, read its page component and the
living-background component, then compare it against Home only for quality and lifecycle, not for
visual imitation. Implement and verify one route at a time with Playwright screenshots and nonblank
canvas checks.

## Validation Baseline

- `npm run build` passes.
- Known non-blocking warnings: Astro dynamic-route `getStaticPaths()` and Vite large Three/XR chunk.
- Latest synthetic QA passed at desktop and `390x844` mobile with no horizontal overflow or browser
  application errors.
- Process, Artist and Contact transitions complete with a two/three/two GPU texture lifecycle.

## Key Code

- `src/components/living-background/LivingRouteEnvironment.astro`
- `src/components/works/WorksArchiveIllumination.astro`
- `src/components/home/HomePrologueField.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/pages/process.astro`
- `src/pages/artist.astro`
- `src/pages/contact.astro`
- `src/pages/works/index.astro`
- `src/pages/immersive.astro`
