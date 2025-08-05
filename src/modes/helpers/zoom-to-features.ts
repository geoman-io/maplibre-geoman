import { SOURCES } from '@/core/features/index.ts';
import type { HelperModeName, LngLat } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import bbox from '@turf/bbox';
import log from 'loglevel';


export class ZoomToFeaturesHelper extends BaseHelper {
  mode: HelperModeName = 'zoom_to_features';
  mapEventHandlers = {};

  onStartAction() {
    this.fitMapToFeatures();

    setTimeout(() => {
      this.gm.options.disableMode('helper', 'zoom_to_features');
    });
  }

  onEndAction() {
    // ...
  }

  fitMapToFeatures() {
    const featureCollection = this.gm.features.asGeoJsonFeatureCollection({
      sourceNames: [
        SOURCES.main,
        // SOURCES.standby, // used in pro version only
      ],
    });
    const bboxArray = bbox(featureCollection) as [number, number, number, number];
    const bounds: [LngLat, LngLat] = [
      [bboxArray[0], bboxArray[1]],
      [bboxArray[2], bboxArray[3]],
    ];

    try {
      this.gm.mapAdapter.fitBounds(bounds, { padding: 20 });
    } catch {
      log.warn('Wrong bounds for zooming to features', bounds, featureCollection);
    }
  }
}
