# ARTIST STAGE v3 - Cinematic Inspect Reveal Pass 01

## Goal
Convert `Preview in interior` into a cinematic inspect-mode foundation instead of an inline collector rail panel.

## Source Systems
- Cinematic Inspect Reveal
- Spatial Editions Field
- Content-Aware Atmosphere

## Changed Files
- `src/pages/works/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/components/commerce/InteriorPreviewPanel.astro`
- `docs/project-brief.md`
- `docs/artist-stage-v3-inspect-reveal-pass-01.md`

## Changed
- Moved `InteriorPreviewPanel` out of `CollectorAcquisitionPanel`.
- Rendered `InteriorPreviewPanel` once at work-detail page level, directly after the object chamber.
- Added `data-object-chamber` to the object chamber root while preserving `data-object-chamber-state`.
- Updated inspect open/close logic:
  - opening sets `data-open="true"`
  - chamber state becomes `inspecting`
  - chamber receives `is-inspecting`
  - document root receives `is-object-inspecting`
  - Return button and Escape close the inspect layer
- Rebuilt the preview as a fixed inspect reveal layer:
  - optical veil
  - physical shell
  - wall scale field
  - artwork object
  - metadata rail for format, price, and route
- Added Pass 05 CSS for desktop, mobile, and reduced-motion behavior.

## Preserved
- Checkout endpoint and request body.
- Stripe redirect behavior.
- Commerce catalog data.
- Work data.
- XR and immersive routes.
- Living atmosphere engine.
- Critical commerce and preview hooks:
  - `data-buy-now`
  - `data-size-chip`
  - `data-price-display`
  - `data-format-display`
  - `data-interior-preview-open`
  - `data-interior-preview-panel`
  - `data-interior-preview-close`
  - `data-interior-preview-size`
  - `data-interior-preview-price`
  - `data-interior-preview-route`
  - `data-checkout-overlay-copy`

## QA
Build:

```txt
npm run build
```

Result: pass.

Dev server:

```txt
npm run dev -- --host 127.0.0.1 --port 4323 --force
```

Headless QA summary:

```txt
CTA text: Acquire
Default price: EUR 850
Default format: A3 - 29.7 x 42 cm
Preview nested in collector rail: false
Normal desktop overflow: false
30x40 selected price: EUR 220
30x40 selected format: 30 x 40 cm
30x40 preview price: EUR 220
30x40 preview format: 30 x 40 cm
30x40 preview route: Limited edition print
Inspect open state: inspecting
Inspect shell opacity: 1
Return close state: awake
Escape close state: awake
Mobile 390 overflow: false
Figure in Ash Light overflow: false
```

## QA Screenshots
- `screenshots/inspect-reveal-pass-05-mt3-normal-desktop.png`
- `screenshots/inspect-reveal-pass-05-mt3-inspect-open-desktop.png`
- `screenshots/inspect-reveal-pass-05-mt3-inspect-open-mobile-390.png`
- `screenshots/inspect-reveal-pass-05-figure-normal-desktop.png`
- `screenshots/inspect-reveal-pass-05-mt3-after-close-desktop.png`

## Remaining Issues
- The inspect reveal is a strong foundation, but final tuning may still be needed so the shell feels less like a conventional overlay and more like a site-native optical mode.
- Next likely pass: final top composition correction for artwork scale, right rail, and field spacing after inspect mode is accepted.

## Bugfix Notes
- A stale dev-server/HMR state could leave an older preview panel nested inside the transformed collector rail.
- The work-detail script now prefers the page-level inspect panel, removes duplicate preview panels, and defensively moves a preview panel to `body` if it is found inside the object chamber.
- Preview metadata selectors are scoped to the active inspect panel after duplicate cleanup, so size chips update the visible reveal layer.
- The inspect preview image now uses eager loading to avoid a gray placeholder during reveal.
- Verified on `http://127.0.0.1:4322/works/mt-3` after the fix:
  - active preview panel parent is not the object chamber
  - one preview panel remains after duplicate cleanup
  - shell rect is centered in the viewport
  - preview image completes loading
  - horizontal overflow remains false

