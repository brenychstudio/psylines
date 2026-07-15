# ARTIST STAGE v3 - Living Background Route Cinematography

Date: 2026-07-15
Status: implemented / desktop-mobile-transition QA passed
System: Living Background Environment, route direction v2

## 1. Decision

The site shares one living-system grammar, but it must not share one repeated visual result.

```txt
shared lifecycle and presence signals
+ route-specific image construction, light and tempo
= one authored world with distinct rooms
```

Home remains the full pigment overture. Process, Artist and Contact use the same bounded texture
lifecycle but have separate shader constructions. Works deliberately does not use a full-screen
painting renderer: the archive needs optical calm and direct artwork comparison. Immersive keeps its
approved dedicated pressure membrane.

## 2. Shared Infrastructure

The editorial renderer is:

- `src/components/living-background/LivingRouteEnvironment.astro`

Shared behavior is limited to infrastructure:

- one fixed Three.js plane behind semantic content;
- current + memory textures while resting;
- one temporary incoming texture during a handoff;
- quintic smootherstep progress and a completely settling transition;
- damped time, journey, scroll, pointer and Presence Director signals;
- section ownership through `data-lbe-target`;
- broad pointer influence without a cursor-local dent;
- reduced motion, hidden-tab pause, fallback and complete teardown;
- development state and canvas-pixel sampling hooks.

The stable GPU contract is:

```txt
resting: 2 textures
transition: 3 textures
after transition: 2 textures
```

The visual model is not shared. The fragment shader contains three authored branches with different
UV construction, exposure masks, memory behavior and transition coordinates.

## 3. Route Matrix

| Route | Visual model | Handoff | Auto chapter | Desktop DPR cap |
| --- | --- | ---: | ---: | ---: |
| Process | trace field / raking work light | 5800ms | 46s | 1.45 |
| Artist | dissolved palimpsest / memory exposures | 6400ms | 62s | 1.45 |
| Contact | quiet signal chamber / crossing corridor | 7200ms | 84s | 1.35 |
| Works Index | clean archive / retained museum light | CSS/DOM | disabled | n/a |
| Works Field | exhibition route / stronger retained light | CSS/DOM | disabled | n/a |
| Immersive | dedicated three-channel pressure membrane | 10500ms | 48s | dedicated |

Mobile WebGL DPR is capped at `1.0`. Process, Artist and Contact resolve real project artwork at a
2000px source width before the shader samples it.

## 4. Process - Trace Field

Purpose: make technique feel like an active material investigation rather than a text page with a
painting enlarged behind it.

Construction:

- five-tap softened artwork sampling suppresses magnified source noise;
- pigment is pushed toward charcoal, paper and restrained mineral color;
- line energy and broad material strata remain visible;
- a slow diagonal raking light reveals and withdraws from the surface;
- negative fill protects the long text column;
- section targets move through field, trace, structure and study states;
- transition motion reads as a change of working layer rather than a global crossfade.

Prototype sources:

```txt
process-field     -> MT-3
process-trace     -> MT-2
process-structure -> MT-5
process-study     -> current studio/process image
```

Future charcoal starts, fixed traces, notes and process scans should replace these sources under the
same slugs. They must not become permanent extra GPU layers.

## 5. Artist - Practice Palimpsest

Purpose: make the practice read as accumulated memory and recurring image states.

Construction:

- artwork is not stretched into one cover image;
- current and memory sources occupy separately scaled, localized planes;
- low-frequency dissolve masks and two moving exposure bands reveal partial manifestations;
- warm and cool stage light moves independently from the image masks;
- foreground paintings stay crisp while background traces remain incomplete;
- the handoff arrives as an irregular memory exposure, not a wipe;
- a dark left field keeps the statement readable without an opaque card.

The result should feel authored and psychological, not like Home with a different palette.

## 6. Contact - Signal Chamber

Purpose: support direct communication with the quietest route atmosphere.

Construction:

- the base field stays close to black;
- softened pigment appears only through two broad diagonal signal corridors;
- a restrained rust response marks movement without illuminating the whole page;
- the direct-contact column receives a controlled key light;
- motion, pointer energy and autonomous cycling are slower than on editorial routes;
- the horizontal handoff behaves like a signal passing through a dark chamber.

