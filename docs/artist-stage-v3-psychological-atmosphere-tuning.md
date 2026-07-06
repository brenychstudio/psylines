# ARTIST STAGE v3 - Psychological Atmosphere Tuning / Presence Curve Calibration

## Goal
Tune the living atmosphere so each artwork has its own authored presence curve: calm, tension, density, shadow, focus and stillness response.

## Current problem
The atmosphere is alive, but stillness and depth are too generic across artworks.

## Target
The field should feel different not only in color, but also in behavior:
- MT-3 grows quietly.
- MT-1 carries red-clay pressure.
- MT-2 intensifies rhythmically.
- Figure in Ash Light stays warm and suspended.
- MT-4 loops internally.

## Ethical boundary
This is not psychological tracking. It is authored visual dramaturgy. No user data is stored or sent.

## Files touched
- `src/lib/living-atmosphere/artworkPresenceCurves.ts`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/styles/global.css`
- `src/pages/works/[slug].astro`
- `src/pages/index.astro`
- `src/pages/works/index.astro`
- `docs/artist-stage-v3-psychological-atmosphere-tuning.md`

## Implementation notes
- Presence curves are authored per artwork slug and contain tension, calm, density, focus, shadow, rail veil and breath response.
- The orchestrator updates the active curve whenever artwork target changes through page, viewport, focus or work-detail source.
- Stillness interpolates each curve from base values toward still values without storing any behavior data.
- Debug mode exposes curve slug, temperament and current psychological tension/calm/density/focus values.
- Work Detail keeps V3-26 text rail support and modulates it through `--psychological-rail-veil`.

## QA screenshots
- `screenshots/v3-27-mt3-still-curve.png`
- `screenshots/v3-27-mt1-still-curve.png`
- `screenshots/v3-27-mt2-still-curve.png`
- `screenshots/v3-27-mt4-still-curve.png`
- `screenshots/v3-27-ash-still-curve.png`
- `screenshots/v3-27-works-hover-mt2-curve-debug.png`
- `screenshots/v3-27-works-hover-mt3-curve-debug.png`
- `screenshots/v3-27-home-mt3-curve.png`
- `screenshots/v3-27-mobile-390.png`

## QA notes
- MT-3 reports `vegetal-emergence` and holds lower tension with higher calm.
- MT-2 reports `red-pressure` and holds higher tension, density and focus pull than MT-3 during Works hover QA.
- Work Detail pages expose curve, temperament and current psychological tension/calm/density/focus values in `?atmoDebug=1`.
- V3-26 collector route support surface remains present and now responds to `--psychological-rail-veil`.
- Home remains on the MT-3 curve and stays calm rather than becoming more intense.
- Mobile 390px remains stable in screenshot QA.

## Remaining issues
- Automated screenshot capture resets or delays some stillness interpolation, so visual QA should still include a manual 2s / 4s / 7s pause check in browser.
- The curve system is intentionally restrained; future passes can tune individual multipliers after side-by-side viewing.
