# ARTIST STAGE V3 - Home Living Overture Checkpoint

Date: 2026-07-14

Status: implemented / living-field calibration revised / preserve as the new Home baseline

## Audit Finding

The previous Home had strong artwork switching and a useful cinematic focus state, but its atmosphere
was mostly generic CSS gradients. The lower editorial field was `520rem` tall, leaving long empty
intervals between works. The first viewport also spent too much vertical space before establishing a
strong ARTIST STAGE identity.

Useful systems retained:

- data-driven selected works and canonical `/works/[slug]` routes;
- active artwork switching, orbit traces, wheel/keyboard navigation, and ghosted image handoff;
- artwork atmosphere profiles and route handoff memory;
- the living editorial copy sequence and cinematic focus dialog;
- the global Presence Director and its repeating dream acts.

## New Concept

Home is now the living overture for the whole site.

```txt
ARTIST STAGE identity
-> active manifestation
-> painting becomes environment
-> selected works form authored chapters
-> work / series / immersive routes continue the same field
```

The page does not copy the Immersive scene. It uses a separate palimpsest field: the active painting
and the previous painting become current material and memory. Broad pigment strata move behind the
crisp artwork surfaces while the global stillness system changes pressure and visibility.

## Implemented

- Added a full-viewport Three.js `HomePrologueField` built only from real project artworks.
- Uses responsive 2000px WebP textures with trilinear mip filtering.
- Keeps two textures at rest and temporarily uses a third during a 5.2-second masked material handoff.
- Disposes the outgoing memory texture after each handoff.
- Hero selection and lower-field scroll dominance both update the WebGL material source.
- Pointer input produces only a broad global lean, without a local cursor dent.
- Presence phases and dream acts continue changing the field during inactivity.
- Rebuilt the first viewport around the literal `ARTIST STAGE` identity and kept the conceptual thesis
  as supporting copy.
- Removed the instructional scroll hint and retained `Next` as a clear authored command.
- Added a compact field register and chapter marker without turning the page into a dashboard.
- Reduced the lower scene from `520rem` to `344rem` and rewrote the spatial positions as denser,
  overlapping chapters.
- Replaced dominant decorative radial atmosphere blobs with directional material veils.
- Updated the lower copy sequence so it reads as one progression from pigment to living archive.
- Moved the focus dialog into `document.body` through a React portal, preventing deep-scroll idle
  transforms from displacing fixed dialog geometry.
- Added a dedicated mobile focus animation and stable image/copy spacing.

## Living-Field Calibration Revision

The first overture pass exposed three problems during author review: the material background read as a
large static crop, orbit works disappeared into similar pigment, and the lower route covered the fixed
canvas with a dark layer approaching `0.94` opacity.

The revised field now:

- runs a visibly autonomous material current with broad refraction, memory apertures, moving light
  fronts, slow crop migration, and restrained chromatic separation;
- responds to scroll speed and direction with a short energy impulse, then returns to autonomous
  breathing instead of freezing;
- keeps pointer response as a broad field lean and never creates a cursor-local distortion point;
- gives active and orbit works soft non-rectangular quiet pockets, stronger edge separation, and a
  readable minimum depth hierarchy against related pigment;
- shows only the immediate previous and next works in the mobile Hero orbit;
- replaces the near-black lower veil with an asymmetric exposure corridor: quieter beneath copy,
  clearer between and around artwork surfaces;
- lets the lower editorial route control the WebGL target only while that scene is entering or inside
  the viewport;
- restores the actual active Hero work when the visitor scrolls back above the editorial route;
- reveals the canvas as soon as the current texture is ready while loading material memory
  independently;
- keeps the fallback alive with a slow drift while WebGL or its first texture is unavailable.

## Cinematic Continuity Revision

The approved Hero composition remains the visual baseline. The refinement is deliberately limited to
transition timing and the lower editorial route:

- texture handoffs now use a 5.2-second smootherstep curve, a broad irregular dissolve, restrained
  opposing material shear, and a temporary pigment edge that disappears exactly at rest;
- lower-field target changes use a short 320ms dwell, preventing incidental scroll crossings from
  starting unnecessary WebGL handoffs while preserving the latest authored target;
- the former solid gray-green section overlay and border were removed;
- a 38rem crossfade bridge continues the exact outgoing Hero exposure into the editorial field, then
  dissolves without a horizontal section seam;
- the lower route uses a viewport-sized sticky key light that follows the dominant artwork axis and
  inherits the smoothly interpolated artwork atmosphere palette;
- an opposing negative-fill field, copy quiet pocket, and slow autonomous light drift create changing
  dark/light zones without hiding the real artwork-derived WebGL surface;
- artwork surfaces now have focus-dependent edge veils, local key reflection, shadow depth, and glow;
  the active work reads cleanly while peripheral works retain material presence in half-light;
- cinematic route images remain filter-neutral under the global image-stability contract, so exposure
  is staged with wrapper light and veil layers rather than destructive image filters.

## QA Gate

- Desktop checked at 1440x900 and 2048x1024.
- Tablet geometry checked at 768x1024.
- Mobile checked at 390x844.
- No horizontal overflow at tested viewports.
- The next authored act remains visible at the bottom of the first viewport.
- Canvas dimensions match the visible route area and pixel samples are nonblank and varied.
- Time-separated canvas samples change without pointer or scroll input.
- A complete texture handoff remains continuously transitioning through its middle frames and settles
  after 5.2 seconds with two resident textures.
- The Hero-to-editorial boundary has no border, opaque section background, or abrupt gray exposure cut.
- Lower-field key-light position and strength follow the dominant work while peripheral image veils
  remain visibly stronger than the active artwork veil.
- Hero selection completes with two resident textures after the temporary third texture is released.
- Deep-scroll field synchronization settles on the current dominant work with two resident textures.
- Returning above the editorial threshold restores the current Hero target instead of a hidden lower
  route target.
- Hero orbit covers retain readable separation on related red, green, and ochre backgrounds.
- Mobile Hero uses semantic `-1` and `1` orbit slots and has no horizontal overflow at 390x844.
- `Next` lands the second act at the top of the viewport.
- Mobile and deep-desktop focus dialogs remain inside the viewport without text/image overlap.
- Route smoke passes for `/`, `/immersive`, `/works`, `/series`, and `/process`.
- Browser console has no application errors; headless Chrome reports only its software-WebGL warning.
- `npm run build` passes.

## Guardrails

Do not:

- replace the field with generated or external imagery;
- reconstruct procedural bodies or silhouettes;
- return the main title to a generic portfolio statement;
- restore the `520rem` sparse lower route;
- preload every Home painting as a simultaneous GPU texture;
- add a cursor-local distortion point;
- mount the focus dialog back inside a transformed living section;
- make the background equally bright beneath the lower artwork chapters;
- restore a solid lower-section overlay, border, or other horizontal seam after the Hero;
- shorten the 5.2-second handoff back into a fast digital crossfade;
- apply direct filters to cinematic route images instead of staging exposure around them;
- cover the lower route with a near-opaque dark surface that makes the fixed field look static;
- reduce orbit covers to trace opacity without restoring their local quiet pockets;
- let an offscreen lower scene overwrite the active Hero material target.

## Relevant Files

- `src/pages/index.astro`
- `src/components/home/HomePrologueField.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`
- `src/components/cinematic/CinematicIdleField.astro`
- `docs/artist-stage-v3-current-development-handoff.md`
- `docs/living-background-environment-universal-tool.md`
- `docs/living-background-environment-universal-tool.html`
- `docs/living-background-environment-universal-tool.pdf`
