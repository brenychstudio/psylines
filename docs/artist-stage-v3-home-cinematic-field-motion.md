# ARTIST STAGE v3 - Home Cinematic Field Motion

Date: 2026-07-06

## Goal

Refine the Home selected-manifestations field so it feels cinematic, spatial, and alive rather than like a static carousel or crowded gallery.

## Current Behavior

Implemented:

- smoother switching between active works;
- softer floating motion for artwork surfaces;
- hover activation for background works;
- click-to-activate behavior for background works;
- background works no longer feel purely decorative;
- active work remains the main visual anchor;
- `Next` gesture leads to the next Home section;
- first viewport composition has been rebalanced to align with the global header/frame axis.

Relevant files:

- `src/pages/index.astro`
- `src/components/home/HomeLivingEditorialSurface.tsx`
- `src/data/site/homeLivingField.ts`

## Interaction Rule

The field should support three levels of intent:

```txt
passive view -> works float and breathe
hover -> nearby background work wakes up
click / wheel -> selected work becomes active
```

The page should not feel like a standard product carousel. The user is moving through a field of manifestations.

## Current Watch Items

- Mobile/touch tuning for background artwork activation.
- Ensure the `Next` gesture remains visible in the first viewport without becoming louder than the art.
- Avoid too much hover lift; the motion should feel like a smooth rise, not a jump.
- Keep the following section hidden until the user intentionally moves down.
