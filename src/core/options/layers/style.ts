import { SOURCES } from '@/core/features/index.ts';
import { getCircleMarkerStyles } from '@/core/options/layers/shapes/circle-marker.ts';
import { getControlMarkerStyles } from '@/core/options/layers/shapes/control-marker.ts';
import { getLineStyles } from '@/core/options/layers/shapes/line.ts';
import { getMarkerStyles } from '@/core/options/layers/shapes/marker.ts';
import { getPolygonStyles } from '@/core/options/layers/shapes/polygon.ts';
import { getSecondaryControlMarkerStyles } from '@/core/options/layers/shapes/secondary-marker.ts';
import { getSnapGuideStyles } from '@/core/options/layers/shapes/snap-guides.ts';
import { getTextMarkerStyles } from '@/core/options/layers/shapes/text-marker.ts';
import { sourceStyles } from '@/core/options/layers/variables.ts';
import type { FeatureShape, LayerStyle } from '@/main.ts';
import { IS_PRO } from '@/utils/behavior.ts';


const styles: { [key in FeatureShape]: LayerStyle } = {
  // order matters here, layers order will be aligned according to these items
  polygon: {
    [SOURCES.main]: getPolygonStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getPolygonStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getPolygonStyles(sourceStyles[SOURCES.standby]) }),
  },
  ellipse: {
    [SOURCES.main]: getPolygonStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getPolygonStyles(sourceStyles[SOURCES.temporary]),
    [SOURCES.standby]: getPolygonStyles(sourceStyles[SOURCES.standby]),
  },
  rectangle: {
    [SOURCES.main]: getPolygonStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getPolygonStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getPolygonStyles(sourceStyles[SOURCES.standby]) }),
  },
  circle: {
    [SOURCES.main]: getPolygonStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getPolygonStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getPolygonStyles(sourceStyles[SOURCES.standby]) }),
  },
  circle_marker: {
    [SOURCES.main]: getCircleMarkerStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getCircleMarkerStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getCircleMarkerStyles(sourceStyles[SOURCES.standby]) }),
  },
  line: {
    [SOURCES.main]: getLineStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getLineStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getLineStyles(sourceStyles[SOURCES.standby]) }),
  },
  marker: {
    [SOURCES.temporary]: getMarkerStyles(),
    [SOURCES.main]: getMarkerStyles(),
    ...(IS_PRO && { [SOURCES.standby]: getMarkerStyles() }),
  },
  text_marker: {
    [SOURCES.main]: getTextMarkerStyles(),
    [SOURCES.temporary]: getTextMarkerStyles(),
    ...(IS_PRO && { [SOURCES.standby]: getTextMarkerStyles() }),
  },
  dom_marker: {
    // not a geojson source, layers aren't required
    [SOURCES.main]: [],
    [SOURCES.temporary]: [],
    ...(IS_PRO && { [SOURCES.standby]: [] }),
  },
  center_marker: {
    [SOURCES.main]: getControlMarkerStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getControlMarkerStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getControlMarkerStyles(sourceStyles[SOURCES.standby]) }),
  },
  vertex_marker: {
    [SOURCES.main]: getControlMarkerStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getControlMarkerStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getControlMarkerStyles(sourceStyles[SOURCES.standby]) }),
  },
  edge_marker: {
    [SOURCES.main]: getSecondaryControlMarkerStyles(sourceStyles[SOURCES.main]),
    [SOURCES.temporary]: getSecondaryControlMarkerStyles(sourceStyles[SOURCES.temporary]),
    ...(IS_PRO && { [SOURCES.standby]: getSecondaryControlMarkerStyles(sourceStyles[SOURCES.standby]) }),
  },
  snap_guide: {
    // todo: check which sources can't display snap guides (and other shapes) and remove layers
    [SOURCES.main]: getSnapGuideStyles(),
    [SOURCES.temporary]: getSnapGuideStyles(),
    ...(IS_PRO && { [SOURCES.standby]: getSnapGuideStyles() }),
  },
};

export default styles;
