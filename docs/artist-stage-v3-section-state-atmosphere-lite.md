# ARTIST STAGE v3 - Section State Atmosphere Lite

## Goal
Extend the Living Atmosphere Orchestrator so page sections influence density, pressure, calmness and focus while scrolling.

## Current problem
Atmosphere reacts to artwork and interaction, but sections do not yet shape the living field.

## Target
Home, Works and Artist sections become atmospheric states. The site should feel more continuous and less like static pages with hover reactions.

## Scope
Frontend only. CSS-first. No WebGL. No AI extraction. No AR. No XR. No sound. No analytics.

## Signals
- active artwork
- active route
- active section
- viewport-visible artwork
- hover/focus override
- idle/scrolling/inspecting states

## Files touched
- `src/lib/living-atmosphere/sectionAtmosphereStates.ts`
- `src/lib/living-atmosphere/initLivingAtmosphereOrchestrator.ts`
- `src/pages/index.astro`
- `src/pages/works/index.astro`
- `src/pages/artist.astro`
- `src/styles/global.css`
- `docs/artist-stage-v3-section-state-atmosphere-lite.md`

## QA screenshots
- `screenshots/v3-21-home-threshold-debug.png` - Home top reports `home-threshold`.
- `screenshots/v3-21-home-cycles-debug.png` - Home cycle band reports `home-cycles`.
- `screenshots/v3-21-works-intro-debug.png` - Works top register reports `works-intro`.
- `screenshots/v3-21-works-field-debug.png` - Works field reports `works-field` while viewport artwork detection remains active.
- `screenshots/v3-21-works-index-debug.png` - Works Index mode reports `works-index`; viewport artwork remains artwork-led.
- `screenshots/v3-21-artist-threshold-debug.png` - Artist top reports `artist-threshold`.
- `screenshots/v3-21-artist-statement-debug.png` - Artist statement reports `artist-statement`.
- `screenshots/v3-21-artist-practice-debug.png` - Artist practice reports `artist-practice`.
- `screenshots/v3-21-mt3-regression.png` - Work detail keeps `mt-3` page artwork profile.
- `screenshots/v3-21-mobile-390.png` - Mobile Home remains stable at 390px.

## Section markers implemented
- Home: `home-threshold`, `home-cycles`.
- Works: `works-intro`, `works-field`, `works-index`.
- Artist: `artist-threshold`, `artist-statement`, `artist-practice`, `artist-material`.

## Behavior notes
- Section state is interpolated separately from artwork color profile.
- Section tokens control field opacity, focused/inspect opacity, saturation, contrast, blur, scale, drift, breath duration, density, pressure and calm.
- Density, pressure and calm are expressed through subtle veil layers so artwork color remains authored by the active artwork profile.
- The section observer ignores the `<html>` debug/state dataset so root state does not compete with page section markers.
- Works view switching dispatches `artist-stage:atmosphere-section:set` so large Index/Field grids can set section state without relying only on intersection ratio.
- Debug mode now shows artwork slug, source, interaction state, section id and section label.
- Hover/focus regression on Works passed: viewport artwork switched to `mt-2` on pointer focus and returned to the viewport slug after pointerout while preserving `works-field`.
- Route smoke checks returned 200 for `/`, `/works`, `/artist`, `/works/mt-3`, `/works/mt-1`, `/contact`, `/collectors`, and `/immersive`.
- `npm run build` passed.

## Remaining issues
- Dev server HMR can reload during headless screenshot automation; final screenshot QA was captured against a fresh preview of the passing build.
- Work detail pages intentionally remain on `default` section state unless a future pass authors detail-page section states.
- Section influence is deliberately subtle for Lite; stronger page-transition memory belongs in V3-22.
