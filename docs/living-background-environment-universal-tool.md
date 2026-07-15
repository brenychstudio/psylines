# Living Background Environment v1.0

Date: 2026-07-15
Status: approved reference system / reusable specification / multi-route extension implemented
Source project: ARTIST STAGE v3
Reference implementations: Home Living Overture + route-specific editorial profiles

## 1. Definition

**Living Background Environment (LBE)** is a reusable visual system that turns real project imagery
into a continuously changing cinematic environment. It is not a slideshow, a blurred cover image, or
a decorative WebGL effect. The artwork becomes material: pigment, memory, pressure, light, depth and
spatial continuity.

The system connects three layers that are usually designed separately:

```txt
artwork-derived WebGL material
-> page interaction and narrative state
-> directed light around crisp foreground objects
```

The result is one visual space in which background, interface and artwork surfaces respond to the
same active object and the same temporal state.

## 2. Conceptual Purpose

Conventional art sites often place a static image behind content. That creates atmosphere for one
frame, but the image stops participating in the experience. LBE treats the background as an active
continuation of the work.

The core proposition is:

```txt
The painting is not placed on top of the environment.
The painting generates the environment.
```

This changes the role of the background:

- from decoration to authored material;
- from a fixed crop to a temporal field;
- from a global tint to artwork-specific memory;
- from uniform visibility to directed exposure;
- from an isolated hero trick to route continuity.

## 3. Non-Negotiable Principles

### 3.1 Source integrity

- Use real project imagery as the primary texture source.
- Do not invent substitute artwork, synthetic figures or unrelated generated imagery.
- Preserve the recognizable material character of the source: brush, paper, charcoal, grain and
  color relationships.
- Magnification and abstraction are allowed; replacement of the authorial source is not.

### 3.2 Continuous life

- The field must move without pointer or scroll input.
- Interaction adds energy, direction or pressure; it does not create the only visible motion.
- After interaction ends, the field returns to autonomous breathing instead of freezing.
- Deep idle can change behavior, but must remain stable and non-flickering.

### 3.3 Cinematic hierarchy

- Foreground artwork remains crisp and inspectable.
- The environment may be magnified, refracted and layered.
- Light is directed around the active work; the whole route is never equally bright.
- Copy receives a quiet pocket rather than a flat opaque panel.

### 3.4 Spatial continuity

- Hero and lower chapters belong to one exposure field.
- Section boundaries must not appear as gray overlays, hard borders or abrupt atmosphere cuts.
- The dominant artwork may change during scroll, but only after intent has stabilized.

### 3.5 Reversibility and access

- The experience never removes essential content or controls.
- Reduced-motion users retain a living, low-frequency material state.
- WebGL failure falls back to an artwork-derived image treatment with autonomous drift.

## 4. Experience Grammar

LBE is driven by authored targets and continuous signals.

### Discrete state

```txt
loading
-> resting(current + memory)
-> transitioning(current + memory + incoming)
-> resting(incoming + previous current)
```

### Continuous signals

```txt
time
pointer lean
interaction energy
scroll progress
scroll velocity
scroll direction
route journey
presence depth
dream act
dominant artwork target
```

The system should never map raw browser events directly to visible deformation. Every input is
clamped, damped and translated into a broad material response.

## 5. Reference Architecture

```txt
Artwork data
  responsive source + slug + atmosphere identity
        |
        v
Target director
  Hero selection / scroll dominance / focus / route return
        |
        v
Texture lifecycle manager
  current + memory + temporary incoming
        |
        v
WebGL material renderer
  crop -> flow -> memory -> transition -> light -> finish
        |
        +-------------------------------+
        |                               |
        v                               v
Presence Director                 DOM lighting director
idle depth / dream act            key light / negative fill / veils
        |                               |
        +---------------+---------------+
                        v
                 one living route
```

### ARTIST STAGE reference files

- `src/components/home/HomePrologueField.astro`
- `src/components/living-background/LivingRouteEnvironment.astro`
- `src/components/immersive/ImmersivePressureField.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`
- `src/pages/index.astro`
- `src/components/cinematic/CinematicIdleField.astro`
- `docs/artist-stage-v3-home-living-overture-checkpoint.md`
- `docs/artist-stage-v3-living-background-route-profiles.md`

