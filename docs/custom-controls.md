# Custom controls

Custom controls are host-defined buttons rendered as an extra group below
Geoman's built-in control bar. Unlike the built-in controls (which toggle a
draw/edit/helper mode), a custom control runs an arbitrary `onClick` handler — so
you can wire the control bar up to host actions like toggling a map layer,
exporting data, opening a panel, or zooming to features.

> Implements the request in
> [geoman-io/maplibre-geoman#205](https://github.com/geoman-io/maplibre-geoman/issues/205).

## Quick start

Pass `customControls` when you create Geoman:

```ts
const geoman = new Geoman(map, {
  customControls: [
    {
      id: 'toggle-parcels',
      title: 'Toggle parcels layer',
      icon: '<svg viewBox="0 0 20 20">...</svg>',
      order: 10,
      onClick: ({ gm, control, event }) => {
        const hidden = map.getLayoutProperty('parcels', 'visibility') === 'none';
        map.setLayoutProperty('parcels', 'visibility', hidden ? 'visible' : 'none');
      },
    },
  ],
});
```

The button appears in a `group-custom` group at the bottom of the control bar,
using the same styling (`controlsStyles`) as the built-in buttons.

## The `CustomControl` shape

| Field     | Type                             | Required | Notes                                                                                |
| --------- | -------------------------------- | :------: | ------------------------------------------------------------------------------------ |
| `id`      | `string`                         |   yes    | Unique. Used for the button's DOM id (`id_custom_<id>`) / class and for removal.     |
| `onClick` | `(ctx) => void \| Promise<void>` |   yes    | Click handler. `ctx` is `{ gm, control, event }`. Async handlers are awaited.        |
| `title`   | `string`                         |    no    | Tooltip. When no `icon` is set, the first two characters render as the button label. |
| `icon`    | `string \| null`                 |    no    | Raw SVG markup; **sanitized with DOMPurify** before render.                          |
| `order`   | `number`                         |    no    | Sort order within the custom group (lower first). Ties keep insertion order.         |
| `active`  | `boolean`                        |    no    | Controlled pressed state — adds the `active` class. You own toggling it (see below). |

The click context:

```ts
interface CustomControlClickContext {
  gm: Geoman; // the Geoman instance
  control: CustomControl; // the control that was clicked
  event: MouseEvent; // the DOM click event
}
```

`CustomControl` and `CustomControlClickContext` are exported from the package, so
you can type your control definitions.

## Runtime API

Controls can be added or removed after init via `geoman.control`:

```ts
geoman.control.addCustomControl({
  id: 'export',
  title: 'Export GeoJSON',
  onClick: ({ gm }) => console.log(gm.features.exportGeoJson()),
});

geoman.control.removeCustomControl('export');
```

`addCustomControl` is also an upsert: adding a control whose `id` already exists
replaces it in place. This is the idiom for a toggle button — re-add it with a
flipped `active` from inside its own handler:

```ts
let on = false;
const renderToggle = () => {
  geoman.control.addCustomControl({
    id: 'demo-toggle',
    title: on ? 'On' : 'Off',
    active: on,
    onClick: () => {
      on = !on;
      renderToggle();
    },
  });
};
renderToggle();
```

## Notes

- Custom controls are **not** subject to the selection-requirement gating that
  applies to built-in edit tools — they are always clickable. If you need a
  control disabled in some state, manage that yourself (e.g. no-op in `onClick`).
- Handler errors are caught and logged (via `loglevel`) so a throwing handler
  never breaks the control bar.
- The control bar is only rendered when `settings.useControlsUi` is `true`
  (the default).

## Live example

The dev app wires up two demo controls in
[`apps/dev/common.ts`](../apps/dev/common.ts): a declarative "Zoom to features"
button (in `createGmOptions()`) and a runtime toggle button (in
`setupDevEnvironment()`). Run it with `pnpm run dev:maplibre`.
