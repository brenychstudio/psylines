# ARTIST STAGE v3 - Development Roadmap

Last updated: 2026-07-15
Current phase: Phase 4, Route Environment Direction
Project status: advanced cinematic art-direction beta, not production-ready

## 1. Roadmap Principle

ARTIST STAGE is developed as one connected artwork system, not as independent pages. A phase is
complete only when its route logic, atmosphere, interaction, fallback and responsive behavior work
together.

Status language:

```txt
COMPLETE     implemented and accepted as the current baseline
IN PROGRESS  direction approved, further art direction or engineering remains
PENDING      planned but not yet implemented to the required level
BLOCKED      cannot proceed without external content, credentials or device access
```

## 2. Phase Overview

| Phase | Scope | Status | Result / exit condition |
| --- | --- | --- | --- |
| 0 | Concept, route architecture, data model | COMPLETE | Connected artwork, series and collector route system exists |
| 1 | Global shell and canonical navigation | COMPLETE | Shared header/frame, route hierarchy and scroll return behavior |
| 2 | Core cinematic routes | COMPLETE | Home, Series, Works, Work Detail, Artist, Process, Contact and Immersive are implemented |
| 3 | Living systems foundation | COMPLETE | LBE, Presence Director, route memory and cinematic transitions are integrated |
| 4 | Route-specific environment direction | IN PROGRESS | Every major route has a distinct, high-quality atmosphere rather than a copied Home effect |
| 5 | Authentic content and artwork metadata | IN PROGRESS | Real process material and final author-approved records replace prototypes |
| 6 | Collector, AR and commerce completion | IN PROGRESS | Production assets, realistic preview and approved sales flow |
| 7 | Production hardening and launch | PENDING | Device QA, performance budgets, accessibility, deployment and monitoring |

## 3. Completed Foundation

### Phase 0 - Concept and architecture

- Canonical route distinction is established: Series is context and cinematic viewing; Work Detail
  is the object and collector route.
- Artwork, series, relations, commerce and process content models exist.
- Responsive artwork derivatives and canonical slugs are implemented.
- The project uses Astro server output with React islands and Three.js where the experience benefits
  from it.

### Phase 1 - Shell and navigation

- Main route order is stable: Home, Series, Works, Immersive, Artist, Process, Contact.
- Public pages share a calibrated frame and header axis.
- Long routes have a shared `Top` return gesture.
- Route transitions preserve artwork identity and selected context.

### Phase 2 - Core route system

- Home living overture and selected manifestations field.
- Series WebGL constellation map.
- Series chapter, carousel and fullscreen inspector.
- Works Index and Field archive modes.
- Work Detail collector/object page with lens, formats and acquisition hierarchy.
- Artist, Process and Contact editorial routes.
- Immersive threshold and WebXR entry route.
- Collector and policy support routes.

### Phase 3 - Living systems

- Living Background Environment with current, memory and temporary incoming texture lifecycle.
- Site-wide Presence Director with awake, settling, contemplating, dreaming and waking phases.
- Continuing deep-idle acts: gathering, dispersing and reforming.
- Route atmosphere memory and section-state adapters.
- Cinematic route cover handoff and browser-return restoration.
- Reduced-motion and non-WebGL fallback foundations.

## 4. Current Priority - Phase 4

Goal: complete the route-specific background language without turning the site into repeated versions
of Home.

### 4.1 Process

Status: IN PROGRESS
Current baseline: trace field, softened pigment and diagonal raking work light.

Next work:

- refine depth, light falloff and transitions across lower sections;
- replace prototype artwork sources with real sketches, charcoal starts, fixed traces, notes and
  material tests when supplied;
- make each process chapter reveal a different stage of making rather than only a different crop;
- test long idle and wake behavior against tables and method copy;
- complete physical mobile and low-power GPU review.

### 4.2 Artist

Status: IN PROGRESS
Current baseline: dissolved current/memory planes and warm/cool palimpsest exposure.

Next work:

- improve the spatial separation between biography, statement and practice sections;
- make memory layers less rectangular and more editorially timed;
- develop a stronger light arc through the long route;
- preserve copy quiet zones without flattening the background;
- verify that foreground artwork never merges into its own environment.

### 4.3 Contact

Status: IN PROGRESS
Current baseline: near-black signal chamber with crossing pigment corridors.

Next work:

