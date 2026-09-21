# Programmatic drawing

`gm.draw.create(input)` creates a completed marker, circle, or rectangle from form values.
`gm.draw.finish(input?)` commits an active drawing of one of those shapes, then disables
that draw mode. Both return a promise of `DrawResult`:

```ts
import type { DrawInput, DrawResult } from '@geoman-io/maplibre-geoman-free';

await gm.waitForGeomanLoaded();
const input: DrawInput = {
  shape: 'circle',
  center: [12.5, 55.7], // [longitude, latitude]
  radiusMeters: 500,
  properties: { name: 'Search area' },
};
const result: DrawResult = await gm.draw.create(input);
if (result.ok) {
  console.log(result.feature.id, result.feature.getGeoJson());
} else {
  console.log(result.reason);
}
```

## Shape inputs

```ts
await gm.draw.create({ shape: 'marker', coordinates: [0, 0] });
await gm.draw.create({ shape: 'circle', center: [12, 55], radiusMeters: 500 });
await gm.draw.create({
  shape: 'rectangle', center: [12, 55],
  widthMeters: 100, heightMeters: 100, angleDegrees: 0,
});
```

A square is a rectangle with equal width and height; subsequent interactive editing
can resize it into a rectangle. All dimensions are ground metres. Rectangle angles
are counterclockwise from east, normalized to `[0, 360)`, defaulting to zero, and
use Geoman's existing Mercator rectangle convention. Circles use 80 segments.
These are geometry shapes, not pixel-radius circle markers.

Optional `properties` are copied. Reserved `__gm_*`, `gm_*`, `shape`, `center`,
`width`, `height`, and `angle` keys are rejected: Geoman owns shape metadata.
Coordinates must be finite `[longitude, latitude]` pairs, within longitude ±180
and Geoman's Mercator latitude bounds ±85.051129. Zero is valid. Dimensions must
be positive and finite. Degenerate, polar, and dateline-crossing output is rejected
rather than silently wrapping or changing the requested geometry.

## Finishing an active drawing

```ts
await gm.enableDraw('circle');
// The user can position a preview on the map, then press your Finish button:
const result = await gm.draw.finish();

// Or supply a complete matching input to replace the preview (even if incomplete):
const exact = await gm.draw.finish({
  shape: 'circle', center: [12.5, 55.7], radiusMeters: 500,
});
```

The examples are alternative actions: after a successful `finish()`, there is no
active drawing. A no-argument finish uses the current valid preview. Circle and
rectangle drawings need a positioned center/start corner and a nonzero extent;
a marker uses the marker pointer position. Input to `finish(input)` is complete,
not a partial patch, and must match the active shape. Other drawing modes return
`unsupported_shape` and stay active.

On success, the committed feature gets its own persistent identity, the temporary
preview is removed, and drawing is disabled. Invalid input, an incomplete preview,
or a rejected creation leaves the active draft available for correction.
Use `gm.disableDraw()` to cancel an unfinished drawing without saving it.

`create()` requires no active drawing. It does not toggle UI modes, select the
result, clear existing features, or zoom the map. Finish or cancel an active draw
before using `create()`. To update an existing feature, use the feature/edit API;
repeated `create()` calls intentionally create separate features.

## Events and validation

Creation uses the same internal commit path as interactive drawing. `gm:create`
fires once on success. A successful `finish()` also produces the existing mode
completion notification, `gm:drawend`, after creation. Rejected operations emit no
creation event. Existing event forwarding and source-update timing settings apply.
The API preserves Geoman shape metadata for subsequent interactive editing.
Import APIs remain intended for loading existing data and have different event semantics.

## Results

Success is `{ ok: true, feature: FeatureData }`. Expected rejections are
`{ ok: false, reason }`:

| Reason | Meaning |
| --- | --- |
| `not_loaded` / `destroyed` | Geoman is not ready, or has been destroyed. |
| `busy` | Another draw API operation or pointer handler is in flight. Retry after it settles. |
| `active_draw` | `create()` was called while a draw mode was active. |
| `no_active_draw` | `finish()` has no active drawing, or it changed during validation. |
| `unsupported_shape` | This initial API supports marker, circle, and rectangle only. |
| `shape_mismatch` | The supplied shape differs from the active draw mode. |
| `invalid_input` | Invalid coordinates, dimensions, properties, or generated geometry. |
| `incomplete_draft` | The current preview cannot be committed. |
| `creation_rejected` | Creation was rejected by validation or the target source. |

Overlapping calls do not queue or create duplicates: a concurrent call returns
`busy`. Sequential `finish()` calls cannot save the same preview twice. Unexpected
exceptions from application/internal handlers reject the promise; the API releases
its lock and temporary validation listeners so later calls can proceed.
