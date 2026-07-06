# ARTIST STAGE v3 - Work Detail Pass 01 Source

## Source
Imported from the user-provided file:

`C:\Users\CONCEPT2048\Downloads\artist-stage-v3-work-detail-pass-01.md`

This document is treated as the execution source for the first ARTIST STAGE v3 work detail pass.

## Target
Primary route:

```txt
/works/mt-3
```

Secondary route:

```txt
/works/figure-in-ash-light
```

## Pass Name
```txt
Object Chamber v3 - Spatial Artwork + Cinematic Inspect Foundation
```

## Goal
Create a visible qualitative jump on the work detail page without changing checkout, commerce data, XR, or route structure.

The page should feel less like a dark product template and more like a collector-facing object chamber.

Current visual reading:

```txt
image card + product panel
```

Target visual reading:

```txt
object chamber + collector instrument + inspect mode
```

## Files Allowed In This Pass
Edit:

```txt
src/pages/works/[slug].astro
src/components/works/ObjectChamberHero.astro
src/components/commerce/CollectorAcquisitionPanel.astro
src/components/commerce/InteriorPreviewPanel.astro
```

Do not edit:

```txt
src/pages/api/checkout.ts
src/data/commerce/catalog.ts
src/lib/living-atmosphere/*
src/components/living-atmosphere/*
src/pages/immersive/*
src/xr-core/*
src/xr-experiences/*
```

## State Vocabulary
Internal states only:

```txt
latent
awake
focused
inspecting
collector
returning
```

Do not expose these names in UI.

## Required Implementation Notes
Object chamber root:

```astro
<section class="object-chamber-v3" data-object-chamber-state="awake">
  ...
</section>
```

If adding a wrapper risks layout breakage, apply the class and state attribute to the existing hero wrapper.

Spatial artwork surface:

```astro
<figure class="spatial-artwork-surface" data-spatial-artwork>
  <div class="spatial-artwork-surface__aura"></div>
  <div class="spatial-artwork-surface__plane">
    <img ... />
  </div>
  <figcaption class="spatial-artwork-surface__label">
    Object surface
  </figcaption>
</figure>
```

Rules:

```txt
- no aggressive crop
- no random hover zoom
- no white frame unless deliberate
- keep image ratio stable
- image must feel like plane/object, not thumbnail
```

Collector panel:

```txt
- preserve all data hooks
- make title area breathe
- group purchase data instead of stacking FAQ rows
- size chips should feel like edition signals
- Buy now remains primary
- Preview in interior opens inspect mode
- trust links remain quiet
```

Interior Preview:

```txt
- keep hidden panel and hooks
- keep close and Continue/Return action
- shift visual language from inserted panel to chamber-like inspect surface
- do not make it full-screen in pass 01
- do not add real AR
```

Optional shell state:

```js
const objectChamber = document.querySelector("[data-object-chamber-state]");

interiorPreviewOpen?.addEventListener("click", () => {
  objectChamber?.setAttribute("data-object-chamber-state", "inspecting");
});

interiorPreviewClose?.addEventListener("click", () => {
  objectChamber?.setAttribute("data-object-chamber-state", "awake");
});
```

## Local Atmosphere Rules
Do not change the Living Atmosphere Engine in pass 01.

Use local CSS variables/classes only:

```css
.object-chamber-v3 {
  --object-accent: rgba(150, 195, 98, 0.16);
  --object-glow: rgba(120, 165, 80, 0.12);
  --object-shadow: rgba(5, 18, 8, 0.45);
}
```

Apply only to:

```txt
artwork aura
panel border
inspect chamber wall
focus line
```

Do not tint all text or the whole page.

## QA
Run:

```powershell
npm run build
npm run dev -- --force
```

Check:

```txt
/works/mt-3 opens
size chips update metadata
Preview in interior opens/closes
Escape closes preview
Buy now still opens Stripe test checkout
Adjacent manifestations still render
mobile no overflow
```

Screenshot checks:

```txt
/works/mt-3 desktop
/works/mt-3 with preview open
/works/mt-3 mobile 390px
/works/figure-in-ash-light desktop
```

## Acceptance
The pass is accepted only if the visual change is obvious:

```txt
- page no longer looks like a generic dark product page
- artwork feels like an object surface
- collector panel feels like an instrument, not a card
- interior preview begins to feel like cinematic inspect mode
- existing checkout and metadata behavior is preserved
- build passes
```