## 6. Artwork Data Contract

The renderer needs stable identity and a sufficiently large responsive texture. Atmosphere metadata
can remain in a parallel project-specific model.

```ts
export type LivingBackgroundTexture = {
  slug: string;
  src: string;       // recommended: 1400-2400px WebP or AVIF
  width?: number;
  height?: number;
  palette?: {
    field: string;
    glow: string;
    accent: string;
  };
};
```

The foreground image and the environment should resolve from the same canonical artwork identity.
Never synchronize them by array position alone.

## 7. Texture Lifecycle

The approved memory rule is intentionally small:

```txt
resting:       2 resident textures
transition:    3 resident textures
after settle:  2 resident textures
```

Roles:

- `current`: active material source;
- `memory`: previous active source, visible through controlled apertures;
- `incoming`: temporary source used only during a handoff.

At transition completion:

```txt
memory  <- previous current
current <- incoming
dispose <- previous memory
```

This prevents an artwork archive from becoming a permanent GPU texture cache. ARTIST STAGE uses
2000px WebP assets, sRGB color space, `LinearMipmapLinearFilter`, linear magnification and generated
mipmaps.

### Loading rules

- Reveal the canvas as soon as `current` is ready.
- Load `memory` independently; do not hold the first frame hostage.
- Queue only the latest requested target during an active transition.
- If a target resolves to current or memory, avoid unnecessary network and GPU churn.
- Pause transition time while the document is hidden.
- Dispose textures, material, geometry, renderer and listeners on teardown.

## 8. Shader Pipeline

The reference fragment shader is organized as a material pipeline rather than a stack of unrelated
effects.

```txt
1. cover UV and slow crop migration
2. multi-scale FBM current
3. broad pointer and scroll impulse
4. current / memory / incoming sampling
5. irregular transition mask
6. memory apertures and detail return
7. directional light fronts and relief
8. restrained chromatic separation
9. exposure, vignette and edge finish
```

### 8.1 Autonomous current

Several low-frequency noise layers move at different rates. The field reads as one pressure system,
not as smoke or a looping displacement texture. Motion must remain visible at rest while staying slow
enough for the painting surface to remain legible.

### 8.2 Cover and crop migration

Each source is sampled with aspect-aware cover UVs. A very slow journey offset changes which pigment
fragments dominate over time. This is essential: a static enlarged crop will read as wallpaper even
if its pixels deform.

### 8.3 Material memory

The previous source is not crossfaded globally. It reappears through low-frequency apertures whose
position, scale and opacity move independently. Memory should feel embedded inside the current work,
not placed as a second rectangle.

### 8.4 Surface detail

The renderer re-samples finer source detail after the broad deformation stage. This protects paper
grain, charcoal edges and brush structure from becoming a low-resolution blur.

### 8.5 Directed light

Lighting is derived from broad luminance differences, procedural ridges and project atmosphere
colors. It should create fronts, folds and relief without pretending to be physically exact 3D.

## 9. Cinematic Handoff

ARTIST STAGE uses a `5200ms` handoff. The linear progress is converted with smootherstep:

```js
const t = clamp((now - startedAt) / 5200, 0, 1);
const eased = t * t * t * (t * (t * 6 - 15) + 10);
```

The visible handoff combines:

- a broad diagonal transition coordinate;
- low-frequency FBM irregularity;
- a wide reveal band rather than a hard wipe;
- opposing material shear on current and incoming layers;
- pressure that peaks in the middle and disappears at rest;
- a temporary pigment edge localized around the reveal boundary.

The effect must settle completely. Any transition-only edge, shear or luminance pulse left active at
rest will look like flicker or a rendering bug.

### Recommended ranges

| Parameter | General range | ARTIST STAGE |
| --- | ---: | ---: |
| Handoff duration | 4200-6500ms | 5200ms |
| Reveal softness | 0.18-0.30 UV | 0.24 UV |
| Shear amplitude | 0.008-0.024 UV | 0.018 / 0.014 |
| Target dwell | 220-450ms | 320ms |
| Resting texture count | 2 | 2 |
| Transition texture count | 3 | 3 |

