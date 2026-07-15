# ARTIST STAGE v3 - Current Development Handoff

## Snapshot

Date: 2026-07-15

Project: ARTIST STAGE  
Stack: Astro + React + TypeScript + CSS custom properties + vanilla JS cinematic systems + Three/AR preview modules  
Current status: advanced cinematic prototype / Home living overture implemented / route-specific Living Background cinematography implemented for Process, Artist, and Contact / canvas-free archive illumination implemented for Works / continuous Series-to-Work route implemented / collector Work Detail and Process route integrated / Series living pigment field implemented / Immersive multi-chapter pressure threshold evolved / site-wide Presence Director and Metamorphosis Mode implemented

## Core Concept

ARTIST STAGE is not a conventional portfolio, landing page, or product grid. It is a living cinematic artwork field.

The current route logic is:

```txt
Home living overture / current painting + material memory
-> Series WebGL constellation map
-> Series cinematic chapter
-> Fullscreen photo inspector
-> View work
-> Work detail / collector route
-> Process / technique support route
-> Contact / collector handoff
```

The most important conceptual decision:

```txt
Series = context, chapter, atmosphere, immersive viewing.
Works / Work Detail = canonical object record, collector action, print/original options, AR/scale preview.
```

Do not turn the Series inspector into a product-card interface. Keep it image-first and use `View work` as the bridge into `/works/[slug]`.

## Main Navigation

Current header order:

```txt
Home -> Series -> Works -> Immersive -> Artist -> Process -> Contact
```

The public shell has been aligned so the main routes share a consistent header axis and wide-screen frame.

## Key Current Features

### Home

Home is a living selected-manifestations field.

- The first viewport is now a branded living overture led by the literal `ARTIST STAGE` identity.
- A dedicated full-viewport Three.js palimpsest uses only responsive 2000px sources from real project
  paintings.
- The active work and previous work behave as current material and memory; a temporary third texture
  is loaded only during a masked handoff and is released afterward.
- Material handoffs now run for 5.2 seconds with a smootherstep dissolve, restrained opposing shear,
  and a temporary pigment pressure edge; the approved resting Hero frame remains unchanged.
- Selected manifestations are treated as a spatial image field, not a normal grid.
- The field now has smoother cinematic switching and softer floating motion.
- Background works revive on hover and can be clicked to become the active work.
- Hero selection and lower-field scroll dominance both update the living material environment.
- The material field now has autonomous current, memory apertures, migrating light fronts, and a short
  scroll-velocity impulse; it continues changing after the interaction ends.
- Active and orbit works use local non-rectangular quiet pockets so covers remain legible against
  pigment derived from the same paintings.
- The lower route no longer starts as a gray overlay panel: a 38rem exposure bridge carries the Hero
  treatment across the boundary and dissolves without a horizontal section seam.
- A sticky viewport key light follows the dominant artwork axis, while opposing negative fill,
  focus-dependent artwork veils, and local glow give the lower route an authored exposure hierarchy.
- Lower-field targets use a 320ms dwell before changing the WebGL source, reducing incidental texture
  churn during scroll while preserving the latest dominant work.
- Offscreen lower chapters cannot overwrite the active Hero texture; returning upward restores the
  current Hero work.
- The current texture can reveal the canvas before the memory texture finishes loading.
- The lower route was reduced from `520rem` to `344rem` and reorganized as denser authored chapters.
- A `Next` gesture moves the user into the next section without fighting the carousel scroll behavior.
- The focus dialog is portalled to `body`, so deep-scroll Presence transforms cannot displace it.
- Route to object detail is handled through canonical `/works/[slug]`.

Relevant files:

- `src/pages/index.astro`
- `src/components/home/HomePrologueField.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`
- `docs/artist-stage-v3-home-selected-manifestations-field.md`
- `docs/artist-stage-v3-home-cinematic-field-motion.md`
- `docs/artist-stage-v3-home-living-overture-checkpoint.md`
- `docs/living-background-environment-universal-tool.md`
- `docs/living-background-environment-universal-tool.pdf`

The Home background technology is now formally captured as `Living Background Environment v1.0`.
The universal document separates reusable renderer behavior, signal contracts, texture lifecycle,
transition choreography, accessibility, fallback and QA from the ARTIST STAGE-specific adapter. Treat
that document as the reference before extracting or adapting the field for another project.

