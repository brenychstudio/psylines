# ARTIST STAGE v3 - Stillness / Idle Presence Field

Status: foundation layer, extended site-wide by `docs/artist-stage-v3-presence-director-metamorphosis.md` on 2026-07-13.

## Goal
Add a lightweight presence layer where stillness and dwell deepen the field without blocking access.

## Current problem
The atmosphere responds to route, artwork, section, hover/focus and handoff memory, but it does not yet reward attention or stillness.

## Target
When the user slows down or stays with an artwork/section, the field becomes calmer, deeper and more focused.

## Scope
Frontend only. CSS-first. No camera. No analytics. No backend. No WebGL. No sound. No AR/XR.

## Presence rules
- Click gives access.
- Stillness gives depth.
- Fast movement does not punish the user.
- Essential controls remain visible.
- Secondary UI can become quieter.

## Files touched
- `src/lib/living-atmosphere/presenceAtmosphereState.ts`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/styles/global.css`
- `src/pages/index.astro`
- `src/pages/works/index.astro`
- `src/pages/works/[slug].astro`
- `src/pages/artist.astro`
- `docs/artist-stage-v3-stillness-idle-presence-field.md`

## QA screenshots
- `screenshots/v3-23-home-active-debug.png`
- `screenshots/v3-23-home-still-debug.png`
- `screenshots/v3-23-home-deep-debug.png`
- `screenshots/v3-23-works-still-debug.png`
- `screenshots/v3-23-mt3-still-debug.png`
- `screenshots/v3-23-mt3-inspecting-debug.png`
- `screenshots/v3-23-artist-still-debug.png`
- `screenshots/v3-23-mobile-390.png`

## Behavior notes
- Presence is local only and is not written to session storage.
- Activity signals return presence to `active`.
- Stillness progresses through `settling`, `still`, and `deep`.
- Artwork, section and route memory remain separate from presence state.
- Debug mode shows presence id, stillness, depth and calm values.
- Object Chamber inspect sets presence to `settling` on open and `active` on close.
- The Presence Director is now the phase source of truth and maps its phases onto these atmosphere states.
- The earlier internal atmosphere stillness timer remains only as a fallback when the Presence Director is absent.
- Deep presence is no longer terminal: the Director repeats `gathering -> dispersing -> reforming`, while the atmosphere remains mapped to `deep` throughout.
- Artwork opacity does not pulse during these acts; continuing life is carried by pigment currents, text traces, route-specific emphasis, and Series WebGL.

## Remaining issues
- Debug overlay can cover content on narrow mobile screenshots; this is debug-only UI.
- Presence interpolation is intentionally slow, so debug numeric values may still be drifting when the target presence label has already changed.
