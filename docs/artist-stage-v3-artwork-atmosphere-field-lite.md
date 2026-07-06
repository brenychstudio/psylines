# ARTIST STAGE v3 - Artwork Atmosphere Field Lite

## Goal
Introduce the first artwork-driven atmosphere layer for ARTIST STAGE.

## Current problem
The site has V3 visual language, but atmosphere is still mostly route-based. Active artworks do not yet influence the field.

## Target
Manual artwork atmosphere profiles bind active works to CSS variables that affect local field wash, artwork halo, inspect atmosphere, Home active surface, and Works hover/focus state.

## Scope
CSS-first. Authored profiles. No AI extraction. No WebGL. No AR. No XR. No checkout changes.

## Files touched
- src/lib/artwork-atmosphere/artworkAtmosphereProfiles.ts
- src/lib/artwork-atmosphere/applyArtworkAtmosphere.ts
- src/components/artwork-atmosphere/ArtworkAtmosphereBridge.astro
- src/pages/works/[slug].astro
- src/pages/index.astro
- src/pages/works/index.astro
- src/components/works/WorksArchive.tsx
- src/components/works/CuratedGrid.tsx
- src/components/works/CompactGrid.tsx
- src/styles/global.css
- docs/artist-stage-v3-artwork-atmosphere-field-lite.md

Note: `/works` currently renders its archive markup directly in `src/pages/works/index.astro`, so the bridge and `data-artwork-slug` attributes were added there as the active route surface. The React grid components were also updated for future/alternate usage.

## Not touched
Checkout, Stripe, commerce catalog, commerce components, XR, AR, immersive routes, Living Atmosphere engine internals.

## Profiles implemented
- default
- mt-3
- mt-2
- figure-in-ash-light
- mt-1
- mt-4
- mt-5
- mt-10
- quiet-red-interval

## Pass 19 - Atmosphere Layer Architecture Fix + Debug Calibration

### Problem
Artwork atmosphere profiles and bridge exist, but visual impact was too weak. Background still felt static because token changes were routed through subtle pseudo-elements and could be visually swallowed by page-local backgrounds.

### Goal
Move from technical token wiring to visible artwork-driven atmosphere.

### Key change
Use an explicit fixed atmosphere field layer in the global shell, plus local page/hover bindings. Profiles now include `washStrong`, `shadowWash`, and per-profile field/focus/inspect opacity.

### Acceptance
Different artworks must create visibly different atmosphere fields while preserving readability.

## Atmosphere states
- default
- active artwork
- hover/focus artwork
- inspecting

## QA screenshots
- screenshots/v3-17-home-atmosphere-mt3.png
- screenshots/v3-17-mt3-object-atmosphere.png
- screenshots/v3-17-mt3-inspect-atmosphere.png
- screenshots/v3-17-works-hover-mt3.png
- screenshots/v3-17-works-hover-mt2.png
- screenshots/v3-17-works-hover-ash.png
- screenshots/v3-17-mobile-390.png
- screenshots/v3-19-home-mt3-atmosphere.png
- screenshots/v3-19-work-mt3-atmosphere.png
- screenshots/v3-19-work-mt1-atmosphere.png
- screenshots/v3-19-work-mt2-atmosphere.png
- screenshots/v3-19-work-ash-atmosphere.png
- screenshots/v3-19-works-hover-mt2-debug.png
- screenshots/v3-19-works-hover-mt3-debug.png
- screenshots/v3-19-mobile-390.png

## Build status
`npm run build` passed.

Dev QA ran against `http://localhost:4325/`.

Pass 19 build passed after the explicit field layer and debug overlay changes.

## QA notes
- Home applies MT-3 artwork atmosphere on page load.
- MT-3 Object Chamber sets `data-artwork-atmosphere="mt-3"` and keeps buy/size controls present.
- Works hover/focus applies MT-3, MT-2, and Figure in Ash Light profiles through `data-artwork-slug`.
- 390px mobile check showed no document/body horizontal overflow.
- Regression routes `/`, `/works`, `/works/mt-3`, `/works/mt-2`, `/works/figure-in-ash-light`, `/artist`, `/contact`, `/collectors`, and `/immersive` returned 200 in dev QA.
- Pass 19 adds an explicit fixed `.site-artwork-atmosphere-field` in the global shell.
- `/works/mt-3`, `/works/mt-1`, `/works/mt-2`, and `/works/figure-in-ash-light` apply visibly different profile tokens.
- `?atmoDebug=1` adds a temporary debug panel. Works hover/focus updates the panel slug immediately.
- 390px mobile check showed no document/body horizontal overflow.

## Remaining issues
- Later V3-18 can connect atmosphere to scroll-section / active field state.
- Artwork profiles are authored by hand; no image extraction or adaptive palette logic exists yet.
- The effect is intentionally local and subtle. Future passes can tune individual artwork intensities after visual review.
