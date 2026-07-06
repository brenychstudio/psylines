# Artist Site v1 — Architecture Freeze

## Stack
- Astro
- React islands
- Tailwind CSS v4 via @tailwindcss/vite
- Three.js / R3F / drei

## Architectural rule
1. Global Atmospheric Backdrop System behind UI
2. Local Stage Surfaces only where needed
3. Shared Stage Core separated from platform adapters
4. Commerce stays separate from stage rendering logic
5. XR arrives as a separate lane, not as a first-release dependency everywhere

## Phase 1 scope
- editorial shell
- basic IA routes
- backdrop root
- hero stage shell
- scene registry
- Scene 01 metadata and stub
