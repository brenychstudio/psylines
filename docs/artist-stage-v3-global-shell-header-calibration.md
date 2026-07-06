# ARTIST STAGE v3 - Global Shell / Header Calibration

## Goal

Calibrate the global shell, header, footer, and public-route frame so they match the V3 visual language.

## Current problem

Header and shell originally felt like generic site infrastructure while pages were moving toward living field interfaces.

## Target

Quiet museum register, consistent page frame, stable top spacing, readable navigation, and one canonical shell axis across the main public routes.

## Files touched

- src/layouts/BaseLayout.astro
- src/components/navigation/SiteScrollTop.astro
- src/styles/global.css

## Not touched

Checkout, commerce, Work Detail logic, XR, AR, Living Atmosphere engine.

## QA screenshots

- screenshots/v3-16-header-home.png
- screenshots/v3-16-header-works.png
- screenshots/v3-16-header-mt3.png
- screenshots/v3-16-header-artist.png
- screenshots/v3-16-header-mobile-390.png
- screenshots/v3-16-footer.png

## Build status

Passed: `npm run build`

Notes:

- Existing Astro router warnings remain for dynamic routes where `getStaticPaths()` is ignored in server output.
- Existing Vite chunk-size warning remains.

## What improved

- Header markup now separates the shell header from primary navigation.
- Header uses V3 shell width tokens and reads as a quiet field register.
- Active route state is server-rendered with `aria-current="page"`.
- Static atmosphere mood tokens subtly tune header background and border color without scroll observers or client logic.
- Footer now aligns to the V3 wide shell and reads as a quiet production register.
- Home, Works, Artist, Contact, and Process now sit on the same shell/frame axis instead of page-specific width drift.
- Long public routes use the shared `SiteScrollTop` gesture instead of local one-off implementations.
- Footer includes `Process` as a quiet support link so the method layer stays reachable from the canonical shell.
- Mobile 390 header no longer creates page overflow; final measured `scrollWidth` and `clientWidth` are both `390`.

## Route QA

- `/`
- `/works`
- `/works/mt-3`
- `/process`
- `/artist`
- `/contact`
- `/collectors`
- `/policies/shipping`
- `/immersive`

## Remaining issues

- Full Chameleon Header remains future work: no scroll-state, scene-token choreography, or client-side adaptive route behavior was added in this pass.
- Header remains a calibrated global register, not a context-reactive navigation layer.
- Some page-level compositions still use local spacing logic, but the shell axis itself is now canonical and should remain the alignment source of truth.
