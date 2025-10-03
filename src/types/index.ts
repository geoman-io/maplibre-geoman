import type { EventsMap } from '@/types/map/events-map.ts';

declare module 'maplibre-gl' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface MapEventType extends EventsMap {}
}

// types
export type * from '@/types/features.ts';
export type * from '@/types/events/index.ts';
export type * from '@/types/map/index.ts';
export type * from '@/types/modes/index.ts';
export type * from '@/types/controls.ts';
export type * from '@/types/geojson.ts';
export type * from '@/types/options.ts';
export type * from '@/types/map/events-map.ts';
