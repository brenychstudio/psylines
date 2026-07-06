# ARTIST STAGE v3 — Performance Stability Pass

Status: implemented  
Focus: scroll smoothness, page-transition stability, image decode cost, atmosphere runtime cost

## Findings

The slowdown was not caused by one isolated bug. It came from a combination of expensive systems running at the same time:

```txt
large master JPG files in visible grids
native View Transition root snapshots
full-screen fixed atmosphere layers using blur/filter
Living Atmosphere Orchestrator updating CSS variables every animation frame
frequent pointer/scroll activity updates
```

The largest image files were especially expensive for scroll and transitions:

```txt
p-3.jpg ~11 MB
p-1.jpg ~8.3 MB
mt-* images ~3.8-6.6 MB each
```

These originals remain in `public/` as master files, but the site now serves responsive WebP derivatives for web display.

## Implemented Optimizations

### Responsive Artwork Assets

Generated responsive WebP derivatives under:

```txt
public/generated/
```

Generated sizes:

```txt
640w
960w
1400w
2000w
```

Added helper:

```txt
src/lib/assets/responsiveImage.ts
```

The helper uses generated WebP assets when available and falls back to the original public asset when needed.

### Routes Updated

Responsive image delivery was wired into:

```txt
Home
Works index
Work detail / Object Chamber
Series index
Series chapter
Artist page
Adjacent works
Interior preview
Collector sheet
Print routes
Exhibition routes
Collector routes
```

### Atmosphere Runtime

The Living Atmosphere Orchestrator now uses adaptive frame pacing:

```txt
priority route/focus/inspect state -> faster updates
normal state -> reduced update frequency
scrolling state -> slower update frequency
```

Pointer/keyboard activity timer resets are throttled to avoid unnecessary work during pointer movement.

### Scroll/Transition CSS

During scroll and cinematic transitions:

```txt
full-screen atmosphere animation is paused
full-screen atmosphere filter is removed
root view-transition filter animation is removed
```

The atmosphere remains visually present, but the most expensive full-screen filter work is avoided when scroll or route transition smoothness matters most.

### Offscreen Rendering

Added `content-visibility: auto` to heavy repeated cards/lists so offscreen items do not need to be fully rendered before the user reaches them.

### Dev Server Watcher Stabilization

The slow local startup was traced to large local diagnostic folders inside the project root:

```txt
.tmp/        ~4.75 GB, ~37k files
screenshots/ ~859 MB
.chrome*/    browser smoke profiles
.codex-chrome*/ browser smoke profiles
```

Astro/Vite dev mode watches the project tree. On Windows, watching these generated folders made startup and first route requests feel much slower than the production server.

Added Vite watch ignores in:

```txt
astro.config.mjs
```

Ignored folders:

```txt
.tmp/
screenshots/
test-results/
dist/
.chrome*/
.codex-chrome*/
public/generated/
```

Also added the same local diagnostic folders to `.gitignore`.

Observed local dev improvement:

```txt
before: dev ready roughly 37-39s
after:  dev ready roughly 2s
```

Production standalone server remained fast:

```txt
startup roughly 0.9s
main route responses roughly 15-52ms
```

## Verification

Build:

```txt
npm run build
passed
```

Production smoke:

```txt
/
/works
/works/mt-3
/series
/series/meta-bodies
/artist
```

All checked routes emitted generated WebP assets and `srcset`.

Headless browser scroll smoke via Chrome DevTools Protocol:

```txt
/works       long tasks: 0
/works/mt-3  long tasks: 0
/            long tasks: 0
```

The tested pages also confirmed all rendered artwork images were served from `/generated/`.

## Remaining Watch Items

These are not blockers, but they remain future cleanup candidates:

```txt
large Vite chunk warning
dynamic getStaticPaths warnings in server mode
legacy React works archive components still use direct coverSrc
full WebGL/XR routes should remain isolated from normal page scroll
```