## 10. Interaction Direction

### Pointer

Pointer movement creates a broad field lean. In the reference shader the maximum UV contribution is
approximately `0.007` horizontally and `0.005` vertically, modulated by interaction energy.

Do not create a radial cursor dent. A visible deformation joint exactly under the cursor breaks the
illusion of a coherent field and makes the system feel like a demo effect.

### Scroll

Scroll contributes:

- normalized route journey;
- velocity impulse;
- direction;
- dominant artwork target.

Velocity should decay quickly. Journey and artwork target should settle slowly. These signals have
different narrative meanings and should not share one smoothing constant.

### Dominance dwell

The lower field waits `320ms` before dispatching a new artwork target. The timer is cancelled if the
candidate loses dominance or the field leaves its engagement corridor. This prevents incidental
scroll crossings from launching five-second texture handoffs.

## 11. Directed Exposure for Foreground Content

The WebGL field alone cannot create the full spatial hierarchy. Foreground DOM content needs a
separate lighting director synchronized to the same dominant artwork.

ARTIST STAGE uses:

- a viewport-sized sticky key light following the dominant artwork x-axis;
- an opposing negative-fill field;
- a dark, soft quiet pocket behind copy;
- focus-dependent edge veils around artwork wrappers;
- local sheen, shadow depth and restrained glow;
- filter-neutral artwork pixels.

Direct filters on the artwork image are avoided. Exposure is staged with wrapper and pseudo-element
layers so the original image color and detail remain stable.

### Continuity bridge

The Hero-to-editorial boundary uses a `38rem` masked exposure bridge. It continues the outgoing Hero
treatment and dissolves gradually. There is no section border, solid gray layer or opaque background
that can cut the fixed WebGL field into separate screens.

## 12. Presence and Deep Idle

LBE can consume a global presence state, but should not duplicate the global idle state machine.

```txt
awake -> settling -> contemplating -> dreaming -> waking
```

Within deep idle, ARTIST STAGE continues through authored dream acts such as gathering, dispersing and
reforming. LBE maps these states to pressure, aperture depth, light movement and crop journey. It does
not blink artwork opacity or restart the shader.

Rules:

- all temporal waves must remain continuous across phase changes;
- state changes alter targets, not raw output values;
- images never oscillate around zero opacity;
- wake returns through damping, not an instant reset;
- hidden tabs pause elapsed transition time.

## 13. Universal Event Adapter

The Home implementation uses `artist-stage:home-prologue-target`. The multi-route implementation
uses `artist-stage:living-route-target`. A portable package should expose a neutral adapter:

```ts
export type LivingBackgroundTargetDetail = {
  slug: string;
  source: "hero" | "scroll" | "focus" | "route" | string;
  immediate?: boolean;
};

window.dispatchEvent(
  new CustomEvent<LivingBackgroundTargetDetail>("living-background:target", {
    detail: { slug: "work-03", source: "scroll" },
  }),
);
```

Recommended public controls:

```ts
type LivingBackgroundController = {
  setTarget(detail: LivingBackgroundTargetDetail): void;
  setPresence(depth: number, act?: string): void;
  setJourney(progress: number, velocity?: number, direction?: -1 | 1): void;
  getState(): LivingBackgroundDebugState;
  destroy(): void;
};
```

The renderer should not know whether the target came from a carousel, a scroll chapter, a CMS route
or an exhibition controller.

## 14. Adaptation Presets

| Context | Motion | Transition | Memory | Lighting |
| --- | --- | --- | --- | --- |
| Artist site | slow pigment current | 4.8-6.2s | previous work | authored key + quiet copy pocket |
| Museum archive | very slow / low contrast | 5.5-7s | previous room or object | neutral directional exposure |
| Fashion/editorial | stronger flow and chroma | 3.8-5.2s | previous look | narrower moving key |
| Performance microsite | pressure responsive | 3.5-5.5s | prior scene | high-contrast cue states |
| Product storytelling | subtle surface drift | 3.2-4.8s | previous material | product-safe edge separation |

Tune in this order:

```txt
source crop
-> exposure hierarchy
-> autonomous speed
-> transition duration
-> interaction energy
-> deep-idle behavior
```

