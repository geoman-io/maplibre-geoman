import type { EventsMap } from './types';

declare module 'maplibre-gl' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface MapEventType extends EventsMap {}
}
