# ARTIST STAGE v3 — Living Atmosphere Orchestrator Lite

## Goal
Move artwork atmosphere from reactive hover/token switching into a unified living atmosphere orchestrator.

## Current problem
The site has artwork profiles and visible color differences, but atmosphere still behaves like a reaction to hover or page load rather than a continuous living field.

## Target
A single client-side orchestrator manages current atmosphere, target atmosphere, active artwork, viewport artwork, hover/focus override, route handoff memory, scroll state and idle breathing.

## Scope
Frontend only. CSS-first. Manual profiles. No AI extraction. No WebGL. No AR. No XR. No analytics.

## Signals
- route target
- page artwork target
- visible artwork in Works viewport
- hover/focus override
- scroll state
- idle/stillness state
- inspecting state

## Files touched
- src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts
- src/components/living-atmosphere/LivingAtmosphereOrchestratorBoot.astro
- src/components/artwork-atmosphere/ArtworkAtmosphereBridge.astro
- src/layouts/BaseLayout.astro
- src/styles/global.css
- src/pages/index.astro
- src/pages/works/index.astro
- src/pages/works/[slug].astro
- src/components/works/WorksArchive.tsx
- src/components/works/CuratedGrid.tsx
- src/components/works/CompactGrid.tsx

## Not touched
Checkout, Stripe, commerce catalog, commerce components, XR routes, XR core, XR experiences.

## QA screenshots
- screenshots/v3-20-home-idle-mt3.png
- screenshots/v3-20-works-viewport-ash.png
- screenshots/v3-20-works-hover-mt2-debug.png
- screenshots/v3-20-works-scroll-mt3-debug.png
- screenshots/v3-20-work-mt3-page-debug.png
- screenshots/v3-20-work-mt1-page-debug.png
- screenshots/v3-20-work-ash-page-debug.png
- screenshots/v3-20-mt3-inspecting-debug.png
- screenshots/v3-20-mobile-390.png

## Build status
`npm run build` passes.

## State behavior notes
- Home starts from MT-3 via page target.
- Works can drift from viewport-visible artwork without hover.
- Hover/focus acts as temporary override and returns to viewport/page target.
- Work detail pages start from their artwork profile.
- Inspect preview sets the high-priority inspecting state.
- Route handoff memory uses sessionStorage only.
- Idle breathing starts after stillness and remains nonessential.
- The orchestrator boot is mounted at the end of `BaseLayout` so page bridges can queue a target first, then the runtime takes over after the full shell exists.
- Debug mode was verified through CDP on `/works/mt-3?atmoDebug=1` with `targetSlug: mt-3`, `source: page`, `state: settled`, and `livingAtmosphere: orchestrated`.

## Remaining issues
- Some automated headless screenshot runs were inconsistent about capturing the debug overlay, although targeted runtime state confirmed the orchestrator API.
- V3-21 should refine section-specific pressure/density changes for Home, Works, and Artist.
