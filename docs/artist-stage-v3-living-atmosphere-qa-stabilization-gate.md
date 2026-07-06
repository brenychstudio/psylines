# ARTIST STAGE v3 - Living Atmosphere QA + Stabilization Gate

## Goal
Verify and stabilize the living atmosphere system after V3-20-V3-27.

## Scope
This pass checks the system. It does not add new features.

## Systems under review
- Artwork atmosphere profiles
- Living Atmosphere Orchestrator
- Viewport artwork detection
- Section state atmosphere
- Route handoff memory
- Stillness / idle presence
- Artwork-specific psychological curves
- Work Detail atmosphere dominance
- Seamless atmosphere cleanup
- Text rail atmosphere veil

## Routes tested
- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/works/mt-1` - 200
- `/works/mt-2` - 200
- `/works/mt-4` - 200
- `/works/figure-in-ash-light` - 200
- `/artist` - 200
- `/contact` - 200
- `/collectors` - 200
- `/policies/shipping` - 200
- `/policies/returns` - 200
- `/immersive` - 200

## QA result
PASS WITH WATCH ITEMS

The Living Atmosphere system is stable enough to move forward. The core routes build, smoke-test, and render without blocking visual or interaction regressions. No checkout, catalog, commerce component, immersive, AR, XR, or engine files were edited in this gate.

## Build result
- `npm run build` passed.
- Existing Astro warnings remain for dynamic server pages with `getStaticPaths()`.
- Existing Vite chunk-size warning remains.

## Debug mode verification
- Debug panel appears with `?atmoDebug=1`.
- Debug panel does not appear without the query parameter.
- Debug state includes artwork slug, source, interaction state, section, presence, curve, temperament, route handoff source, route source path, and route target path.

Expected Work Detail debug states were confirmed:
- `/works/mt-3` - `work-detail`, `mt-3`, Vegetal emergence, `vegetal-emergence`.
- `/works/mt-1` - `work-detail`, `mt-1`, Red clay pressure, `red-pressure`.
- `/works/mt-2` - `work-detail`, `mt-2`, Rhythmic pressure, `red-pressure`.
- `/works/mt-4` - `work-detail`, `mt-4`, Ochre loop, `ochre-loop`.
- `/works/figure-in-ash-light` - `work-detail`, `figure-in-ash-light`, Ash suspension, `ash-suspension`.

## Work Detail comparison
- MT-3 reads as moss / vegetal / green-black with a calm growth curve.
- MT-1 reads as red clay / pale body pressure and does not retain dominant green after the page settles.
- MT-2 reads as stronger red pressure than MT-1 while remaining restrained.
- MT-4 reads as ochre / vegetal movement and does not collapse into MT-3.
- Figure in Ash Light reads as warm ash / orange / graphite and is not green-dominant.

Stillness checks reached `deep` on the main Work Detail routes. Captured values show authored behavioral separation:
- MT-3 - tension `0.420`, calm `0.788`, density `0.613`.
- MT-1 - tension `0.737`, calm `0.503`, density `0.739`.
- MT-2 - tension `0.835`, calm `0.421`, density `0.800`.
- MT-4 - tension `0.601`, calm `0.639`, density `0.661`.
- Figure in Ash Light - repeat stillness check confirmed `deep` after a longer wait.

## Seamless layer check
- No blocking rectangular atmosphere panels were observed on Work Detail screenshots.
- The artwork-specific global field remains visible and distinct.
- The right text rail veil remains present and useful without reverting to a hard panel.
- The rail surface is most visible around collector route, format, price, and actions, which matches the V3-26 standard.
- No large hard dark backing around the artwork was observed in the checked screenshots.

## Works behavior
- `/works?atmoDebug=1` renders and updates artwork state through viewport/focus behavior.
- Hover/focus on MT-2 sets source `focus`, state `focused`, curve `mt-2`, and temperament `red-pressure`.
- Field / Index mode controls remain usable.
- Index mode itself toggles correctly in DOM, with curated mode hidden and compact mode visible after selection.

## Route handoff
- Home to Works writes MT-3 handoff memory and lands on `/works` without a black/default reset.
- MT-1 to Works writes MT-1 handoff memory and then allows Works route/viewport state to take over.
- Handoff source, from path, and to path are visible in debug.

## Section state
Home:
- `home-threshold` confirmed.
- `home-cycles` confirmed.

Works:
- `works-field` confirmed during viewport/field browsing.
- `works-intro` confirmed on route smoke.
- Index mode toggles correctly, but the sampled active section can remain `works-intro` or `works-field` depending on scroll position and observer timing.

Artist:
- `artist-threshold` confirmed on route smoke.
- `artist-statement` confirmed.
- `artist-practice` confirmed.
- `artist-material` confirmed.

## Reduced motion
- `prefers-reduced-motion: reduce` disables the global atmosphere breathing animation.
- Reduced motion keeps the correct artwork slug, context, curve, rail veil, and static atmosphere field.
- No reduced-motion layout break was observed.

## Mobile
- 390px Work Detail check had no horizontal overflow.
- Navigation remains usable.
- Work Detail remains readable.
- Atmosphere remains active rather than disabled.
- Debug overlay covers content on mobile, but only in `?atmoDebug=1` QA mode.

## Commerce and collector interaction
- MT-3 has `data-buy-now`.
- MT-3 has 4 format chips.
- Format chip selection updates price and selected format.
- Scale preview opens and Escape closes it.
- Checkout references still exist.
- MT-1 has no buy controls in the current dataset, which appears content-driven rather than an atmosphere regression.

## Issues found
- No blocking issues found.
- No evidence of checkout, catalog, commerce, immersive, AR, XR, or engine regression.
- No debug panel leak without `?atmoDebug=1`.

## Fixes applied
- No code fixes were applied in this stabilization gate. The pass remained QA/documentation only because the tested system did not show a concrete blocking regression.

## Remaining watch items
- Works Index section debug can be timing-sensitive. The DOM mode switch works, but the active section may still report `works-intro` or `works-field` immediately after switching if the viewport is still dominated by those regions.
- Automated stillness checks can be affected by image load and page activity timing. Figure in Ash Light initially reported `active`, then passed after a longer repeat wait.
- Mobile debug overlay is intentionally intrusive in QA mode. Non-debug mobile should remain the real UX reference.
- MT-1 currently has no buy controls; keep watching that this remains a content/catalog condition rather than an interaction regression.

## Screenshots
- `screenshots/v3-28-home-atmosphere-stable.png`
- `screenshots/v3-28-works-viewport-debug.png`
- `screenshots/v3-28-works-hover-mt2-debug.png`
- `screenshots/v3-28-mt3-still-debug.png`
- `screenshots/v3-28-mt1-still-debug.png`
- `screenshots/v3-28-mt2-still-debug.png`
- `screenshots/v3-28-mt4-still-debug.png`
- `screenshots/v3-28-ash-still-debug.png`
- `screenshots/v3-28-artist-section-debug.png`
- `screenshots/v3-28-mobile-390.png`
- `screenshots/v3-28-reduced-motion-check.png`
- `screenshots/v3-28-works-index-mode-debug.png`
- `screenshots/v3-28-commerce-mt3-check.png`
- `screenshots/v3-28-commerce-mt1-check.png`
- `screenshots/v3-28-qa-results.json`
- `screenshots/v3-28-interaction-results.json`

## Recommendation
Proceed to final page polish or a narrow micro-fix pass only if manual review wants tighter Works Index section reporting or a small text rail veil calibration. The living atmosphere system itself is coherent, restrained, and stable enough for the next phase.