- refine the signal path from headline to direct email and final work route;
- preserve the route's quietness while adding more controlled depth;
- verify contrast throughout Presence phases and on OLED/mobile displays;
- keep motion subordinate to communication and accessibility.

### 4.4 Works

Status: IN PROGRESS
Current baseline: clean archive illumination without full-screen artwork WebGL.

Next work:

- continue the broad museum-light direction, not the rejected duplicated painting background;
- improve Field-mode exhibition pacing and retained light memory;
- tune filter/register behavior and mobile scanning;
- test 50-100 artwork scale and image-loading budgets;
- keep canonical artwork surfaces filter-neutral and fully comparable.

### 4.5 Immersive

Status: STRONG BASELINE / REVIEW AFTER EDITORIAL ROUTES
Current baseline: approved full-viewport three-channel pigment membrane.

Next work:

- reassess after Process, Artist and Contact reach their next quality checkpoint;
- improve only where the newer route research provides a clear gain;
- retain its distinct pressure/membrane identity and real-artwork-only source policy;
- complete physical-device GPU, thermal and WebXR entry QA.

### Phase 4 exit criteria

- Each route is recognizable from a background-only frame.
- Differences are structural, not palette-only.
- No synthetic grain is used to simulate quality or activity.
- Hero and lower route share one controlled exposure without hard overlay seams.
- Foreground artwork remains crisp and visually dominant.
- Full transitions settle without flashes, flicker or leaked textures.
- Desktop, mobile, reduced motion and long idle pass visual and runtime QA.

## 5. Phase 5 - Authentic Content

Status: IN PROGRESS / partially dependent on author material.

- Final audit of work titles, years, status, series, dimensions, materials and descriptions.
- Replace test/prototype process imagery with authentic studio process assets.
- Final artist statement and public technique language review.
- Confirm selected/flagship/standalone/series taxonomy for every work.
- Complete SEO descriptions, social previews and canonical metadata.
- Confirm rights and publication policy for every image and document.

## 6. Phase 6 - Collector, AR and Commerce

Status: IN PROGRESS / prototype quality.

- Refine frame, paper, mat, glass/reflection, scale and wall-light realism.
- Produce and host final GLB/USDZ assets.
- Validate iOS Quick Look and Android Scene Viewer on physical devices.
- Audit Stripe environment separation and checkout staging.
- Finalize availability, pricing, edition, shipping, return, privacy and terms content.
- Complete collector inquiry and acquisition acceptance testing.

## 7. Phase 7 - Production Hardening

Status: PENDING.

- Define per-route performance budgets and reduce the current large Three/XR bundle.
- Resolve or formally accept Astro dynamic-route warnings.
- Run physical iOS, Android, tablet and low-power desktop QA.
- Complete keyboard, screen-reader, contrast and reduced-motion audit.
- Add error monitoring, analytics consent strategy and deployment runbook.
- Perform security and secret-management review.
- Select hosting, configure environment variables and verify production SSR.
- Run final content freeze, regression suite and launch checklist.

## 8. Immediate Next Sequence

```txt
1. Process background direction pass 02.
2. Artist background direction pass 02.
3. Contact background direction pass 02.
4. Works archive illumination and Field pacing pass 02.
5. Cross-route comparison and route-identity QA.
6. Immersive reassessment using only clearly beneficial findings.
7. Physical-device performance and Presence/idle QA.
8. Authentic process assets and content audit.
9. AR/commerce completion.
10. Production hardening and launch readiness.
```

## 9. Current Guardrails

- Use authentic project artwork only; do not generate substitute paintings or bodies.
- Do not apply one Home shader result across every route.
- Do not restore full-screen artwork WebGL to Works without a new archive-specific reason.
- Keep Series cinematic and image-led; keep Work Detail canonical for collector action.
- Keep Process a public method route, not a document dump or marketing page.
- Keep the Presence Director alive through deep idle without flicker or a frozen terminal state.
- Do not consolidate visual CSS until the route direction is approved and regression screenshots exist.

## 10. Canonical References

- `docs/project-brief.md`
- `docs/artist-stage-v3-current-status-2026-07-15.md`
- `docs/artist-stage-v3-current-development-handoff.md`
- `docs/artist-stage-v3-living-background-route-profiles.md`
- `docs/living-background-environment-universal-tool.md`
- `docs/artist-stage-v3-presence-director-metamorphosis.md`
- `docs/artist-stage-v3-series-route-continuity.md`
