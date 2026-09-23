import type { FeatureData } from '@/core/features/feature-data.ts';
import type { LngLatTuple } from '@/types/map/index.ts';

/** Coordinates are [longitude, latitude]; dimensions are ground metres. */
export type DrawInput = (
  | { shape: 'marker'; coordinates: LngLatTuple }
  | { shape: 'circle'; center: LngLatTuple; radiusMeters: number }
  | {
      shape: 'rectangle';
      center: LngLatTuple;
      widthMeters: number;
      heightMeters: number;
      /** Counterclockwise from east, matching rectangle rotation. Defaults to zero. */
      angleDegrees?: number;
    }
) & { properties?: Record<string, unknown> };

export type DrawRejectionReason =
  | 'not_loaded'
  | 'destroyed'
  | 'busy'
  | 'active_draw'
  | 'no_active_draw'
  | 'unsupported_shape'
  | 'shape_mismatch'
  | 'invalid_input'
  | 'incomplete_draft'
  | 'creation_rejected';

export type DrawResult =
  | { ok: true; feature: FeatureData }
  | { ok: false; reason: DrawRejectionReason };
