# ARTIST STAGE v3 - Series Living Pigment Field

Date: 2026-07-13

## Goal

Make `/series` feel like one living pictorial space. The WebGL layer must inherit the active artwork's color and material language instead of reading as a separate cloud, sky, or generic animated backdrop.

## Source

The earlier cloud implementation remains only as a local reference:

```txt
backdrop-16-kool-berk-webgl-background-extract/
```

The Series route now uses a dedicated runtime:

```txt
public/scripts/artist-stage-series-field.js
```

Astro mount:

```txt
src/components/series/SeriesWebGLBackdrop.astro
```

Route integration:

```txt
src/pages/series/index.astro
```

## Important Architecture Decision

The WebGL host must live outside the React constellation island.

Earlier testing showed that the canvas could appear briefly and then disappear because React hydration replaced the host subtree. The current solution mounts the WebGL host directly in the Astro page and lets the React field send state through DOM attributes / CSS variables / custom events.

Do not move the host back into:

```txt
src/components/series/SeriesConstellationField.tsx
```

unless the component becomes the explicit owner of the canvas lifecycle.

## Current Behavior

- The old storm/fog metaphor has been replaced by a domain-warped living pigment field.
- Large membrane forms merge, divide, and breathe slowly behind the constellation.
- Broken charcoal-like contours echo lines inside the paintings without duplicating them literally.
- The active artwork URL is exposed by `SeriesConstellationField.tsx` through `data-active-artwork`.
- A small same-origin canvas sample extracts dominant, secondary, highlight, and deep colors from the active image.
- Extracted colors are blended with authored tone tokens and clamped for saturation, darkness, and text legibility.
- Palette transitions are damped rather than switched abruptly.
- A visible three-second transformation wave carries each palette change outward from the active artwork.
- The field focus follows the active artwork's viewport position.
- Pan/drag/wheel/selection movement creates a temporary metamorphosis impulse that decays after movement.
- Pointer movement applies a broad tangential curl on desktop. Its strength follows pointer velocity, has a guarded center with no radial singularity, and fades after the pointer stops.
- The continuous morph cycle runs at a restrained middle pace: slower than the second high-energy pass, but still visibly alive over several seconds.
- The field consumes `artist-stage:presence-phase` and `artist-stage:presence-dream-cycle`.
- Settling lowers drift; deep stillness then follows `gathering -> dispersing -> reforming`, varying morph depth, contour, bloom, grain, energy, and drift without changing artwork opacity.
- Deep stillness does not auto-select another chapter. Waking adds one restrained pulse and returns the field to its interactive pacing.
- Artwork/node opacity does not loop in deep stillness. Peripheral nodes make one 6-7 second transition to a stable value; the active shadow and local halo use a restrained 34-second material cycle.
- Mobile and reduced-motion modes lower DPR, drift, morph strength, grain, and pointer response.
- The state observer is attached to the stable React island owner and re-resolves the live root after hydration; do not attach it only to the pre-hydration constellation node.

## Art Direction Contract

The background should feel like pigment, body, pressure, membrane, and internal transformation around the works.

It should not feel like:

- a separate sky image;
- a screensaver;
- a generic animated background;
- a layer that visually fights the artworks.
- a topographic map with uniformly repeated contour lines;
- a literal enlargement or blur of the active painting.

## Verification

- `npm run build` passes on 2026-07-13.
- Desktop visual QA passed at `2048 x 1152` with a nonblank WebGL canvas.
- Mobile visual QA passed at `412 x 915`; the field remains quieter behind the chapter browser.
- Programmatic selection QA reached `Meta-Bodies -> Night Water -> Studies` without unmounting the canvas.
- Pixel-derived palette changes were confirmed across `Meta-Bodies` (`#77ba18` / `#948731`), `Night Water` (`#93453f` / `#ae5356`), and `Studies` (`#8ca52f` / `#6eb1aa`).
- A second desktop capture pass confirmed visibly different green/ochre, red/rose, and green/cyan fields.
- Presence Director QA at `1600 x 900` confirmed the Series field reaches the shared dreaming state without unmounting its WebGL canvas.
- Long-idle sampling across three dream acts confirmed active/peripheral artwork opacity remains stable at `1` / `0.44` while pigment and shadow values continue to interpolate.
- Mobile QA at `390 x 844` confirmed one focus artwork, one peripheral echo, one short text trace, and no document-width overflow.

## Current Watch Items

- Final author review of pigment density, contour visibility, and transition pace.
- Real-device performance on low-powered integrated GPUs and older mobile browsers.
- Confirm the sampled palette remains balanced when future artworks are added.
- Preserve artwork and CTA primacy if field intensity is tuned upward later.
