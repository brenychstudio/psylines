# ARTIST STAGE v3 - Series Route Continuity

## Goal

Make the Series experience behave as one continuous cinematic space:

```txt
/series map
-> /series/[slug] chapter
-> fullscreen Inspector
-> /works/[slug] Work Detail
-> the same chapter, work, and Inspector
```

## Implemented

- The route bridge carries transition kind, artwork slug, source geometry, artwork image, and sampled/authored palette.
- `series-chapter`, `series-work`, and `series-return` use separate pacing presets.
- Map artwork expands into an explicit chapter arrival target instead of a generic fallback image.
- Chapter copy, controls, peripheral works, and pigment current enter in staged order around the artwork.
- Inspector `View work` starts from the fullscreen image.
- Work Detail provides `Return to {series}` and `Chapter map` context routes.
- Returning from Work Detail restores the active hero work and reopens the Inspector after the artwork bridge completes.
- Browser Back uses the same resume state, including BFCache restores.
- Returning to `/series` restores both the selected series and exact stored map pan when the viewport remains compatible.
- Reduced-motion navigation skips the bridge and clears its fallback payload without hiding chapter content.
- Mobile Inspector controls use a stable two-row layout with no clipped action.
- The Series Presence root lives in an Astro wrapper outside the React island, preventing pre-hydration DOM layers from invalidating the constellation tree.
- The Astro-owned `.series-presence-root` must remain at `z-index: 2`, above the fixed WebGL host at `z-index: 1`, so pigment stays behind artwork covers and interface content.

## State Contract

Session keys:

```txt
artist-stage:cinematic-transition
artist-stage:series-constellation-handoff
artist-stage:series-constellation-return
artist-stage:series-chapter-resume
```

Important attributes and events:

```txt
data-cinematic-transition-kind
data-cinematic-arrival-slug
data-cinematic-source-selector
data-series-work-route
data-series-chapter-arrival-target
artist-stage:cinematic-navigation-start
artist-stage:cinematic-arrival-start
artist-stage:cinematic-arrival-complete
```

## Primary Files

- `public/scripts/artist-stage-cinematic-transition.js`
- `src/layouts/BaseLayout.astro`
- `src/styles/global.css`
- `src/components/series/SeriesConstellationField.tsx`
- `src/pages/series/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`

## Browser QA

- Desktop map -> chapter: artwork/palette payload matched `meta-bodies`; explicit chapter target was used and cleaned after arrival.
- Inspector -> Work Detail -> return: `mt-3` restored with the Inspector open.
- Non-first work: `mt-1` restored as active hero and active Inspector frame.
- Browser Back: `mt-1` restored from Work Detail through BFCache with no residual transition state.
- Map return: `night-water` restored with the exact stored `translate3d(-1447.75px, 0, 0)` map position at the test viewport.
- Mobile 390 px: map and chapter remained at viewport width; Inspector actions no longer clip.
- Reduced motion: no bridge layer, no hidden target, no chapter arrival animation, and fallback payload cleared.
- Hydration/runtime: no React mismatch after Presence and WebGL live markers were moved outside the React-owned tree.
- `npm run build` passes. Existing Astro dynamic-route and Vite chunk-size warnings remain non-blocking.

## Watch Items

- Repeat the route on real iOS Safari and a low-powered Android device.
- Tune transition timing only after author review; source/target identity and restore behavior are now part of the route contract.
- Keep `/works/[slug]` as the canonical collector route and the Series Inspector image-first.