Do not begin by increasing noise amplitude. Most weak results come from a poor crop, flat exposure or
an undefined narrative target, not from insufficient shader complexity.

### 14.1 Route cinematography layer

The reusable system separates lifecycle and signal processing from route art direction. Sharing a
texture manager does not require sharing one crop, one material composition or even WebGL on every
route. A valid rollout begins by deciding what kind of space the route needs.

ARTIST STAGE currently implements:

| Profile | Narrative role | Handoff | Target policy |
| --- | --- | ---: | --- |
| Process | trace field with raking work light | 5800ms | scroll-dominant sections + 46s autonomous chapter |
| Artist | localized dissolved memory planes | 6400ms | scroll-dominant sections + 62s autonomous chapter |
| Contact | dark chamber with crossing signal corridors | 7200ms | long-dwell sections + 84s autonomous chapter |
| Works | canvas-free museum/archive illumination | CSS/DOM | hover/focus light memory; no autoplay |
| Immersive | dedicated pressure membrane | 10500ms | dedicated three-channel material bank |

This is not a set of color themes. Process, Artist and Contact share a lifecycle implementation but
use distinct shader branches, UV construction, exposure masks and transition coordinates. Works is
the important exception: its archive purpose is better served by broad CSS light than by a duplicate
full-screen painting. The complete project implementation is documented in
`docs/artist-stage-v3-living-background-route-profiles.md`.

## 15. Performance Contract

- Cap device pixel ratio according to content and target hardware; do not blindly render at native
  high-DPI resolution.
- Use responsive compressed assets rather than full source scans.
- Keep two resting textures and one temporary incoming texture.
- Clamp frame delta after tab stalls.
- Lower frame frequency and internal time speed under `prefers-reduced-motion`.
- Pause rendering work when hidden where practical.
- Dispose every GPU resource and listener during route teardown.
- Avoid loading the entire artwork archive into GPU memory.

ARTIST STAGE keeps the reduced-motion field alive at a much lower frame frequency and approximately
five percent of normal internal time speed.

## 16. Fallback Contract

Fallback is part of the tool, not an error screen.

Minimum fallback:

- artwork-derived cover source;
- slow background-position or transform drift;
- palette-aware veil;
- readable foreground hierarchy;
- no dependency on pointer movement;
- identical content and route controls.

If the first current texture fails, keep the fallback visible and log a scoped warning. A failed
memory texture must never block the current source.

## 17. Accessibility Contract

- Preserve semantic content outside the canvas.
- Mark the material canvas as decorative unless it contains essential information.
- Never encode the active work only through background color or motion.
- Keep keyboard and touch target selection equivalent to pointer selection.
- Respect reduced motion without turning the route into a frozen black frame.
- Avoid flashes, abrupt luminance jumps and rapid chromatic oscillation.
- Keep focus, modal and route controls above the environment and outside transformed idle roots where
  fixed geometry would otherwise be displaced.

## 18. QA Protocol

### Visual

- Current artwork is recognizable as material without becoming a literal full-screen poster.
- Foreground work remains crisp and separated from related pigment.
- The field changes while the visitor does nothing.
- No cursor-local seam, dent or accumulation point is visible.
- Mid-transition frames remain continuous and transition artifacts disappear at rest.
- Hero and lower chapters share one atmosphere without a horizontal overlay cut.
- Light follows the authored dominant work instead of illuminating every object equally.

### Runtime

- Canvas dimensions match the visible route area.
- Time-separated pixel samples produce different checksums at rest.
- A completed handoff returns to two resident textures.
- Rapid target changes preserve only the latest queued target.
- Returning above the lower field restores the active Hero target.
- Hidden-tab time does not skip the transition to completion.
- Route teardown leaves no canvas, listener or texture leak.

### Viewports

- Desktop wide: 2048x1024 or larger.
- Desktop standard: 1440x900.
- Tablet portrait: 768x1024.
- Mobile portrait: 390x844.
- Verify no horizontal overflow and no artwork/copy overlap.

### Stability

- Browser console has no application errors.
- WebGL failure retains a living fallback.
- Build passes.
- Test on low-power hardware before production approval.