## Large Adaptive Window Notes
- The inspect shell was enlarged after visual review so the preview mode occupies the central viewport as a major state, not a small overlay.
- Desktop shell target: `width: min(1600px, viewport-safe width)` and `height: min(900px, viewport-safe height)`.
- Mobile shell remains viewport-safe with a vertical layout and internal max-height guardrails.
- The visible artwork object uses `data-inspect-artwork-object` and the `--inspect-format-ratio` CSS variable.
- The work-detail script parses the active format text, including `30 x 40 cm`, `A3 - 29.7 x 42 cm`, and `90 x 120 cm`, then applies the live ratio to the inspect artwork.
- Latest verification on `http://127.0.0.1:4322/works/mt-3`:
  - selected `30x40` produces CSS ratio `30 / 40`
  - desktop shell is `1600 x 900`
  - desktop overflow is false
  - mobile 390px overflow is false

## Additional QA Screenshots
- `screenshots/inspect-reveal-pass-05-larger-adaptive-mt3-desktop.png`
- `screenshots/inspect-reveal-pass-05-larger-adaptive-mt3-mobile-390.png`

## Pass 07 - Acquisition Hierarchy + Adaptive Inspect Shell

### Goal
Clean the collector acquisition hierarchy and adapt the inspect shell for vertical artworks.

The page should feel closer to a refined art acquisition interface: fewer UI badges, clearer price/format/edition hierarchy, and a portrait-led inspect reveal.

### Reference Direction
- Artsy buyer guidance emphasizes practical collector confidence factors such as medium, size, price expectations, condition, shipping, and documentation.
- Saatchi Art pricing guidance compares work by dimensions, medium, materials, and market context.
- For this page, the useful design translation is: selected format, price, edition/proof/material, and collector support should be clearer than decorative metadata pills.

Sources:
- `https://www.artsy.net/article/artsy-editorial-buying-first-artwork`
- `https://support.saatchiart.com/hc/en-us/articles/14666580850203-How-to-Price-Your-Artwork`

### Changes
- Removed the visible top metadata pill row from the right rail.
- Moved cycle context into the quiet identity kicker.
- Changed the selector label from `Size` to `Format`.
- Changed the readout label from `Format` to `Selected format`.
- Kept price and selected format as the strongest acquisition readouts.
- Reduced proof/material output to one compact line:
  - original: `Original work / signed - certificate included / original surface`
  - print: `Limited edition print / edition of 30 - signed - certificate / pigment print / archival paper`
- Moved secondary production/shipping/returns into one collapsed `Collector details` block.
- Changed visible CTA labels:
  - `Acquire selected work`
  - `Interior scale preview`
- Added `data-inspect-orientation` to the inspect layer.
- Set these works to portrait inspect orientation.
- Rebuilt portrait inspect sizing so the shell follows the vertical object instead of stretching across the viewport.
- Increased inspect shell opacity and wall-field contrast.
- Restyled the lower signal band into compact text columns without card blocks.

### Preserved
- Stripe checkout logic.
- Checkout request body.
- Commerce catalog data.
- Work data.
- AR/XR and immersive files.
- Living atmosphere files.
- Critical hooks:
  - `data-size-chip`
  - `data-size-label`
  - `data-size-dimensions`
  - `data-size-price`
  - `data-size-type-label`
  - `data-size-proof-line`
  - `data-size-material-line`
  - `data-size-production-time`
  - `data-size-return-window`
  - `data-size-shipping-note`
  - `data-price-display`
  - `data-format-display`
  - `data-type-display`
  - `data-proof-display`
  - `data-material-display`
  - `data-return-display`
  - `data-production-display`
  - `data-shipping-display`
  - `data-buy-now`
  - `data-interior-preview-open`
  - `data-interior-preview-panel`
  - `data-interior-preview-close`
  - `data-interior-preview-size`
  - `data-interior-preview-price`
  - `data-interior-preview-route`
  - `data-checkout-overlay-copy`

### Still Not Implemented
- Real AR.
- Phone handoff.
- WebXR.
- Production AR assets.
- Dynamic image analysis for inspect orientation.

### QA
Build:

```txt
npm run build
```

Result: pass.

Headless QA on `http://127.0.0.1:4324`:

```txt
/works/mt-3 desktop overflow: false
/works/mt-3 mobile 390 overflow: false
/works/mt-3 tablet 768 overflow: false
/works/figure-in-ash-light desktop overflow: false
/works overflow: false
Top metadata chips visible: false
70x100 selected: EUR 620 / 70 x 100 cm
30x40 selected: EUR 220 / 30 x 40 cm
Original selected: EUR 850 / A3
Inspect orientation: portrait
Desktop inspect shell: 1059 x 860
Desktop inspect artwork: 363 x 518
Mobile inspect shell: 363 x 823
Tablet inspect shell: 540 x 830
Escape closes inspect: true
```