### Multi-route Living Background Cinematography

The Home technology has been scaled without repeating one identical effect across the site.

Implemented:

- Shared `LivingRouteEnvironment` lifecycle for the three editorial routes, with separate shader
  constructions rather than palette-only profiles.
- Process: softened charcoal/paper trace field, raking work light, section-dominant targeting, a
  `5800ms` material-layer handoff and a `46s` autonomous chapter.
- Artist: localized current/memory planes, low-frequency dissolved exposures, independent warm/cool
  stage light, a `6400ms` memory handoff and a `62s` autonomous chapter.
- Contact: near-black signal chamber, two crossing pigment corridors, directed contact-column light,
  a `7200ms` signal handoff and an `84s` autonomous chapter.
- Process, Artist and Contact source variants are resolved at 2000px and sampled without synthetic
  pixel grain.
- Works no longer uses full-screen artwork WebGL. `WorksArchiveIllumination` provides a clean museum
  field, broad tone-aware raking light, keyboard/pointer equivalence and a short retained light
  memory. Index remains quiet; Field receives stronger exposure.
- Immersive keeps its dedicated three-channel membrane, but its bank transition now uses a `10.5s`
  quintic smootherstep, opposing temporary shear, a settling pigment edge, synchronized DOM light
  and a `48s` chapter interval.
- Process, Artist and Contact map narrative sections through `data-lbe-target`; Works cards use the
  separate `data-works-light-tone` archive-light contract.
- Editorial lifecycle verified at two resting textures and three during handoff; Immersive verified
  at three resting textures and four during handoff.
- Synthetic `1440 x 948`, `390 x 844`, complete-handoff and reduced-motion QA passed without
  application errors, black transition frames or horizontal overflow.

Relevant files:

- `src/components/living-background/LivingRouteEnvironment.astro`
- `src/components/works/WorksArchiveIllumination.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/pages/process.astro`
- `src/pages/artist.astro`
- `src/pages/contact.astro`
- `src/pages/works/index.astro`
- `src/pages/immersive.astro`
- `docs/artist-stage-v3-living-background-route-profiles.md`

### Series Map

`/series` is an interactive constellation field with a living WebGL pigment atmosphere.

- Nodes are spatially placed, not gridded.
- Active/hovered nodes have visual life and atmosphere.
- Drag and wheel panning are supported.
- Clicking/selecting nodes pans the camera smoothly.
- Connections are living neural traces, not simple straight lines.
- Footer is removed from the route.
- A dedicated WebGL pigment field sits behind the constellation and reacts to field movement, active artwork position, and sampled artwork color.
- The WebGL field consumes the shared Presence Director phase and the repeating `gathering -> dispersing -> reforming` dream acts; stillness changes pigment behavior without cycling artwork opacity.
- Deep-idle node transitions now take 6-7 seconds, while the active artwork shadow/halo moves on a restrained 34-second material cycle.
- The mobile chapter browser now carries the same presence roles as the desktop constellation.
- Series palette synchronization survives React hydration by observing the stable island owner and resolving the current constellation root on every sync.
- The WebGL host is mounted outside the React island so React hydration does not delete the canvas.

Relevant files:

- `src/pages/series/index.astro`
- `src/components/series/SeriesWebGLBackdrop.astro`
- `src/components/series/SeriesConstellationField.tsx`
- `public/scripts/artist-stage-series-field.js`
- `src/data/site/series.ts`
- `docs/artist-stage-v3-series-field-route.md`
- `docs/artist-stage-v3-series-webgl-atmosphere-field.md`

### Series Chapter

`/series/[slug]` is a cinematic chapter page.

Implemented:

- Left chapter copy.
- Wide spatial hero carousel.
- Active hero frame opens fullscreen inspector.
- Inactive hero frame first becomes active.
- Lower living sequence field opens the same inspector.
- Fullscreen inspector supports prev/next, wheel, swipe, keyboard, progress bar.
- `View work` CTA routes to canonical `/works/[slug]`.
- Inspector opening/closing was stabilized to remove blinking and duplicate image layers.
- When a user changes images inside the inspector and closes it, the carousel stays on the last viewed image.

Relevant files:

