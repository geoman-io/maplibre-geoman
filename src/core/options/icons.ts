import change from '@/assets/images/controls/change.svg';
import circleMarker from '@/assets/images/controls/circle-marker.svg';
import circle from '@/assets/images/controls/circle.svg';
import drag from '@/assets/images/controls/drag.svg';
import line from '@/assets/images/controls/line.svg';

import marker from '@/assets/images/controls/marker.svg';
import polygon from '@/assets/images/controls/polygon.svg';
import rectangle from '@/assets/images/controls/rectangle.svg';
import remove from '@/assets/images/controls/remove.svg';
import rotate from '@/assets/images/controls/rotate.svg';
import snapGuides from '@/assets/images/controls/snap-guides.svg';
import textMarker from '@/assets/images/controls/text_marker.svg';
import autoTrace from '@/assets/images/controls2/auto-trace.svg';
import copy from '@/assets/images/controls2/copy.svg';
import customShape from '@/assets/images/controls2/custom-shape.svg';
import cut from '@/assets/images/controls2/cut.svg';
import difference from '@/assets/images/controls2/difference.svg';
import freehand from '@/assets/images/controls2/freehand.svg';
import geoFencing from '@/assets/images/controls2/geofencing.svg';
import lasso from '@/assets/images/controls2/lasso.svg';
import lineSimplification from '@/assets/images/controls2/line-simplification.svg';
import measurements from '@/assets/images/controls2/measurements.svg';
import mouse from '@/assets/images/controls2/mouse.svg';
import pin from '@/assets/images/controls2/pin.svg';
import scale from '@/assets/images/controls2/scale.svg';
import snapping from '@/assets/images/controls2/snap.svg';
import split from '@/assets/images/controls2/split.svg';
import union from '@/assets/images/controls2/union.svg';
import zoomToFeatures from '@/assets/images/controls2/zoom-to-features.svg';

import type { DrawModeName, EditModeName, HelperModeName } from '@/main.ts';

type ModeOptionName = DrawModeName | EditModeName | HelperModeName;
type ControlIcons = Record<ModeOptionName, string | null>;

// FontGis Icons
// https://viglino.github.io/font-gis/?fg=earth

export const controlIcons: ControlIcons = {
  marker,
  circle,
  circle_marker: circleMarker,
  text_marker: textMarker,
  line,
  rectangle,
  polygon,
  freehand,
  custom_shape: customShape,
  drag,
  change,
  rotate,
  scale,
  copy,
  cut,
  split,
  delete: remove,
  union,
  difference,
  line_simplification: lineSimplification,
  lasso,
  shape_markers: null,
  snapping,
  pin,
  snap_guides: snapGuides,
  measurements,
  auto_trace: autoTrace,
  geofencing: geoFencing,
  zoom_to_features: zoomToFeatures,
  click_to_edit: mouse,
};
