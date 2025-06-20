import type { Geoman, HelperModeName } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import { ShapeMarkersHelper } from '@/modes/helpers/shape-markers.ts';
import { SnappingHelper } from '@/modes/helpers/snapping.ts';
import { ZoomToFeaturesHelper } from '@/modes/helpers/zoom-to-features.ts';


type HelperClassConstructor = new (gm: Geoman) => BaseHelper;
type HelperClassMap = {
  [K in HelperModeName]: HelperClassConstructor | null;
};

export const helperClassMap: HelperClassMap = {
  shape_markers: ShapeMarkersHelper,
  pin: null,
  snapping: SnappingHelper,
  snap_guides: null,
  measurements: null,
  auto_trace: null,
  geofencing: null,
  zoom_to_features: ZoomToFeaturesHelper,
  click_to_edit: null,
} as const;
