# ARTIST STAGE v2 - Final Production Review

## Date
2026-06-05

## Overall Status
Ready for internal demo.

Public demo readiness: conditionally ready for a non-live-commerce demo. Before live collector sales, complete the pre-launch fixes listed below, especially final legal/policy review and Stripe production configuration review.

## Build
Status: pass.

Command:

```powershell
npm run build
```

Warnings:
- Dynamic `getStaticPaths()` ignored in SSR dynamic pages.
- Vite chunk size warning over 500 kB.

Decision:
- Both warnings are non-blockers for internal demo.
- Dynamic `getStaticPaths()` is a later rendering strategy cleanup.
- Chunk size is a later performance optimization, likely tied to immersive/Three-related bundles.

## Core Routes
Checked against local dev server at `http://127.0.0.1:4322`.

| Route | Status | Visual state | Mobile |
| --- | --- | --- | --- |
| `/` | 200 | ok | ok |
| `/works` | 200 | ok | ok |
| `/works/mt-3` | 200 | ok | ok |
| `/artist` | 200 | ok | ok |
| `/contact` | 200 | ok | ok |
| `/collectors` | 200 | ok | ok |
| `/immersive` | 200 | experimental | ok |
| `/immersive/experience` | 200 | experimental | not deeply audited |
| `/policies/shipping` | 200 | ok | ok |
| `/policies/returns` | 200 | ok | ok |
| `/policies/privacy` | 200 | ok | ok |
| `/policies/terms` | 200 | ok | ok |

## Metadata / SEO
Checked on core routes:

- title
- description
- canonical
- `og:title`
- `og:description`
- `og:image`
- Twitter card/title/description

Results:
- All checked core routes include production metadata.
- No fake `/og/*` path detected.
- `/works/mt-3` has dynamic title: `MT-3 - ARTIST STAGE`.
- `/works/mt-3` has work-specific description from the work statement.
- `/works/mt-3` has valid cover-based OG image: `/artworks/test-painting-2/mt-3.jpg`.

## Living Atmosphere
Runtime / server checks:

| Route | Expected | Observed |
| --- | --- | --- |
| `/` | `metaBodies` | `metaBodies` |
| `/works` | `collector` | `collector` |
| `/works/mt-3` | `metaBodies` after work override | `metaBodies` at runtime, override present |
| `/artist` | `studies` | `studies` |
| `/contact` | `collector` | `collector` |
| `/collectors` | `collector` | `collector` |
| `/policies/*` | `collector` | `collector` |
| `/immersive` | `immersive` | `immersive` |

Readability:
- Current moods do not block readability on checked pages.
- No aggressive color shift observed in headless route checks.
- Backdrop remains subordinate to content on core pages.

## Acquisition / Stripe
Checked `/works/mt-3`.

Static hooks present:
- `data-size-chip`
- `data-buy-now`
- `data-interior-preview-open`
- `data-interior-preview-panel`
- `data-checkout-overlay-copy`
- `/api/checkout`
- `EUR 850`
- purchase panel trust links

Interaction checks:
- Initial default is Original, `EUR 850`.
- Selecting `30x40` updates price to `EUR 220`.
- Format updates to `30 x 40 cm`.
- Route updates to limited edition print.
- Proof/material/production/return/delivery metadata update.
- Buy now remains available after interaction.

Stripe test-mode session checks:
- `POST /api/checkout` with `{ workSlug: "mt-3", optionLabel: "original" }` returned 200 and a Stripe checkout URL.
- `POST /api/checkout` with `{ workSlug: "mt-3", optionLabel: "30x40" }` returned 200 and a Stripe checkout URL.
- No live payment was attempted.

Important note:
- API field is named `optionLabel`, but the working value is the size key (`original`, `30x40`), not the display label (`Original`, `30 x 40`). UI uses the working size key, so this is not a launch blocker for the current interface, but it is a pre-launch cleanup for API clarity.

Checkout state:
- Success/cancel feedback copy is present in the work detail script.
- Full browser redirect return from Stripe was not completed beyond session creation.

## Interior Preview
Checked `/works/mt-3`.

Results:
- `Preview in interior` opens the panel.
- Close button closes the panel.
- `Return to collector route` closes the panel.
- Preview metadata updates with selected size, price, and route.
- Copy does not overpromise AR or real-world measurement accuracy.
- Mobile overflow check passed on `/works/mt-3`.

