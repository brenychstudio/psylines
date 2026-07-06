# ARTIST STAGE v3 - Production Readiness Gate

## Goal
Run a real readiness pass on the current V3 repository state after `V3-36R`, not on the earlier work-detail-only baseline.

## Scope
Core verification:

```txt
build
route smoke
metadata
mobile sanity
works filters
work detail
checkout hooks
contact
collectors
policies
living atmosphere
content gaps
launch classification
```

Additional implementation tracks required in this pass:

```txt
encoding and copy sweep
route perimeter decision
documentation sync
```

## Route Perimeter Decision
For this pass, the route perimeter is split into two groups.

Core public perimeter:

```txt
/
/series
/series/[slug]
/works
/works/[slug]
/artist
/contact
/collectors
```

Secondary perimeter:

```txt
/prints
/prints/[slug]
/collectors/works/[slug]
/collectors/prints/[slug]
/exhibitions
/exhibitions/[slug]
```

Implementation rule:
- Secondary perimeter routes remain reachable.
- They should not present themselves as primary launch surfaces.
- They should be kept out of indexing during this gate unless intentionally promoted later.

## Current Implementation Status
In progress:
- Added `noindex` support in `BaseLayout`.
- Applied `noindex` to secondary perimeter routes.
- Replaced damaged branding and mojibake in commerce and secondary route copy.
- Synced the top-level brief and README to the current V3 state.

Still to verify:
- Post-fix build and route smoke.
- Whether any core route still contains damaged copy.
- Whether any secondary route should later be merged into the core perimeter or removed from public demo scope.

## Known Non-Blockers
- Dynamic `getStaticPaths()` warnings in server output.
- Large Vite chunk warning.
- XR route remains experimental.

## Expected Outcome

```txt
internal demo: likely ready after verification
public preview: only after core QA and visual sweep
live collector sales: not approved in this pass
```
