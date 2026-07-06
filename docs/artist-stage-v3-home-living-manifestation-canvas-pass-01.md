# ARTIST STAGE v3 - Home Living Manifestation Canvas Pass 01

## Goal
Transform Home into the first living entry field of ARTIST STAGE.

## Source systems
- Living Home Canvas
- Living Site Environment
- Cinematic Frame Field
- Object Chamber v3

## Current problem
Home is structurally correct but still too close to a conventional hero.

## Target
A living manifestation canvas: active work surface, peripheral traces, atmosphere, clear routes.

## Files touched
- `src/pages/index.astro`
- `docs/artist-stage-v3-home-living-manifestation-canvas-pass-01.md`

## Not touched
Checkout, Work Detail, commerce, XR, AR, atmosphere engine.

## QA screenshots
- `screenshots/v3-10-home-desktop-top.png`
- `screenshots/v3-10-home-desktop-mid.png`
- `screenshots/v3-10-home-mobile-390.png`
- `screenshots/v3-10-home-tablet-768.png`
- `screenshots/v3-10-work-mt3-regression.png`

## Build status
Pass on 2026-06-06:

```txt
npm run build
```

Existing non-blocking warnings remain:

- SSR dynamic route `getStaticPaths()` warnings.
- Vite chunk-size warning.

Local dev server started:

```txt
npm run dev -- --force
http://localhost:4321/
```

Screenshot QA was captured from built preview on `http://localhost:4322/` to avoid Vite HMR reload noise during image-decode waits.

Route QA:

- `/` 200
- `/works/mt-3` 200
- `/works` 200
- `/artist` 200
- `/contact` 200
- `/immersive` 200

Overflow QA:

- desktop 1440: no horizontal overflow
- tablet 768: no horizontal overflow
- mobile 390: no horizontal overflow

## Remaining issues
The field language is established and connected to Object Chamber v3. The weakest area is still balance tuning: the desktop peripheral traces are intentionally quiet, but may need one more art-direction pass after screenshot review to decide whether the left trace should become even softer.

## Pass 11 - Home Composition Calibration

### Goal
Calibrate scale, spacing, traces and route signals after the first Living Manifestation Canvas pass.

### Changed files
- `src/pages/index.astro`

### What improved
- Added a dedicated Pass 11 CSS override block after the original V3 Home styles.
- Increased header breathing and reduced the first-field pressure under the fixed nav.
- Reduced the title scale while keeping the large authorial statement intact.
- Rebalanced the text/artwork field so the MT-3 image anchors the right side without overpowering the thesis.
- Limited desktop traces to two quieter authored signals and hid the low trace.
- Tuned CTAs into quieter route signals with a stronger but less button-like primary route.
- Refined the active artwork caption into a single museum-like register line.
- Gave the cycle signal band more spacing and a softer editorial rhythm.
- Reworked tablet/mobile overrides so the field stacks cleanly, traces stay hidden, and actions remain readable.

### Remaining issues
- Final judgement is visual: desktop trace opacity and title/artwork tension should be reviewed against the saved screenshots.
- The Pass 11 block intentionally overrides Pass 01 rather than deleting it; a future cleanup can consolidate styles after approval.

### QA screenshots
- `screenshots/v3-11-home-desktop-top.png`
- `screenshots/v3-11-home-desktop-scroll.png`
- `screenshots/v3-11-home-tablet-768.png`
- `screenshots/v3-11-home-mobile-390.png`
- `screenshots/v3-11-work-mt3-regression.png`

### QA notes
- `npm run build` passes on 2026-06-06.
- Existing non-blocking warnings remain: dynamic `getStaticPaths()` SSR route warnings and Vite chunk-size warning.
- Dev server started with `npm run dev -- --force --host 127.0.0.1`; port `4321` was occupied, so Astro served Pass 11 on `http://127.0.0.1:4322/`.
- Route checks passed: `/`, `/works/mt-3`, `/works`, `/artist`, `/contact`.
- Mobile 390px required a grid reset back to one column so the active MT-3 plane stays in the visible flow.