### QA Screenshots
- `screenshots/v3-07-mt3-normal-desktop.png`
- `screenshots/v3-07-mt3-inspect-desktop.png`
- `screenshots/v3-07-mt3-mobile-390.png`
- `screenshots/v3-07-mt3-inspect-mobile-390.png`
- `screenshots/v3-07-figure-ash-desktop.png`

## Pass 07 Follow-up - Larger Interior Scale Preview

### Reason
The first portrait-adaptive inspect shell fixed the overly wide modal feeling, but the `Interior scale preview` still read too small. The follow-up increases the shell and the artwork object while keeping the preview portrait-led and viewport-safe.

### Changes
- Increased portrait inspect shell from about `1059 x 860` to about `1240 x 940` on 2048 x 1152 desktop.
- Increased selected `70x100` artwork preview from about `363 x 518` to about `465 x 664` on desktop.
- Increased tablet/mobile shell and artwork limits:
  - tablet shell: about `620 x 894`
  - tablet artwork: about `280 x 400`
  - mobile 390 shell: about `363 x 823`
  - mobile 390 artwork: about `221 x 316`
- Increased portrait wall-field height so the larger work keeps visual breathing room.
- Raised inspect layer stacking to `z-index: 130` so the fixed site nav remains underneath the inspect layer.

### QA
Build:

```txt
npm run build
```

Result: pass.

Headless QA on fresh dev server `http://127.0.0.1:4326`:

```txt
/works/mt-3 desktop overflow: false
/works/mt-3 tablet 768 overflow: false
/works/mt-3 mobile 390 overflow: false
Inspect opens: true
Escape closes inspect: true
Inspect layer z-index: 130
Site nav z-index: 30
Critical hooks present: true
```

### QA Screenshots
- `screenshots/v3-07-interior-scale-larger-desktop.png`
- `screenshots/v3-07-interior-scale-larger-tablet-768.png`
- `screenshots/v3-07-interior-scale-larger-mobile-390.png`

## Pass 08 - Floating Annotation + Full-Field Inspect Stage

### Goal
Remove the remaining panel/modal feeling and move the work detail page toward artwork field + floating acquisition annotation + full-field inspect stage.

### Changed Files
- `src/pages/works/[slug].astro`
- `src/components/works/ObjectChamberHero.astro`
- `src/components/commerce/CollectorAcquisitionPanel.astro`
- `src/components/commerce/InteriorPreviewPanel.astro`
- `src/components/commerce/EditionProofCards.astro`
- `src/components/works/AdjacentManifestations.astro`
- `docs/project-brief.md`
- `docs/artist-stage-v3-inspect-reveal-pass-01.md`

### What Improved
- The acquisition rail now reads as a floating annotation rather than a boxed product panel.
- The inspect layer now occupies the viewport as a spatial field, with the base scene preserved as a dim memory layer.
- Preview artwork is larger, portrait-aware, and no longer leaves a blank lower object area.
- Lower Material / Cycle / Edition Route content now behaves as a quiet signal band instead of three cards.
- Adjacent works are presented as trace-strip continuations with aligned image rhythm.
- The normal state and inspect state now share the same object-field language.

### Preserved
- Checkout API and Stripe request body.
- Commerce catalog data and work data.
- Living atmosphere files.
- Immersive routes and XR files.
- Critical hooks:
  - `data-size-chip`
  - `data-price-display`
  - `data-format-display`
  - `data-buy-now`
  - `data-interior-preview-open`
  - `data-interior-preview-panel`
  - `data-interior-preview-close`
  - `data-interior-preview-size`
  - `data-interior-preview-price`
  - `data-interior-preview-route`
  - `data-checkout-overlay-copy`

### Remaining Issues
- Final visual judgment still needs human screenshot review, especially how much the floating annotation should visually enter the artwork field.
- The inspect stage is intentionally not AR; future Collector Room / AR work should remain a separate pass.

### Not Implemented
- Real AR.
- WebXR.
- Sound.
- Collector Room.
- New routes.

### QA
Build:

```txt
npm run build
```

Result: pass.

Fresh dev server:

```txt
http://127.0.0.1:4332
```

Headless QA summary:

