# ARTIST STAGE V3 - Immersive Pigment Field Approved Checkpoint

Baseline approved: 2026-07-14
Transition evolution verified: 2026-07-15

Status: visually approved baseline with the route-specific cinematic handoff evolution implemented

## Approved Direction

`/immersive` is a living material environment built only from authentic fragments of existing
paintings. It is not a figurative reconstruction, a generated scene, or a conventional background
crossfade.

The approved field has these defining qualities:

- MT-3, MT-1, and MT-6 form the preserved opening composition.
- MT-7 and MT-9 enter later as slow material chapters without changing the opening frame.
- The paintings remain recognizable as pigment, charcoal, scratches, and paper texture, but not as
  complete depicted bodies.
- Material moves as one pressure field through broad directional waves rather than cursor-local
  deformation or isolated liquid blobs.
- Green, oxide/pink, and chalk/cyan states pass through one another continuously.
- The center remains luminous and detailed while the edges preserve cinematic depth and text
  contrast.
- Active motion and deep-idle acts both transform the field; no phase ends in a static image.

## Technical Baseline

- Three responsive 2000px WebP sources are loaded at route entry.
- The resting field always keeps three textures. A fourth exists only during a chapter transition and
  is released immediately after the handoff.
- Trilinear mip filtering preserves detail during transformed sampling.
- Render resolution is capped at 1.4 DPR on desktop and 1.1 DPR on compact viewports.
- A continuous material clock completes a palette cycle in roughly 27 seconds at normal frame
  cadence.
- `gathering`, `dispersing`, and `reforming` phase-shift the same clock instead of replacing it with
  unrelated effects.
- Presence changes settle with damping, so palette changes are legible without snapping.
- Pointer movement applies only a broad global lean; pointer press adds a temporary pressure impulse.
- The route veil, shader exposure, saturation, vignette, and DOM light pulse are tuned as one tonal
  system.
- The first bank transition begins after 38 visible seconds; later chapters are separated by 48
  visible seconds, so the field evolves within a realistic viewing session.
- Each bank handoff takes 10.5 seconds and uses quintic easing, an irregular diagonal material
  reveal, opposing temporary shear, and a short-lived pigment edge rather than an image crossfade.
- Transition light is derived from the same handoff progress and pressure values as the shader, so
  the page illumination rises and settles with the material instead of behaving as a separate
  overlay animation.
- The transition clock pauses while the document is hidden, so background-tab throttling cannot
  complete or accelerate a chapter invisibly.

## Regression Guardrails

Do not:

- introduce generated or external raster imagery;
- reconstruct bodies with shader geometry, masks, silhouettes, or procedural anatomy;
- load all available paintings into simultaneous equal-weight mixing;
- return to 1400px sources for desktop rendering;
- restore the previous heavy black veil or low-exposure shader curve;
- create a visible cursor contact point, ripple center, or permanent deformation;
- speed the field into obvious looping motion or slow it until change is no longer perceptible.

## Implemented Expansion

The controlled second material bank is now implemented.

Current architecture:

1. Keep only three active painting textures at a time.
2. Lazy-load one incoming texture and replace one active slot during a long, masked transition.
3. Dispose the outgoing texture after the transition to protect mobile memory.
4. Rotate one painting per 48-second chapter after the initial 38-second hold.
5. Preserve the current three-painting composition as the route's opening state.

Implemented bank order:

1. `MT-1` - opening bank state.
2. `MT-7` - amber and ochre broaden the palette while its looping forms remain abstract under the
   existing crop logic.
3. `MT-9` - a rarer deep-crimson chapter that temporarily reduces green dominance.

Deferred candidates:

1. `MT-2` - the yellow line system is useful, but the central figure can become too readable.
2. `MT-11` - its multiple figures conflict with the approved non-figurative field unless a
   reliable abstract crop is authored first.

## Expansion QA

- Resting state: three loaded textures.
- Mid-transition state: four loaded textures.
- Completed state: three loaded textures with the outgoing source disposed.
- Desktop and 390px canvases remain full-bleed with no horizontal overflow.
- Mobile canvas pixel samples are nonblank and materially varied.
- The complete 10.5-second handoff was sampled from rest through completion: progress and light
  remained continuous, no black frame appeared, and the temporary fourth texture was disposed.
- `dreaming -> waking` keeps the bank transition stable and does not create image flicker.
- `npm run build` passes after the expansion.

## Acceptance Gate For Any New Painting

A new source is accepted only when:

- the opening composition remains unchanged;
- no complete body or face becomes readable at desktop or mobile crops;
- the palette gains a distinct material state rather than becoming muddy;
- 390px and wide desktop canvases remain nonblank, sharp, and correctly framed;
- canvas pixel samples continue changing without flicker;
- natural `dreaming -> waking -> awake` behavior remains stable;
- reduced-motion behavior and production build still pass.

## Relevant Files

- `src/pages/immersive.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/components/cinematic/CinematicIdleField.astro`
- `docs/artist-stage-v3-living-background-route-profiles.md`
- `docs/artist-stage-v3-current-development-handoff.md`
