# ARTIST STAGE v3 - Series Cinematic Chapter Route

## Goal

`/series/[slug]` is the immersive chapter route for a series. It is not a product page, a basic grid, or a simple filtered archive.

The route should feel like a cinematic chapter surface:

```txt
left chapter copy
wide spatial hero carousel
living atmosphere
scrolling image field
fullscreen photo inspector
View work bridge to canonical Work Detail
```

## Current Status

Status: implemented and currently working.

Build:

```txt
npm run build
PASS
```

Known warnings are project-level non-blockers:

- Astro dynamic route warnings in server mode.
- Vite large chunk warning.

## Current UX Contract

The canonical Series Chapter flow is:

```txt
Series map
-> Series chapter
-> Hero carousel / sequence field
-> Fullscreen photo inspector
-> View work
-> /works/[slug]
```

Important rule:

```txt
Series = viewing context.
Work Detail = object/acquisition context.
```

Therefore, clicking artwork images inside a Series chapter opens the fullscreen inspector first. It does not go directly to the product/detail page. The deliberate acquisition/detail route is the inspector CTA:

```txt
View work
```

## Implemented Behavior

### Hero Carousel

- Rendered from the current series works.
- Uses active / prev / next / far / hidden slot states.
- Active frame is large and sharp; side frames are dimmer and spatial.
- Prev / Next / dots / wheel / swipe style interactions are supported.
- Clicking an inactive hero frame makes it active.
- Clicking the active hero frame opens the fullscreen inspector.
- Hero frames are buttons, not anchors, so they cannot accidentally route to `/works/[slug]`.

### Living Chapter Atmosphere

- Page atmosphere is driven by the chapter flagship/profile.
- Individual works provide `--work-wash`, `--work-glow`, `--work-accent`, and `--work-shadow`.
- The inspector inherits active work tone from the clicked frame.

### Scroll Sequence Field

- The lower chapter section is a spatial image field, not a plain grid.
- Works use authored layout classes and responsive generated images.
- Scroll motion is intentionally scale/drift based, with no aggressive skew/tilt.
- Clicking a sequence image opens the fullscreen inspector.

### Fullscreen Inspector

The inspector is a site-native photo viewer:

- Opens from the real clicked image rect.
- Uses a fixed morph image layer for opening/closing.
- Keeps page scroll stable.
- Supports Prev / Next buttons.
- Supports keyboard navigation.
- Supports wheel and pointer swipe.
- Shows readout and bottom progress bar.
- Includes a `View work` CTA to the active `/works/[slug]`.

### Inspector Stabilization

The current inspector avoids the previous blinking/double-image bug by separating these states:

```txt
source image
fixed morph image
final panel image
shift image
```

Critical implementation decisions:

- The panel remains `visibility: hidden` until handoff.
- `data-handoff` is not set during the opening morph.
- The morph image is pinned to final `transform: translate3d(0, 0, 0) scale(1)` before cancelling the Web Animations API animation.
- Old source-hiding state was removed to prevent source blink.
- `data-handoff` is cleaned during close/force-close.

### View Work Bridge

`View work` is the only intentional route from inspector to acquisition/detail.

It updates with the active inspector frame:

- href: `/works/[slug]`
- route slug: active artwork slug
- atmosphere handoff slug: active artwork atmosphere profile
- cinematic source: current fullscreen inspector image

The global cinematic transition manager supports:

```txt
data-cinematic-source-selector
```

This lets the `View work` CTA transition from the fullscreen image rather than from the button.

## Files Touched

- `src/pages/series/[slug].astro`
- `public/scripts/artist-stage-cinematic-transition.js`
- `docs/artist-stage-v3-series-chapter-route.md`
- `docs/project-brief.md`

## Current Routes

Expected active chapter routes:

```txt
/series/meta-bodies
/series/night-water
/series/studies
/series/independent
```

The exact visible route list depends on the current `src/data/site/series.ts` taxonomy.

## Related Data

Series chapter pages use:

- `src/data/site/series.ts`
- `src/data/site/artworkCollections.ts`
- `src/data/site/artworkMeta.ts`
- `src/content/works/*`
- `src/lib/assets/responsiveImage.ts`
- `src/lib/artwork-atmosphere/artworkAtmosphereProfiles.ts`

## Known Watch Items

- Mobile/tablet inspector and hero carousel should get another visual QA pass.
- Final author metadata review is still needed.
- Some styling is pass-layered and may deserve consolidation after art direction is locked.
- Real AR remains outside this route; AR/acquisition belongs to Work Detail and future collector systems.
