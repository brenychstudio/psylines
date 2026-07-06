# ARTIST STAGE - Current Project Brief

Last updated: 2026-07-06

## Purpose

This file is the high-level orientation document for ARTIST STAGE v3. Read it before changing visual direction, route architecture, collector logic, AR/3D preview behavior, or public process language.

## Current State

ARTIST STAGE is an advanced cinematic artist-site prototype with a connected artwork route system:

```txt
Home Living Field
-> Series WebGL Constellation Field
-> Series Cinematic Chapter
-> Fullscreen Photo Inspector
-> Work Detail / Collector Object Route
-> Process / Technique Route
-> Contact / Collectors
```

The project is no longer a conventional portfolio, product grid, or static gallery. The active direction is a living cinematic artwork system where context and acquisition are deliberately separated:

- `Home` introduces the selected manifestations field.
- `Series` provides spatial chapter/context browsing.
- `Series detail` provides immersive viewing inside a chapter.
- `Works` and `Work Detail` remain the canonical database/object/acquisition layer.
- `Process` explains the Body Manifestation Process and supports Artist, Series, Work Detail, COA, and collector language.
- `Contact` and `Collectors` support direct studio routes and collector-facing handoff.

## Active Status

```txt
Core visual system: advanced cinematic prototype / demo-ready for art-direction review
Core route architecture: implemented
Home living field: implemented and motion-polished
Series constellation map: implemented with WebGL atmosphere integration
Series chapter + inspector: implemented and stabilized
Work Detail collector route: implemented as strong object/acquisition surface
Process route: implemented from studio technique documentation
AR / 3D scale preview: integrated prototype, not final production AR asset pipeline
Commerce: present, not final live-sales approved
Content metadata: partially authored, final author audit still needed
```

## Primary Routes

```txt
/
/series
/series/[slug]
/works
/works?series=meta-bodies
/works?series=night-water
/works?series=studies
/works?register=selected
/works/[slug]
/process
/artist
/contact
/collectors
```

Secondary and experimental routes remain in the project, but they are outside the current public/demo perimeter:

```txt
/prints
/prints/[slug]
/collectors/works/[slug]
/collectors/prints/[slug]
/exhibitions
/exhibitions/[slug]
/immersive
/immersive/experience
```

## Canonical UX Rules

```txt
Series = context, chapter, atmosphere, image sequence.
Work Detail = object record, acquisition, print/original, collector action.
Process = public method/technique explanation, not a product page.
```

Therefore:

- clicking a work image in a Series chapter opens the fullscreen inspector first;
- the inspector stays image-first and cinematic;
- `View work` is the explicit bridge into `/works/[slug]`;
- `/works/[slug]` is the single source of truth for collector action, formats, price, inquiry, AR/scale preview, method, and object metadata;
- `/process` should remain concise, public, and cinematic rather than becoming a PDF dump.

## Recently Implemented

- Shared `Top` return gesture for long cinematic pages.
- Header/frame alignment across Home, Works, Artist, Contact, Process, and the main public routes.
- Home selected manifestations upgraded with smoother carousel motion, floating works, hover/click activation of background works, and a `Next` gesture into the next section.
- `/series` upgraded from a static constellation into a WebGL-backed atmosphere field with tone-aware and motion-aware background behavior.
- `/series` route entry stabilized so black placeholder cover flashes no longer appear during navigation.
- `/series/[slug]` fullscreen inspector stabilized and synchronized so closing the inspector leaves the carousel on the last viewed image.
- `/works/[slug]` upgraded into a strong collector/product route with format switching, acquisition/inquiry hierarchy, collector details, scale preview, AR preview, and process-aware metadata.
- Print AR / 3D preview module integrated from the provided ZIP modules and adapted into the site's visual language.
- Artwork surface lens/magnifier introduced on Work Detail for close surface inspection.
- Collector details reveal reworked away from internal scrollbars toward a cleaner cinematic expansion pattern.
- `/process` created from the studio source PDF on technique and process.
- Process route received a stillness/idle cinematic behavior: content gradually recedes during inactivity and returns on user activity.

## Living Systems

Implemented:

```txt
Living atmosphere boot
Living atmosphere orchestrator
Artwork atmosphere bridge
Route atmosphere handoff memory
Section atmosphere state
Stillness / idle presence behavior
Home living editorial field
Home cinematic carousel motion
Series WebGL atmosphere backdrop
Series constellation field
Series chapter atmosphere
Fullscreen series photo inspector
Cinematic route transition manager
Explicit cinematic source selector for inspector -> work transitions
Responsive generated artwork assets
Body Manifestation Process content model
Process / Technique route
Work Detail collector/product route
Print AR / 3D preview host
Shared scroll-top route support
```

Not final:

```txt
Final dominant-color extraction pipeline
Final realistic AR frame/material art direction
Production GLB/USDZ asset generation and hosting QA
Live mobile AR Quick Look / Android Scene Viewer validation
Sound / spatial audio
Final content author review
Final performance QA across low-powered hardware
```

## Commerce State

Present:

```txt
Stripe checkout endpoint
Commerce catalog for selected works
Format/price switching
Collector route panel
Inquiry / acquire CTAs
Process-aware method / reference / layer language
Interior scale preview foundation
AR / 3D preview prototype
Policy and collector support links
Success/cancel route feedback
```

Not launch-final:

```txt
Production Stripe separation audit
Hosted checkout staging verification
Legal/policy final review
Live sales approval
Production mobile AR asset pipeline
Final metadata and edition audit for all works
```

## Known Warnings

`npm run build` passes.

Known non-blocking warnings:

- Astro dynamic `getStaticPaths()` warnings in server output mode.
- Vite large chunk warning, likely related to immersive/Three/XR/AR dependencies.

## Current Watch Items

- The WebGL Series background is visually promising but still needs final art-direction tuning so it supports artworks without overpowering them.
- AR/3D preview works as an integrated prototype, but frame/material realism still needs a dedicated visual-quality pass.
- Mobile AR requires production GLB/USDZ hosting, validation, and device QA.
- Home motion is stronger now, but final mobile tuning should be repeated.
- Work metadata supports process/reference/layer fields, but all values need final author verification.
- Commerce exists, but final sales/legal/staging checks are still required before live use.
- CSS has accumulated pass-specific visual layers; consolidate only after art direction is approved.

## Next Recommended Sequence

```txt
1. Visual QA of Home -> Series -> Series Chapter -> Inspector -> Work flow.
2. Art-direction pass for Series WebGL atmosphere: color sync, density, performance, and artwork integration.
3. AR/3D material realism pass: frame depth, paper surface, glass/reflection, lighting, and scale.
4. Mobile/tablet QA for Home field, Series map, Series chapter inspector, Work Detail, and AR overlay.
5. Final author review of titles, statements, years, status, series placement, paper, material, technique fields.
6. Commerce readiness audit: Stripe, policies, legal copy, availability, inquiry/acquire flow.
7. Documentation cleanup / CSS consolidation after visual direction is locked.
```

## Working Rule

Do not collapse Series into commerce UI. Keep Series immersive and image-led. Use `View work` to move from cinematic viewing into the canonical Work Detail collector route.