Email, copy action, social links and collector context remain semantic HTML above the decorative
canvas. The environment may add tension but must never compete with the contact task.

## 7. Works - Archive Illumination

The full-screen artwork WebGL profile was removed after visual review. It duplicated the archive
images, amplified grain, weakened comparison and made every card compete with its own background.

Works now uses:

- `src/components/works/WorksArchiveIllumination.astro`

Behavior:

- near-black museum field with no artwork texture behind the grid;
- one broad raking light and one counter-light, built from CSS linear gradients;
- tone families (`moss`, `oxide`, `amber`, `mineral`, `neutral`) derived from the active card;
- hover and keyboard focus move light broadly toward the selected work;
- no cursor-local glow, dot or distortion;
- light remains for `5.2s` after pointer departure, creating a short archive memory;
- Index stays quiet for comparison; Field receives a stronger exhibition exposure;
- no canvas and no archive textures are uploaded to GPU memory.

Canonical artwork images remain filter-neutral, crisp and visually dominant.

## 8. Immersive - Dedicated Membrane

Immersive keeps `ImmersivePressureField`. Its spatial role and three persistent material channels are
different from the editorial renderer.

Current contract:

```txt
resting: 3 persistent textures
transition: 3 persistent + 1 temporary incoming texture
after transition: 3 persistent textures
```

It inherits the quintic settling handoff and temporary-resource release, but it must not be replaced
by Process, Artist or Contact art direction.

## 9. Target Adapter

Narrative sections expose stable source identities:

```html
<section data-lbe-target="process-structure">...</section>
```

Non-DOM controllers may request a target explicitly:

```js
window.dispatchEvent(
  new CustomEvent("artist-stage:living-route-target", {
    detail: { slug: "artist-pressure" },
  }),
);
```

Works does not use this texture adapter. Its cards expose `data-works-light-tone` to the archive
illumination director instead.

## 10. Debug Contract

Editorial route host:

```js
host.__artistStageLivingRouteState();
// profile, currentSlug, memorySlug, incomingSlug,
// loadedTextureCount, progress, journey, scrollVelocity, state

host.__artistStageLivingRouteSample();
// width, height, checksum, samples, time
```

Works archive host:

```js
host.__artistStageWorksArchiveLightState();
// mode, activeSlug, tone, position, intensity
```

Immersive retains its dedicated pressure-bank helpers.

## 11. QA Record

Passed on 2026-07-15:

- desktop visual review at `1440 x 948`;
- mobile visual review at `390 x 844`;
- zero horizontal overflow on Process, Artist, Contact, Works Index, Works Field and Immersive;
- no browser console or page errors;
- nonblank, nonuniform WebGL pixel samples on all canvas routes;
- reduced-motion Process field remains visible and stable;
- complete Process, Artist and Contact handoffs with visible mid-transition frames;
- correct final target ownership and two/three/two texture lifecycle;
- Works Index and Field render with no WebGL canvas;
- Works hover light retains the active tone and then settles;
- Immersive remains nonblank and correctly framed on desktop and mobile.

Production build and physical-device checks are recorded separately. Real iOS/Android and low-power
GPU/thermal QA remain required before final production approval.

## 12. Guardrails

- Use only authentic project imagery.
- Do not reintroduce synthetic pixel grain to create activity.
- Do not make route identity a palette-only variation.
- Do not stretch Artist memory layers into a permanent full-screen poster.
- Do not turn Process into generic fog or smoke.
- Do not brighten Contact into a decorative red backdrop.
- Do not restore full-screen artwork WebGL to Works without a new archive-specific reason and QA.
- Do not replace the dedicated Immersive membrane with the editorial renderer.
- Do not expose cursor-local distortion or light joints.
- Do not use atmosphere to hide weak hierarchy.

## 13. Relevant Files

- `src/components/living-background/LivingRouteEnvironment.astro`
- `src/components/works/WorksArchiveIllumination.astro`
- `src/components/home/HomePrologueField.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/pages/process.astro`
- `src/pages/artist.astro`
- `src/pages/contact.astro`
- `src/pages/works/index.astro`
- `src/pages/immersive.astro`
- `docs/living-background-environment-universal-tool.md`
