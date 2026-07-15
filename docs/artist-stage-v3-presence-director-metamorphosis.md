# ARTIST STAGE v3 - Presence Director / Metamorphosis Mode

## Series Hydration Boundary

On `/series`, `data-cinematic-idle-root` belongs to the Astro-owned `.series-presence-root` wrapper rather than the React constellation root. Generated veil, phrase, pigment, and dispersal layers must remain outside the React island so they cannot alter server markup before hydration.

Date: 2026-07-13

## Goal

Turn inactivity from a subtractive fade into a second authored state of the site.

The site has two modes of existence:

```txt
interaction -> interface
stillness -> contemplative artwork field
```

Every element that recedes should reveal another form of presence: an artwork, a key sentence, pigment, a contour route, a material trace, or a contact beacon.

## Architecture

The global runtime and styles remain in:

```txt
src/components/cinematic/CinematicIdleField.astro
```

It is mounted once for every public route by:

```txt
src/layouts/BaseLayout.astro
```

Pages with authored behavior keep a local `[data-cinematic-idle-root]`. Routes without one receive a single automatic `<main>` root and conservative semantic roles for headings, long paragraphs, figures, and pictures.

The Presence Director is the source of phase truth. It broadcasts:

```txt
artist-stage:presence-phase
artist-stage:presence-dream-cycle
```

and writes:

```txt
html[data-presence-director="active"]
html[data-presence-phase]
html[data-presence-route]
html[data-presence-dream-cycle]
```

The Living Atmosphere Orchestrator consumes that phase instead of running a competing stillness timer.

## Phase Contract

```txt
awake
-> settling
-> contemplating
-> dreaming
-> waking
-> awake
```

Legacy root state remains compatible:

```txt
awake -> awake
settling -> settling
idle -> contemplating
dreaming -> dreaming
waking -> waking
```

Atmosphere mapping:

```txt
awake / waking -> active
settling -> settling
contemplating -> still
dreaming -> deep
```

`dreaming` is not a terminal pose. It contains an endless three-act loop:

```txt
gathering -> dispersing -> reforming -> gathering
```

The active root mirrors the act in `data-cinematic-dream-cycle`. Each act lasts long enough to read as a material transition rather than a UI pulse.

## Metamorphosis Behavior

On entry the director computes a deterministic composition from the current viewport:

- one visible focus artwork or presence object;
- one visible key heading;
- up to three peripheral image traces;
- a focus position used by the contour and atmosphere layers;
- staggered enter and wake timing based on real screen distance.

Deep stillness adds rather than only removes:

- the focused artwork keeps full clarity and gains material presence;
- one key sentence remains readable while secondary copy recedes;
- the sentence is repeated as a low-contrast spatial trace behind the composition;
- one or two secondary text passages produce pointer-inert word traces that disperse and partially reform;
- artwork-derived color and contour layers become more present;
- peripheral images make one long transition into stable memory traces; image opacity never loops;
- route-specific systems change their own behavior.

The global field uses broad asymmetric pigment currents. Uniform repeating radial contours were removed because they made the space look mechanical and static.

No route auto-scrolls, auto-opens, or changes the user's active selection.

## Wake Behavior

Pointer movement uses an intentional-distance threshold. Tiny stationary pointer noise does not continually break contemplation.

Pointer down, wheel, scroll, keyboard, and touch wake immediately. The director records the interaction point and rebuilds content in a distance-based wave from that position.

The wake phase returns controls and content gradually, then resolves to `awake` and schedules the next stillness cycle.

## Route Adapters

### Home

- The selected manifestation remains dominant.
- Its material contrast and artwork color breathe more deeply.
- Orbit works become peripheral memory rather than disappearing.

### Series

- Neural routes slow down.
- The active chapter remains dominant while remote nodes quiet down.
- WebGL receives the shared presence phase.
- WebGL also receives each dream act. Gathering, dispersing, and reforming vary drift, morph depth, contour, bloom, and pigment presence without changing artwork opacity.
- Active artwork shadow/halo motion is slowed to a 34-second material cycle.
- Desktop and mobile chapter browsers expose the same focus, anchor, image, and text roles.
- `waking` produces a restrained field pulse.

### Works

- One visible artwork becomes the contemplative subject.
- Other archive objects remain present as a quieter register.
- No filtering, selection, or route state is changed automatically.

### Work Detail

- The physical artwork surface becomes the visual center.
- Identity copy recedes while the title remains as the key phrase.
- Collector controls stay visible and wake immediately on interaction.
- Inspecting/focused controls still prevent idle entry.

### Artist / Process

- One sentence remains as the conceptual spine.
- Practice images and process traces gain presence.
- Process rows pass emphasis between three groups in sync with the dream acts rather than stopping at one blurred state.
- Secondary process language disperses into word traces and then reforms while the conceptual anchor remains legible.

### Contact

- The email remains a clear beacon.
- Contact controls never become unavailable.

### Immersive

- The threshold phrase and primary route remain present.
- The atmosphere carries more of the composition in deep stillness.

### Generic Public Routes

- A conservative auto-root provides the shared phase, atmosphere, key phrase, and wake behavior.
- Forms, navigation, dialogs, and short operational labels are not automatically dissolved.

## Accessibility And Stability

- `:focus-within` blocks entry into stillness.
- All generated layers are `aria-hidden` and pointer-inert.
- Text dispersal duplicates are visual only; source text remains unchanged in the document and accessibility tree.
- Essential actions remain in the DOM and become fully visible on hover/focus/wake.
- Reduced motion keeps one static `gathering` composition, hides word traces, and removes transform, filter, transition, and looping animation behavior.
- The system does not write presence state to storage.
- Route handoff memory and artwork selection remain separate concerns.

## Relevant Files

```txt
src/layouts/BaseLayout.astro
src/components/cinematic/CinematicIdleField.astro
src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts
src/components/series/SeriesWebGLBackdrop.astro
src/pages/works/[slug].astro
src/components/works/ObjectChamberHero.astro
src/components/works/AdjacentManifestations.astro
```

## Verification

- `npm run build` passes on 2026-07-13.
- `git diff --check` passes apart from repository line-ending notices.
- Natural idle QA reached `dreaming` on Home, Series, Process, Works, and Work Detail.
- Long-idle Series sampling held active and peripheral image opacity at `1` and `0.44` across `dispersing`, `reforming`, and `gathering`; only the shadow and field continued changing smoothly.
- Process sampling confirmed repeating act changes and progressive row/text interpolation rather than a terminal blurred frame.
- Browser state QA confirmed one focus target, one key anchor, one generated phrase, and atmosphere presence `deep` during Home dreaming.
- Intentional pointer movement moved `dreaming -> waking -> awake` with no runtime exception.
- `/collectors` confirmed the automatic-root fallback with one root, generated layers, and semantic targets.
- Desktop captures passed at `1600 x 900`.
- Mobile Works and Series captures passed at `390 x 844`; mobile Series resolves one focus, one echo, and one short text trace with no document-width overflow.
- Reduced-motion headless QA remained on one `gathering` act with the dispersal field hidden, layer animation disabled, and living activity/velocity held at zero.

## Watch Items

- Author review of contour visibility and phrase-trace intensity.
- Real-device mobile timing and battery use.
- Low-powered GPU behavior on Series while deep contemplation is active.
- Route-by-route refinement of which image becomes the authored focus when several large works share the viewport.