- `src/pages/series/[slug].astro`
- `public/scripts/artist-stage-cinematic-transition.js`
- `docs/artist-stage-v3-series-chapter-route.md`

### Works Register

`/works` is now an archive-first route with a separate authored exhibition mode.

Implemented:

- `Index` is the canonical default at `/works`; `Field` remains available at `/works?view=field`.
- The duplicated hero/register stack has been replaced by one compact editorial register headed by the literal `Works` category.
- Filters and the `Field / Index` segmented control share a sticky register band below the site header.
- The Index scales from five columns on wide screens to four, three, and two columns without cropping artwork surfaces.
- Field is a controlled three-work exhibition on desktop, two works on tablet, and one on mobile.
- Field media stages cap artwork height, preserve the original aspect ratio, and keep the complete first triptych with captions inside a standard desktop viewport.
- Active-series and filtered-register descriptions only appear when context is actually filtered.
- First-viewport images are eagerly loaded; the remaining register continues lazily.

Relevant files:

- `src/pages/works/index.astro`
- `src/data/site/worksIndex.ts`

### Immersive Pressure Threshold

`/immersive` is a full-viewport authored threshold into the existing WebXR experience rather than a generic introduction screen.

Implemented:

- A full-bleed Three.js membrane field replaces the former static blurred backdrop.
- The field deliberately avoids procedural figures, silhouettes, and external generated imagery;
  MT-3, MT-1, and MT-6 form its preserved opening composition.
- MT-7 and MT-9 now enter later through a controlled second material bank.
- The three paintings are loaded from their 2000px responsive WebP variants, use trilinear mip filtering, and render up to 1.4 DPR on desktop so magnified pigment remains materially legible without loading the full source scans.
- Each work is sampled as a magnified, offset material fragment so the field preserves authentic pigment and charcoal without reconstructing a full pictured body.
- Domain-warped currents move the fragments as one membrane, while irregular strata masks and a coherent directional material sweep expose and dissolve artwork layers without hard crossfades.
- A continuous roughly 27-second palette clock moves clearly between the three paintings; dream-act changes phase-shift that clock and settle faster, so metamorphosis remains visible during active viewing as well as deep idle.
- `gathering`, `dispersing`, and `reforming` progressively emphasize chlorophyll, oxide-red, and chalk/cyan material states while the field continues moving inside every act.
- Compression folds, charcoal veins, fibres, and boundary light provide pressure and depth without rings or cursor-local deformation.
- Pointer movement produces a broad spatial lean without a cursor-local distortion point; pointer press produces a temporary pressure wave without accumulating permanent deformation.
- The shared Presence Director raises pressure and visibility through `settling`, `contemplating`, and `dreaming`, then lets the scene settle continuously during wake.
- Exposure, saturation, vignette, and the route veil are balanced to preserve deep edges while keeping the central pigment field luminous and readable on both desktop and mobile.
- Reduced motion retains the living material state at a greatly reduced frame rate and internal time speed.
- The threshold keeps a direct `Enter field` route into `/immersive/experience`, plus explicit MT-3 and Works routes.
- WebGL failure retains an artwork fallback instead of leaving a blank viewport.
- Route-critical fullscreen geometry also lives in a route-scoped global fallback, preventing the canvas and interface from collapsing if Astro/Vite refreshes scoped page CSS out of order during development.
- The first bank chapter begins after 64 visible seconds and later chapters use a 76-second hold.
- A 14-second irregular material reveal temporarily raises the texture count from three to four; the
  outgoing texture is disposed after the handoff and the field returns to three.
- Bank timing pauses while the document is hidden, preventing background-tab throttling from
  accelerating or invisibly completing a transition.

Relevant files:

- `src/pages/immersive.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/pages/immersive/experience.astro`
- `docs/artist-stage-v3-immersive-pigment-field-approved-checkpoint.md`

### Work Detail

`/works/[slug]` is the canonical work/object/acquisition page.

Implemented:

- Object chamber.
- Collector acquisition panel.
- Process-aware metadata and method language.
- Format/price switching.
- Inquiry/acquire hierarchy.
- Stripe checkout hooks.
- Interior scale preview.
- AR / 3D print preview host.
- Artwork surface lens/magnifier.
- Collector details cinematic reveal.
- Related/adjacent works.
- Atmosphere override per work.

Not final:

- Production mobile AR GLB/USDZ hosting and device QA.
- Final AR frame/material realism.
- Live production-sales verification.
- Final legal/policy review.
- Full artwork metadata audit.

Relevant files:

- `src/pages/works/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/modules/print-ar/`
- `src/features/print-ar-host/`
- `docs/artist-stage-v3-work-detail-collector-ar-completion.md`

### Process / Technique

`/process` is the canonical public route for the Body Manifestation Process.

Implemented:

- Dedicated authored route for the process / technique layer.
- Public language distilled from `Meta_Bodies_Technique_Body_Manifestation_Process_UK.pdf`.
- Seven-stage manifestation sequence.
- Material stack and reference-policy language.
- Work-detail / COA / metadata phrasing aligned to the same canon.
- WhisperXR bridge language so the digital layer extends the physical method instead of replacing it.
- Metamorphosis behavior: during inactivity one process sentence and the image field gain presence while secondary copy recedes; process rows form a slow sequential signal.

Relevant files:

- `src/pages/process.astro`
- `src/data/site/process.ts`
- `src/components/cinematic/CinematicIdleField.astro`
- `docs/artist-stage-v3-process-technique-route.md`

### Global Shell / Frame

Shared shell refinements now affect the main public routes.

Implemented:

- Canonical header/frame alignment across Home, Works, Artist, Contact, Process, and Series.
- Wide public-route text/image compositions now sit on the same shell axis instead of ad hoc per-page widths.
- Shared `Top` return gesture for long routes.
- Footer and header support link to `/process`.

Relevant files:

- `src/layouts/BaseLayout.astro`
- `src/components/navigation/SiteScrollTop.astro`
- `docs/artist-stage-v3-global-shell-header-calibration.md`

### Global Presence Director / Metamorphosis Mode

The site-wide stillness system is now a shared behavioral layer rather than a text-fade utility.

Implemented:

- One global mount through `BaseLayout` for every public route.
- Shared phases: `awake -> settling -> contemplating -> dreaming -> waking`.
- `dreaming` continues indefinitely through `gathering -> dispersing -> reforming` rather than ending in a static blurred frame.
- Living Atmosphere presence is driven by the same phase rather than a competing timer.
- Viewport-aware selection of one focus artwork, one key sentence, and peripheral image traces.
- Artwork-colored asymmetric pigment currents replace the earlier uniformly repeated radial contours.
- Generated visual-only word traces disperse secondary text and reform it while source text and the key anchor remain intact.
- Peripheral artwork opacity makes one long transition and then stays stable, preventing long-idle image flicker.
- Process rows pass emphasis between three groups in sync with the dream acts.
- Distance-based wake choreography from the real interaction point.
- Intentional pointer threshold so tiny cursor noise does not constantly wake the page.
- Route adapters for Home, Series, Works, Work Detail, Artist, Process, Contact, and Immersive.
- Conservative automatic root/role assignment for remaining public routes.
- Reduced-motion behavior retains depth/color but removes motion and visual distortion.

Relevant files:

