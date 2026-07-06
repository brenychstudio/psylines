# ARTIST STAGE v3 - Top Composition + Inspect Integration Pass 01

## Task
Task V3-06 - Top Composition + Inspect Integration Correction.

## Goal
Stabilize the upper `/works/mt-3` scene after Cinematic Inspect Reveal so the normal state and inspect state read as one spatial system.

This pass is explicitly not AR/XR work.

## Source Systems
- Cinematic Inspect Reveal
- Spatial Memory Depth
- Spatial Editions Field
- Content-Aware Atmosphere

## Changed Files
- `src/pages/works/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/components/commerce/InteriorPreviewPanel.astro`
- `docs/project-brief.md`
- `docs/artist-stage-v3-top-composition-inspect-integration-pass-01.md`

## Preserved
- `src/pages/api/checkout.ts`
- `src/data/commerce/catalog.ts`
- `src/data/site/works.ts`
- `src/lib/living-atmosphere/*`
- `src/components/living-atmosphere/*`
- `src/pages/immersive/*`
- `src/xr-core/*`
- `src/xr-experiences/*`
- Checkout request behavior and `data-buy-now`.
- Size selection hooks and inspect open/close behavior.

## Normal State Changes
- Increased artwork physical presence while keeping the work visible in the first desktop viewport.
- Enlarged the object plane and tightened the scene width to `1660px` max.
- Shifted the glow from broad page atmosphere toward local artwork aura and floor shadow.
- Removed the visible rectangular card edge from the object surface.
- Strengthened artwork shadow, contact depth, contrast, and local hover lift.

## Collector Rail Changes
- Increased rail max width to `590px`.
- Increased title and statement scale by roughly the intended 5-10% range.
- Strengthened price and format readouts.
- Made action buttons more tactile with stronger height, line, and shadow treatment.
- Kept collector text compact; no long table/card treatment was restored.

## Inspect Integration Changes
- Increased the desktop inspect shell to `1760 x 940`.
- Increased selected `30x40` inspect artwork to `520 x 693`.
- Removed the hard desktop modal frame:
  - transparent desktop shell
  - soft radial reveal field
  - no heavy full-screen blur
  - base scene remains visible as a memory layer
- Kept mobile and tablet shell guardrails because they protect readability and overflow.
- Preserved close and return controls.

## Added Structural Hooks
- `data-object-artwork-stage`
- `data-object-physical-plane`
- `data-collector-rail`
- `data-collector-route`
- `data-collector-actions`
- `data-inspect-spatial-layer`
- `data-inspect-wall-field`

## QA
Build:

```txt
npm run build
```

Result: pass.

Dev server:

```txt
npm run dev -- --host 127.0.0.1 --port 4324 --force
```

Headless browser QA:

```txt
/works/mt-3 desktop 2048 normal: no horizontal overflow
/works/mt-3 desktop 2048 inspect: no horizontal overflow
/works/mt-3 tablet 768 normal: no horizontal overflow
/works/mt-3 tablet 768 inspect: no horizontal overflow
/works/mt-3 mobile 390 normal: no horizontal overflow
/works/mt-3 mobile 390 inspect: no horizontal overflow
/works/figure-in-ash-light desktop 2048 normal: no horizontal overflow
```

Key measured states:

```txt
MT-3 desktop normal artwork: 525 x 788
MT-3 desktop normal rail: 590 x 819
MT-3 desktop inspect shell: 1760 x 940
MT-3 desktop inspect artwork: 520 x 693
MT-3 inspect ratio for selected 30x40: 30 / 40
MT-3 inspect chamber state: inspecting
MT-3 mobile 390 inspect shell: 369 x 792
MT-3 mobile 390 inspect artwork: 208 x 277
```

Hooks verified on `/works/mt-3`:

```txt
data-buy-now
data-size-chip
data-interior-preview-open
data-interior-preview-panel
```

## QA Screenshots
- `screenshots/v3-06-mt3-desktop-normal.png`
- `screenshots/v3-06-mt3-desktop-inspect.png`
- `screenshots/v3-06-mt3-tablet-768-normal.png`
- `screenshots/v3-06-mt3-tablet-768-inspect.png`
- `screenshots/v3-06-mt3-mobile-390-normal.png`
- `screenshots/v3-06-mt3-mobile-390-inspect.png`
- `screenshots/v3-06-figure-desktop-normal.png`

## Remaining Notes
- `/works/figure-in-ash-light` currently behaves as a smoke page without commerce hooks in this QA path.
- AR/XR remains intentionally untouched and should be handled as a later dedicated pass.
- Next decision: whether to move from work-detail composition to Home Living Manifestation Canvas or Works Field rethinking.

## Signal Band Visibility Fix
- After V3-06 review, the three description blocks below the object scene were too faint.
- The signal band now has stronger but still quiet presentation:
  - subtle top/bottom rules
  - low-opacity local background
  - readable title and copy contrast
  - lightweight card surfaces rather than heavy commerce cards
- Desktop signal band is pulled upward so it is visible inside a 2048 x 1152 artwork-page viewport.
- Inspect mode keeps the signal band at `0.88` opacity with a lighter memory-layer filter.
- Follow-up QA:

```txt
Build: pass
/works/mt-3: 200
/works/figure-in-ash-light: 200
Desktop 2048 x 1152 overflow: false
Tablet 768 overflow: false
Mobile 390 overflow: false
Desktop signal band: y=979 to y=1149
```

Additional screenshots:

```txt
screenshots/v3-06-signal-band-restored-normal-2048.png
screenshots/v3-06-signal-band-restored-inspect-2048.png
```
