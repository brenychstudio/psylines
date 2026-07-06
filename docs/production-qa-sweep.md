# ARTIST STAGE v2 - Production QA Sweep

## Date
2026-06-05

## Build
Status: pass.

Command:

```powershell
npm run build
```

Warnings:
- Dynamic `getStaticPaths()` ignored in SSR dynamic pages: existing warning, non-blocker, later optimization.
- Vite chunk size over 500 kB: existing warning, non-blocker, performance optimization.

## Route Smoke
Checked against local dev server at `http://127.0.0.1:4322`.

- `/` - 200
- `/works` - 200
- `/works/mt-3` - 200
- `/artist` - 200
- `/contact` - 200
- `/collectors` - 200
- `/immersive` - 200
- `/immersive/experience` - 200
- `/policies/shipping` - 200
- `/policies/returns` - 200
- `/policies/privacy` - 200
- `/policies/terms` - 200

## Metadata
All core routes checked for:

- `<title>`
- meta description
- canonical
- `og:title`
- `og:description`
- `og:image`
- `twitter:card`
- `twitter:title`
- `twitter:description`

Results:

- `/` - pass. Title: `ARTIST STAGE - Meta-Bodies and Collector Field`.
- `/works` - pass. Title: `Works - ARTIST STAGE`.
- `/works/mt-3` - pass. Title: `MT-3 - ARTIST STAGE`.
- `/artist` - pass. Title: `Artist - ARTIST STAGE`.
- `/contact` - pass. Title: `Contact - ARTIST STAGE`.
- `/collectors` - pass. Title: `Collector Process - ARTIST STAGE`.
- `/immersive` - pass. Title: `Immersive Field - ARTIST STAGE`.
- `/policies/shipping` - pass. Title: `Shipping - ARTIST STAGE`.
- `/policies/returns` - pass. Title: `Returns - ARTIST STAGE`.
- `/policies/privacy` - pass. Title: `Privacy - ARTIST STAGE`.
- `/policies/terms` - pass. Title: `Terms - ARTIST STAGE`.

Work detail metadata:
- `/works/mt-3` has dynamic title `MT-3 - ARTIST STAGE`.
- `/works/mt-3` has work-specific description from the work statement.
- `/works/mt-3` has a valid cover-based `og:image`: `/artworks/test-painting-2/mt-3.jpg`.
- No fake `/og/*` image path found.

## Living Atmosphere
Server-rendered `data-atmosphere-mood` results:

- `/` - `metaBodies`
- `/works` - `collector`
- `/works/mt-3` - `collector`
- `/artist` - `studies`
- `/contact` - `collector`
- `/collectors` - `collector`
- `/policies/shipping` - `collector`
- `/policies/returns` - `collector`
- `/policies/privacy` - `collector`
- `/policies/terms` - `collector`
- `/immersive` - `immersive`

Work detail note:
- `/works/mt-3` server mood is `collector` because the route is under `/works`.
- The work-specific atmosphere override is present in page source with `data-atmosphere-override`, `artist-stage:atmosphere:set`, and `metaBodies`.
- Runtime expectation: final client mood becomes `metaBodies` after the work override script runs.

## Work Detail Acquisition
Checked `/works/mt-3`.

Source hooks:

- `data-size-chip` - present
- `data-buy-now` - present
- `data-interior-preview-open` - present
- `data-interior-preview-panel` - present
- `data-checkout-overlay-copy` - present
- `/api/checkout` reference - present
- `EUR 850` default - present
- `Original` default - present and active

Headless browser interaction:

- Initial active option: `Original`.
- Initial price: `EUR 850`.
- Clicked `30 x 40` size chip.
- Price updated to `EUR 220`.
- Format updated to `30 x 40 cm`.
- Route updated to `Limited edition print`.
- Proof updated to limited edition/certificate context.
- Material updated to pigment print / archival fine-art paper.
- Production updated to `3-7 business days`.
- Return updated to `14 days`.
- Delivery updated to Spain / EU / Worldwide timing context.
- Interior Preview opened successfully.
- Interior Preview closed successfully.
- `Buy now` remained available after preview close.

No real Stripe session was created.

## Works Field
Checked `/works`.

- Field intro exists.
- Curated and compact view controls exist.
- Filter controls exist.
- Count exists.
- Availability markers exist.
- Work cards link to `/works/[slug]`, including `/works/mt-3`.
- Page does not present itself as a generic marketplace grid.

Headless browser interaction:

- Initial count: `13`.
- Clicking a cycle filter changed active filter to `Meta-Bodies / Inner Structures`.
- Count updated to `8`.

Note:
- View toggle controls are present. The automated CDP check confirmed the UI exists, but did not fully validate visual layout switching because the current SSR markup does not expose stable grid state hooks for this test.

## Trust / Policies
Checked:

- `/collectors` explains collector process.
- `/policies/shipping` opens.
- `/policies/returns` opens.
- `/policies/privacy` opens.
- `/policies/terms` opens.
- Footer links are present on checked routes.
- Purchase panel trust links are present:
  - Collector process
  - Shipping
  - Returns

## Mobile QA
Headless Chrome viewport checks:

Widths checked:

- `390px`
- `768px`
- `1366px`

Routes checked for horizontal overflow:

- `/`
- `/works`
- `/works/mt-3`
- `/contact`
- `/collectors`
- `/policies/shipping`

Results:

- No horizontal overflow detected at checked widths.
- Footer is present at checked widths.
- Home, Works, Work Detail, Contact, Collectors, and Shipping policy render within viewport width.
- Work detail purchase panel remained readable enough for interaction checks.
- Interior Preview opened and closed without detected viewport overflow in the checked run.

## Immersive / XR
Checked:

- `/immersive` - 200
- `/immersive/experience` - 200

Status:
- No fatal route smoke failure found.
- XR/immersive runtime was not modified in this task.
- Deeper XR interaction and performance audit remains a later dedicated QA pass.

## Known Warnings
Dynamic `getStaticPaths()` warning:

- Classification: non-blocker / later optimization.
- Reason: build passes and dynamic routes smoke-test successfully.
- Later task: decide SSR vs prerender strategy and clean route configuration.

Chunk size warning:

- Classification: non-blocker / performance optimization.
- Reason: build passes and core routes open.
- Later task: inspect immersive/Three bundle splitting and lazy-load strategy.

## Blockers
No production blockers found in this sweep.

## Non-blockers
- Dynamic `getStaticPaths()` warnings on SSR dynamic routes.
- Large chunk warning from Vite.
- `/works/mt-3` server mood is `collector` before client-side work override applies `metaBodies`.
- Works view toggle would benefit from stable test hooks for future automation.
- Deeper XR runtime/performance QA is still pending.

## Recommended Next Fixes
- Task 17: Production Visual Sweep across core pages.
- Add stable QA hooks for Works view state if automated visual regression becomes part of the workflow.
- Later: route rendering strategy cleanup for dynamic `getStaticPaths()` warnings.
- Later: bundle splitting / lazy-loading pass for immersive and Three-related chunks.
- Later: dedicated XR runtime QA and performance check.
