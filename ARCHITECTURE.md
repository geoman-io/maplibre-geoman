# Architecture

## Workspace layout

This repo is a monorepo with one shared core and two published adapter packages:

- `packages/core` (private, shared runtime + types)
- `packages/maplibre` (`@geoman-io/maplibre-geoman-free`)
- `packages/mapbox` (`@geoman-io/mapbox-geoman-free`)

The consumer-facing API is `new Geoman(map, options)` in both published packages.

## Build-time adapter wiring (`@mapLib/*`)

Core code imports map-library-specific modules through the alias `@mapLib/*`.
That alias is resolved per variant at build/type-check time:

- MapLibre variant points `@mapLib/*` to `packages/maplibre/src/adapter/*`
- Mapbox variant points `@mapLib/*` to `packages/mapbox/src/adapter/*`

Resolution is configured in:

- `packages/core/build/createVariantViteConfig.ts` (Vite alias)
- `tsconfig.maplibre.json` and `tsconfig.mapbox.json` (TypeScript alias)
- `packages/*/tsconfig.types.json` (declaration build alias)

This allows shared core logic to stay adapter-agnostic while preserving one public API.

## Testing by variant

Playwright tests are variant-agnostic at source level and run against one adapter at a time.

- `npm run test:maplibre` sets `PLAYWRIGHT_VARIANT=maplibre`
- `npm run test:mapbox` sets `PLAYWRIGHT_VARIANT=mapbox`

`playwright.config.ts` requires `PLAYWRIGHT_VARIANT` explicitly and selects the matching test server command.

## Bundle/type safety checks

- `scripts/verify-variant-types.mjs` verifies generated `.d.ts` references the correct map library type package.
- `scripts/verify-variant-bundle.mjs` verifies built JS bundles reference the correct map library and do not leak unresolved `@mapLib/*` aliases.