AR status:
- Interior Preview MVP exists.
- Real AR integration is not connected.
- Universal AR module can remain a future integration path.

Classification:
- Post-launch enhancement unless AR is required for a specific demo narrative.

## Works Field
Checked `/works`.

Results:
- Curated mode works.
- Compact mode works.
- Filters work.
- Count updates.
- Availability markers exist.
- Work cards link to detail pages.
- Filter interaction dispatches atmosphere mood; Meta-Bodies filter switched mood to `metaBodies`.
- Mobile grid has no detected horizontal overflow at checked widths.

## Artist / Contact / Collectors / Policies
Artist:
- Reads as practice statement plus collector trust layer.
- CTAs lead to works/contact.

Contact:
- Clearly routes collector, curatorial, and studio messages.
- Does not become the main purchase funnel.
- Direct collector route points back to selected work pages.

Collectors:
- Explains collector process and links to works/contact/shipping/returns.

Policies:
- Shipping is clear and does not overpromise.
- Returns copy is careful and avoids hard legal claims.
- Privacy does not invent analytics/tracking.
- Terms avoid final legal overclaims and state production/shipping dependence.

Footer:
- Trust links are present and readable.
- Footer line is production-grade and no placeholder language remains.

Purchase panel trust links:
- Collector process
- Shipping
- Returns

## Copy / Tone
Visible copy checked for unwanted generic terms:

- `shop`
- `cart`
- `products`
- `gallery store`
- `portfolio`
- `placeholder`
- `MVP`

Result:
- No unwanted visible copy found on checked public routes.
- Technical class names and internal identifiers were not treated as visible copy.

## Mobile QA
Headless Chrome widths checked:

- `390px`
- `768px`
- desktop `1366px`

Routes checked:

- `/`
- `/works`
- `/works/mt-3`
- `/artist`
- `/contact`
- `/collectors`
- `/policies/shipping`

Results:
- No horizontal overflow detected.
- CTAs remain readable.
- Purchase panel remains usable.
- Footer links remain readable.
- No giant empty gaps detected in the checked route set.

## Immersive / XR
Routes:

- `/immersive` - 200
- `/immersive/experience` - 200

Observed `/immersive/experience` state:
- Text renders.
- Route does not fatal crash.
- Headless check did not detect a canvas or audio element in the initial page state.
- Page communicates WebXR support as device-dependent.

Classification:
- Experimental / post-launch enhancement.
- Main website launch should not depend on final XR completion.

Recommended XR follow-up:
- Dedicated manual browser QA for desktop movement, mouse look, audio state, VR button behavior, and device compatibility.

## AR Preview Status
Current:
- Interior Preview MVP exists and works as a collector-scale/context preview.
- Real AR integration is not connected to the production flow.

Classification:
- Post-launch enhancement unless required for demo scope.

## Launch Blockers
No blockers found for internal demo.

No blocker found for a public non-live-commerce demo, provided the demo does not claim final legal terms or final XR/AR completion.

## Pre-launch Fixes
Recommended before public live commerce:

- Final legal review of Shipping, Returns, Privacy, and Terms.
- Confirm production Stripe environment variables and test/live mode separation.
- Clarify checkout API naming: `optionLabel` currently expects size key values such as `original` and `30x40`.
- Complete a real end-to-end Stripe test return flow through hosted checkout and success/cancel URLs in a staging environment.
- Add sitemap/robots in a dedicated SEO deployment pass.

## Post-launch Enhancements
- Dynamic `getStaticPaths()` / SSR route strategy cleanup.
- Bundle splitting and lazy loading for large chunks, especially immersive/Three-related code.
- Dedicated XR runtime/performance QA.
- Real AR integration beyond the current interior preview MVP.
- More formal automated visual regression once the visual system stabilizes.
- Stable QA hooks for Works view state if automated UI checks become part of release workflow.

## Decision
Recommended next action:

Proceed to internal demo.

For public demo:
- Safe if positioned as a public preview / demo of the Living Collector Field.
- Do not present live commerce, final legal terms, final XR, or real AR as complete until the pre-launch fixes are closed.

For live collector sales:
- Not yet recommended until legal copy, production Stripe configuration, and full checkout return flow are reviewed in staging.