- `src/layouts/BaseLayout.astro`
- `src/components/cinematic/CinematicIdleField.astro`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/components/series/SeriesWebGLBackdrop.astro`
- `docs/artist-stage-v3-presence-director-metamorphosis.md`

## Cinematic Transition System

Global route transition manager:

- `public/scripts/artist-stage-cinematic-transition.js`

Current important behavior:

- Supports `[data-cinematic-cover]`.
- Supports route payloads through `sessionStorage`.
- Supports `data-cinematic-source-selector`, used by `View work` in the Series inspector so the transition starts from the fullscreen image.
- Carries artwork palette, transition kind, and source geometry through the Series chapter, Work Detail, and return route.
- Uses explicit arrival targets so the selected Series artwork becomes the first chapter image.
- Restores active hero/Inspector work on explicit return and browser Back.
- Restores selected Series node and compatible map pan on return to `/series`.
- Honors reduced motion by preserving route state without running the visual bridge.
- Collection index routes such as `/series` no longer accept an arrival morph fallback, which prevents black placeholder covers during route entry.
- `/series` preloads its key constellation covers so the active field appears populated immediately on load.

Detailed contract:

- `docs/artist-stage-v3-series-route-continuity.md`

Do not remove this unless replacing it with a full equivalent route transition layer.

## Fullscreen Inspector Stability Contract

The Series inspector uses multiple layers:

```txt
source DOM image
fixed morph image
final panel image
shift image
```

Important fixes already made:

- Panel remains hidden until morph handoff.
- `data-handoff` is not set during opening.
- Morph image is pinned to final transform before cancelling WAAPI animation.
- Old source image hiding was removed.
- `data-handoff` is cleaned during close/force close.
- Inspector close now syncs the Series chapter carousel to the last active inspector image.

If blinking or double images return, inspect the staging order in:

- `src/pages/series/[slug].astro`

Search for:

```txt
openInspector
hideMorphLayer
data-handoff
series-inspector__panel
series-inspector__morph
```

## Performance Status

`npm run build` currently passes.

Implemented performance foundations:

- responsive generated WebP assets under `public/generated/`;
- responsive image helper;
- reduced expensive atmosphere work during scroll/transition;
- preloaded critical `/series` constellation covers;
- WebGL backdrop guarded behind a stable host and disabled when WebGL cannot initialize;
- Series Presence overlays mounted in an Astro-owned wrapper so React hydration remains untouched;
- Vite watcher ignores for heavy local diagnostic folders.

Known warnings:

- Astro dynamic route warnings in server mode.
- Vite chunk-size warning, likely related to immersive/Three/XR/AR dependencies.

These warnings are known and not currently blocking.

## Current Risks / Watch Items

- Process living material currently uses existing artwork sources as an authored prototype. Replace
  these progressively with real charcoal starts, fixed traces, working notes and process scans while
  preserving the stable target slugs and bounded texture lifecycle.
- The new route cinematography has passed synthetic desktop/mobile checks, but Process, Artist and
  Contact still need author review and physical-device GPU/thermal QA.
- Series living pigment field and its long-idle integration have completed the current conceptual pass; they still need author review and real-device low-powered hardware QA.
- Home living overture and Immersive material bank passed synthetic desktop/mobile QA but still need
  physical-device GPU and thermal review.
- AR/3D preview is integrated but frame/material realism remains prototype quality.
- Mobile AR needs production GLB/USDZ hosting, asset validation, and device testing.
- Final author review is still needed for titles, statements, years, series membership, status, edition data.
- Work metadata supports method/layer/reference language, but values should still be audited work-by-work.
- Commerce exists but is not fully production-sales approved.
- Mobile/tablet QA should be repeated on physical devices for Home, Series, inspector, Immersive, Work Detail, Process, and AR overlay.
- Several visual systems are pass-layered; after art direction approval, CSS consolidation would be valuable.

## Recommended Next Work

Recommended next sequence:

```txt
1. Process route background direction pass 02.
2. Artist route background direction pass 02.
3. Contact route background direction pass 02.
4. Works archive illumination and Field pacing pass 02.
5. Cross-route comparison, physical-device and long-idle QA.
6. Selective Immersive reassessment after the editorial routes settle.
7. Authentic process assets and content author review.
8. AR/3D realism, commerce readiness and production hardening.
```

The phase-level source of truth is `docs/artist-stage-v3-roadmap.md`.

## Do Not Break

- The Home living overture, real-artwork-only WebGL field, and two-texture resting memory model.
- Route identity: Process, Artist and Contact must not collapse into one copied crop, shader result or
  timing preset.
- Works must remain a clean archive surface. Do not restore full-screen artwork WebGL or autonomous
  artwork cycling without a new archive-specific rationale and QA.
- Works light input must preserve pointer/keyboard equivalence and avoid a cursor-local glow.
- Immersive remains a dedicated three-channel membrane rather than the editorial route renderer.
- Home background artwork click-to-activate behavior.
- Home scene ownership: lower chapters may target the material field only while entering or inside the
  viewport, and Hero regains ownership on return.
- Hero orbit quiet pockets and readable minimum cover opacity.
- Series inspector as image-first viewing layer.
- `View work` as the bridge to `/works/[slug]`.
- `/process` as a support route for method, not a product/marketing page.
- Route atmosphere handoff behavior.
- Responsive generated image usage.
- Existing checkout hooks and data attributes in Work Detail.
- WebGL Series backdrop host placement outside the React island.
- Series Presence root and generated Presence layers outside the React island.
