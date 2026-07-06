# ARTIST STAGE v3 - Route Handoff / Page Transition Atmosphere Memory

## Goal
Make atmosphere persist across route changes so ARTIST STAGE feels like one continuous living field.

## Current problem
Atmosphere is alive inside pages, but route changes can still feel like page resets.

## Target
Previous artwork atmosphere becomes the starting residue on the next route. The new route target then takes over through a smooth drift.

## Scope
Frontend only. Session memory only. No analytics. No backend. No WebGL. No AR/XR. No full page transition.

## Signals
- current artwork slug
- target route
- clicked link
- route source
- page target
- section state
- route-enter state

## Files touched
- `src/lib/living-atmosphere/routeAtmosphereMemory.ts`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/components/artwork-atmosphere/ArtworkAtmosphereBridge.astro`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/pages/index.astro`
- `src/pages/works/index.astro`
- `src/components/works/CuratedGrid.tsx`
- `src/components/works/CompactGrid.tsx`
- `docs/artist-stage-v3-route-handoff-atmosphere-memory.md`

## QA screenshots
- `screenshots/v3-22-home-to-works-handoff-debug.png` - Home CTA carries `mt-3` into `/works`; debug shows `previous: mt-3`, `handoff: link`, and `state: route-enter`.
- `screenshots/v3-22-works-to-mt2-handoff-debug.png` - Works card click carries `mt-2` into `/works/mt-2`; debug shows previous and target `mt-2`.
- `screenshots/v3-22-mt1-to-works-handoff-debug.png` - `/works/mt-1` to Works carries `mt-1` residue into Works before section/viewport state takes over.
- `screenshots/v3-22-direct-mt3-page-debug.png` - Clean direct load gets `mt-3` page profile with `handoff: initial`.
- `screenshots/v3-22-direct-ash-page-debug.png` - Clean direct load gets `figure-in-ash-light` page profile with `handoff: initial`.
- `screenshots/v3-22-mobile-390.png` - Clean mobile Home at 390px remains stable.

## Behavior notes
- Handoff memory is session-only and stores slug, source, from route, to route, section and interaction state.
- Same-origin link clicks write explicit handoff memory without preventing native navigation.
- Pagehide writes a fallback handoff only when no explicit link handoff was written in the previous 300ms.
- The next route seeds its current artwork profile from memory, then the page bridge sets the new target without `immediate`, allowing a visible drift.
- Home CTAs carry `mt-3` residue.
- Works curated and compact cards carry their own artwork slugs.
- Debug mode now shows current/target slug, previous route slug, source, state, section, handoff source and route path.
- Route smoke checks returned 200 for `/`, `/works`, `/works/mt-3`, `/works/mt-1`, `/works/mt-2`, `/works/figure-in-ash-light`, `/artist`, `/contact`, `/collectors`, and `/immersive`.
- `npm run build` passed.
- `npm run dev -- --force` is running at `http://localhost:4321/`.

## Remaining issues
- This is not a full page transition; only the atmosphere carries memory.
- Direct route screenshot QA must use a clean browser session, otherwise pagehide fallback correctly provides session residue.
- Work detail adjacent links were left untouched to keep this pass inside the requested file scope; global navigation/back-to-Works still carries the current page slug.
- If future visual tuning finds the residue too persistent, reduce `ROUTE_ENTER_DURATION` from 900ms toward 650ms.