```txt
/works/mt-3 desktop overflow: false
/works/mt-3 tablet 768 overflow: false
/works/mt-3 mobile 390 overflow: false
/works/figure-in-ash-light desktop overflow: false
/works overflow: false
70x100 main state: EUR 620 / 70 x 100 cm
70x100 inspect state: EUR 620 / 70 x 100 cm / Limited edition print
Inspect opens: true
Escape closes inspect: true
Critical hooks present: true
```

### QA Screenshots
- `screenshots/v3-08-mt3-normal-desktop.png`
- `screenshots/v3-08-mt3-inspect-desktop.png`
- `screenshots/v3-08-mt3-mobile-390.png`
- `screenshots/v3-08-mt3-inspect-mobile-390.png`
- `screenshots/v3-08-figure-ash-desktop.png`
- `screenshots/v3-08-lower-traces.png`

## Pass 09 - Artwork Presence + Option-Aware Scale Preview

### Goal
Improve artwork physical presence in the normal state and make preview styling react to Original vs Print options.

### Changed
- Added a new CSS layer in `src/pages/works/[slug].astro`:
  - `V3 Object Field - Pass 09: Artwork Presence + Option-Aware Scale Preview`
- Strengthened physical artwork presence with a more focused aura, deeper floor shadow, and richer image shadow.
- Made `Object surface` read as a quiet annotation instead of a badge.
- Shortened acquisition actions:
  - `Acquire work`
  - `Scale preview`
  - `Return to field`
- Added visual-only inspect state:
  - `data-preview-kind`
  - `data-preview-size-key`
- Updated size-chip JS so preview kind and size key update with the selected option.
- Refined inspect object styling:
  - Original removes the white paper/mat treatment.
  - Prints retain a thin ivory paper edge.
  - size keys subtly scale the inspect artwork.
  - inspect images use `object-fit: contain`.
- Reduced the lower signal band so it remains typographic support, not a UI block.

### Visual States
- `original`
  - `data-preview-kind="original"`
  - `data-preview-size-key="original"`
  - transparent object background
  - no padding
- `print`
  - `data-preview-kind="print"`
  - paper edge retained
- `30x40`
  - smaller print preview scale
- `50x70`
  - medium print preview scale
- `70x100`
  - larger print preview scale

### Preserved
- Checkout endpoint and Stripe request body.
- Commerce catalog data.
- Work data.
- Living atmosphere files.
- Immersive and XR files.
- Critical hooks:
  - `data-size-chip`
  - `data-size-label`
  - `data-size-dimensions`
  - `data-size-price`
  - `data-size-type-label`
  - `data-size-proof-line`
  - `data-size-material-line`
  - `data-price-display`
  - `data-format-display`
  - `data-type-display`
  - `data-proof-display`
  - `data-material-display`
  - `data-buy-now`
  - `data-interior-preview-open`
  - `data-interior-preview-panel`
  - `data-interior-preview-close`
  - `data-interior-preview-size`
  - `data-interior-preview-price`
  - `data-interior-preview-route`
  - `data-checkout-overlay-copy`

### Still Not Implemented
- Real AR.
- Phone handoff.
- WebXR.
- Sound.
- Collector Room.

### QA
Build:

```txt
npm run build
```

Result: pass.

Fresh dev server:

```txt
http://127.0.0.1:4334
```

Headless QA summary:

```txt
/works/mt-3 overflow: false
/works/figure-in-ash-light overflow: false
/works overflow: false
30x40: EUR 220 / 30 x 40 cm / previewKind print / previewSizeKey 30x40
50x70: EUR 390 / 50 x 70 cm / previewKind print / previewSizeKey 50x70
70x100: EUR 620 / 70 x 100 cm / previewKind print / previewSizeKey 70x100
Original: EUR 850 / A3 / previewKind original / previewSizeKey original
Original inspect padding: 0
Original inspect background: transparent
Print inspect background: ivory paper edge
Escape closes inspect: true
Critical hooks present: true
Mobile 390 overflow: false
```

### QA Screenshots
- `screenshots/v3-09-mt3-normal-desktop.png`
- `screenshots/v3-09-mt3-inspect-original-desktop.png`
- `screenshots/v3-09-mt3-inspect-print-70x100-desktop.png`
- `screenshots/v3-09-mt3-mobile-390.png`
- `screenshots/v3-09-mt3-inspect-mobile-390.png`
- `screenshots/v3-09-figure-ash-desktop.png`
