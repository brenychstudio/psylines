# ARTIST STAGE v3 - Work Detail Collector / AR Completion

Date: 2026-07-06

## Goal

Bring `/works/[slug]` closer to the canonical collector/product route promised by the V3 UX architecture.

Series remains chapter/context. Work Detail is where the object becomes collectable: original, edition, inquiry, scale, method, and AR/3D preview.

## Current Status

Implemented:

- collector acquisition panel;
- available/inquiry states;
- format switching for selected works;
- price/selected format display;
- acquire/inquire CTAs;
- Stripe checkout hooks;
- collector details reveal;
- process-aware object metadata;
- surface lens / magnifier;
- scale preview;
- AR / 3D print preview overlay;
- frame material controls inside AR preview;
- return bridges to Series chapter, Works index, and Process route.

## AR / 3D Integration

The print AR module was integrated from the provided ZIP source packages.

Relevant files:

- `src/modules/print-ar/`
- `src/features/print-ar-host/`
- `src/pages/works/[slug].astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`

Current behavior:

- `AR preview` opens an in-site 3D/framed scale field.
- The user can switch frame material variants.
- The overlay is styled closer to ARTIST STAGE: dark field, quiet typography, thin rules, reduced widget-like controls.
- Mobile AR bridge logic exists in the module structure, but production mobile AR requires hosted GLB/USDZ assets and device QA.

## Surface Lens

The artwork image now supports a surface-inspection lens.

Intent:

```txt
The user should feel they can inspect paper, charcoal, pressure, and surface traces without leaving the object page.
```

Current state:

- lens can be activated from Work Detail;
- it follows the artwork surface;
- the zoom level was reduced from the first test so it feels less aggressive;
- decorative crosshair/reticle language was removed;
- bright glass-like glare was reduced.

## Collector Details

Collector details should not use an internal scrollbar. The preferred direction is a cinematic expansion/reveal that stays part of the object route and can be collapsed again.

Current goal:

```txt
Reveal key acquisition facts without making the panel feel like an embedded admin table.
```

## Not Final

- AR material realism is still prototype quality.
- Frame depth, paper texture, mat, glass/reflection, wall lighting, and scale need a dedicated art-direction pass.
- Mobile AR needs real hosted asset validation.
- Production checkout, legal policy, availability, and edition data still need final review.

## Do Not Break

- Keep `/works/[slug]` as the collector/object route.
- Do not put commerce controls into the Series inspector.
- Do not remove `View work` from the Series inspector.
- Do not replace the image-led object chamber with a generic product grid.
