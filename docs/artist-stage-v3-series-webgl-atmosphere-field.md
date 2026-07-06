# ARTIST STAGE v3 - Series WebGL Atmosphere Field

Date: 2026-07-06

## Goal

Integrate the extracted WebGL cloud/backdrop animation into `/series` so the constellation field feels alive, spatial, and atmospheric without becoming a separate decorative layer.

## Source

Local source/reference:

```txt
backdrop-16-kool-berk-webgl-background-extract/
```

Runtime copied into the public route layer:

```txt
public/scripts/kool-berk-background.js
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

- WebGL cloud field sits behind the constellation.
- Active series/object tone is sent into the background.
- Pan/drag/wheel/selection movement increases motion energy.
- Motion energy decays gradually after movement.
- Node halos and artwork shadows use tone variables to tie the works into the field.
- Heavy old overlays were reduced so the WebGL layer remains visible.

## Desired Art Direction

The background should feel like pressure, fog, breath, or field atmosphere around the works.

It should not feel like:

- a separate sky image;
- a screensaver;
- a generic animated background;
- a layer that visually fights the artworks.

## Current Watch Items

- Better color adaptation per active artwork/series.
- More convincing reaction to field movement.
- Better dissolve / density changes during pan.
- Low-powered hardware performance.
- Mobile fallback behavior.
- Ensure text and CTAs remain legible when the cloud field brightens.