## 19. Integration Recipe

1. Define the route's narrative job and decide whether it needs WebGL at all.
2. Select 3-8 canonical source artworks and prepare responsive 1400-2400px assets when material
   imagery is justified.
3. Define stable slugs and optional palette metadata.
4. Design a route-specific image construction, exposure map and transition coordinate.
5. Mount one fixed/full-viewport material renderer only on routes that benefit from it.
6. Implement the two-at-rest / three-in-transition texture lifecycle.
7. Build autonomous flow before adding interaction.
8. Add a completely settling cinematic handoff.
9. Connect Hero or section selection through the target adapter.
10. Add scroll-dominance with a 220-450ms intent dwell where narrative ownership is meaningful.
11. Stage DOM key light, negative fill and a quiet copy pocket.
12. Connect the existing presence/idle director through damped targets.
13. Implement reduced-motion and non-WebGL fallback behavior.
14. Add debug state and pixel-sampling hooks.
15. Run the complete QA protocol before visual approval.

## 20. Debug Surface

The reference implementation exposes non-public QA helpers on the host element:

```ts
host.__artistStageHomePrologueState();
// currentSlug, memorySlug, incomingSlug,
// loadedTextureCount, progress, journey,
// scrollVelocity, state

host.__artistStageHomePrologueSample();
// width, height, checksum, samples, time

host.__artistStageLivingRouteState();
host.__artistStageLivingRouteSample();

host.__artistStageWorksArchiveLightState();
// canvas-free archive light: active work, tone, position and intensity
```

A portable version should retain equivalent development-only hooks. They turn subjective statements
such as “the background seems frozen” into testable runtime conditions.

## 21. Guardrails

Do not:

- replace authentic source material with unrelated generated imagery;
- simulate bodies, faces or objects not present in the source;
- use a single static enlarged crop as the final field;
- treat synthetic pixel grain as a substitute for image quality or motion direction;
- crossfade the whole screen with a fast opacity tween;
- attach a visible radial distortion to the cursor;
- illuminate the entire lower route uniformly;
- cover the WebGL field with a near-opaque section background;
- apply destructive filters directly to canonical artwork images;
- preload all archive textures;
- add full-screen artwork WebGL to an archive when broad light is sufficient;
- leave transition-only effects active after settling;
- use the living background to compensate for weak layout hierarchy.

## 22. Reference Parameters: ARTIST STAGE

```txt
Renderer: Three.js WebGL full-viewport plane
Sources: real project 2000px WebP artwork variants
Resting textures: 2
Transition textures: 3
Handoff: 5200ms smootherstep
Target dwell: 320ms
Hero/editorial bridge: 38rem
Pointer lean: broad, approximately 0.007 x 0.005 UV
Reduced-motion frame interval: 140ms
Reduced-motion internal speed: 0.05
Normal internal speed: 0.82
Lower authored route: 344rem
```

## 23. Reuse Decision

LBE is ready to reuse as a pattern and reference implementation. Before extraction into an npm
package or standalone module, separate the project-specific adapter, palette bridge and DOM selectors
from the renderer core. The shader pipeline, texture lifecycle, signal model, transition choreography,
fallback contract and QA hooks already form a stable portable foundation.

## 24. Version Record

`v1.0 / 2026-07-14`

- Approved after the Home Living Overture cinematic continuity revision.
- Captures current + memory + incoming material architecture.
- Captures 5.2-second irregular smootherstep handoff.
- Captures scroll-dominance dwell and Hero target restoration.
- Captures directed lower-field lighting and 38rem continuity bridge.
- Captures Presence Director integration, reduced motion, fallback and QA contracts.

`Route cinematography v2 / 2026-07-15`

- Splits Process, Artist and Contact into separate shader constructions rather than palette variants.
- Removes synthetic pixel grain and raises route sources to 2000px responsive assets.
- Replaces the Works WebGL profile with canvas-free archive illumination and retained hover/focus
  light memory.
- Evolves the dedicated Immersive material bank without replacing its membrane identity.
- Confirms desktop/mobile framing, nonblank canvases, reduced motion, complete route handoffs and the
  two/three/two editorial lifecycle through runtime QA.
