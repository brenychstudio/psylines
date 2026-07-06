# ARTIST STAGE v3 - Work Detail Atmosphere Dominance Fix

## Goal
Ensure each `/works/[slug]` page is dominated by the opened artwork's own atmosphere profile, not by global route mood or green fallback.

## Problem
The artwork atmosphere engine works technically, but Work Detail pages still show persistent green/moss atmosphere even for non-green artworks.

## Decision
On Work Detail, artwork profile controls hue. Route/section/presence states may modulate density, calm, pressure, and depth, but they must not override artwork color.

## Audit findings
- `global.css` defines the default and `metaBodies` route mood with green `--atmo-accent`.
- `.site-shell::before` uses `--atmo-accent`, so Work Detail could retain a green route wash behind the artwork field.
- Work Detail had an early `.detail-media-card` background using `var(--atmo-accent)`.
- Work Detail also had late Object Chamber calibration blocks with hardcoded green halos such as `rgba(122, 174, 78, ...)`, `rgba(136, 190, 92, ...)`, and `rgba(119, 164, 84, ...)`.
- Later token-based rules existed, but the route mood and late green layers could still dominate the left field for non-green artworks.

## Files touched
- `src/components/artwork-atmosphere/ArtworkAtmosphereBridge.astro`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/lib/artwork-atmosphere/artworkAtmosphereProfiles.ts`
- `src/pages/works/[slug].astro`
- `src/styles/global.css`
- `docs/artist-stage-v3-work-detail-atmosphere-dominance-fix.md`

## QA comparison
- MT-3 = moss / vegetal
- MT-1 = red clay / yellow / pale body
- MT-2 = red pressure / ochre
- Figure in Ash Light = warm ash / orange / graphite

## QA screenshots
- `screenshots/v3-24-work-mt3-dominance.png`
- `screenshots/v3-24-work-mt1-dominance.png`
- `screenshots/v3-24-work-mt2-dominance.png`
- `screenshots/v3-24-work-ash-dominance.png`
- `screenshots/v3-24-home-to-mt1-after-2s.png`
- `screenshots/v3-24-works-regression.png`
- `screenshots/v3-24-home-regression.png`
- `screenshots/v3-24-mobile-390.png`

## QA notes
- Work Detail debug reports `context: work-detail` and `source: work-detail`.
- Work Detail route-enter residue is reduced to the work-detail handoff window and then settles.
- Work Detail profile interpolation is faster than global route interpolation so residue does not dominate non-green works.
- MT-3 retains green/moss atmosphere.
- MT-1 reads as red clay / yellow / pale body after handoff.
- MT-2 reads as red pressure / ochre.
- Figure in Ash Light reads as warm ash / orange / graphite.
- Home and Works remain `context: global`.
- MT-3 commerce controls remained present in QA: `data-buy-now`, size chips and scale preview were detected.

## Remaining issues
- Some non-commerce works do not expose `data-buy-now`, size chips or scale preview because no commerce product is configured for those slugs.
- Debug overlay can cover content in screenshots, especially on mobile; this is limited to `?atmoDebug=1`.

## Pass 25 - Seamless Atmosphere Layer Cleanup

### Problem
Artwork-specific atmosphere is now visible, but some layers appear as rectangular translucent panels or visible container edges.

### Goal
Keep artwork-specific color dominance while making atmosphere seamless and field-like.

### Key decision
Atmosphere should live as large feathered fields, not bounded block backgrounds.

### Visual rule
No visible div edges. No atmospheric rectangles. No panel-like color blocks.

### Audit notes
- The large rectangle behind artwork came primarily from container-bound `.detail-media-card` / `.object-chamber-surface` backgrounds and shadows.
- The left colored block came from `[data-work-detail-atmosphere="dominant"] .object-chamber-v3::after` using `position: absolute` with `inset: 0`, plus `.object-chamber-v3::before` bounded to the hero container.
- First viewport separators were mostly collector rail borders: identity bottom border, route copy divider, readout cells, proof rows, and lower signal band top borders.
- The global `.site-artwork-atmosphere-field` is fixed and full-screen, so it is the correct place for dominant artwork color; it was refined rather than removed.

### Layers changed
- Work Detail global atmosphere field now uses wider feathered gradients.
- Object Chamber container color support was converted to oversized fixed feathered fields.
- Media card and object surface backgrounds were made transparent.
- Local artwork halo remains on `.object-chamber-plane::before`.
- Acquisition rail backgrounds were made transparent, with only a subtle feathered pseudo glow.
- First viewport rail/separator borders were reduced.

### QA comparison
- MT-1 = red clay / yellow / pale body atmosphere, no rectangular red panel
- MT-3 = moss / vegetal atmosphere, no green box
- MT-4 = ochre / vegetal atmosphere, no orange box
- Figure in Ash Light = ash / orange atmosphere, no block edge

### Pass 25 screenshots
- `screenshots/v3-25-mt1-seamless.png`
- `screenshots/v3-25-mt3-seamless.png`
- `screenshots/v3-25-mt4-seamless.png`
- `screenshots/v3-25-ash-seamless.png`
- `screenshots/v3-25-mt1-first-viewport-lines-check.png`
- `screenshots/v3-25-home-regression.png`
- `screenshots/v3-25-works-regression.png`
- `screenshots/v3-25-mobile-390.png`

### Remaining concerns
- The first viewport still keeps very faint register lines in the collector rail for hierarchy; they are reduced rather than fully removed.
- Debug/session residue can change computed color during automated route sequences, so visual QA should compare direct loads when judging final field color.

## Pass 26 - Work Detail Text Rail Atmosphere Veil Standard

### Problem
After the seamless cleanup pass, the right information rail became visually cleaner, but it lost the soft translucent atmosphere support that previously helped color pass through the text column.

### Goal
Restore a subtle, feathered, atmosphere-sensitive veil only behind the right-side text rail.

### Key decision
The right rail may have a local atmosphere veil, but it must not behave like a hard panel or visible rectangle.

### Standard
- Right text/info rail gets a soft veil.
- Veil is translucent and feathered.
- Artwork color remains visible through it.
- No obvious rectangular edges.
- No boxed UI feeling.

### Visual intent
The text rail should feel suspended inside the color field, not detached from it and not boxed off from it.

### Implementation notes
- The rail target is `[data-collector-rail]`, which contains the title, description, collector route, format chips, price, selected format and actions.
- The rail element remains transparent with no panel background, border or box shadow.
- The support layer is a single `::before` pseudo-element using `--artwork-glow`, `--artwork-wash-strong` and `--artwork-shadow-wash`.
- The collector route area now has the intentional high-quality translucent support surface, because this is where the panel-like effect is visually useful.
- Global Work Detail context now exposes rail veil and rail surface variables for restrained tuning.

### Pass 26 screenshots
- `screenshots/v3-26-mt1-text-rail-veil.png`
- `screenshots/v3-26-mt3-text-rail-veil.png`
- `screenshots/v3-26-mt4-text-rail-veil.png`
- `screenshots/v3-26-ash-text-rail-veil.png`
- `screenshots/v3-26-home-regression.png`
- `screenshots/v3-26-works-regression.png`
- `screenshots/v3-26-mobile-390.png`

### Pass 26 QA notes
- MT-3 shows a soft green rail veil plus a higher-quality translucent collector route surface under the commerce interface.
- MT-1 and Figure in Ash Light keep their artwork-specific atmospheres and do not regain the old green fallback.
- Non-commerce Work Detail pages keep the veil restrained because the rail only contains title and description.
- Mobile 390px remains stable with the rail flowing below the artwork and no new horizontal overflow observed.
