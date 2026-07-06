# Backdrop 16 / KOOL BERK WebGL Background

Standalone extract of WEBHERO Backdrop 16 for reuse on another site.

## Files

- `kool-berk-background.js` - raw WebGL runtime
- `index.html` - local demo / preview

## Integration

Load the runtime and mount it into any container:

```html
<div id="hero-backdrop" style="position: fixed; inset: 0;"></div>
<script src="/path/to/kool-berk-background.js"></script>
<script>
  window.KoolBerkWebGLBackground.mount("#hero-backdrop", {
    preset: "identity",
    maxDpr: 1.75,
    pointer: true,
    reducedMotion: false,
    addHostClass: false,
    manageContainer: false,
  });
</script>
```

## Options

- `preset`: currently `identity` is the WEBHERO default
- `maxDpr`: caps device pixel ratio for performance
- `pointer`: enables or disables pointer reactivity
- `reducedMotion`: disables the heavier motion response
- `addHostClass`: adds a host class if you want one
- `manageContainer`: lets the runtime set `position: relative` on static hosts

## Notes

- The runtime is already self-contained and does not require React.
- It can be mounted into any existing full-screen or section container.
- If you need a lightweight fallback, set `reducedMotion: true`.
