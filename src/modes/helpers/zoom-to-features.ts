import { type HelperModeName, type LngLatTuple, SOURCES } from '@/main.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import bbox from '@turf/bbox';
import log from 'loglevel';

import { IS_PRO } from '@/core/constants.ts';

export class ZoomToFeaturesHelper extends BaseHelper {
  mode: HelperModeName = 'zoom_to_features';
  eventHandlers = {};

  async onStartAction() {
    this.fitMapToFeatures();

    setTimeout(() => {
      this.gm.options.disableMode('helper', 'zoom_to_features').then();
    });
  }

  onEndAction() {
    // ...
  }

  fitMapToFeatures() {
    const featureCollection = this.gm.features.asGeoJsonFeatureCollection({
      sourceNames: [SOURCES.main, ...(IS_PRO ? [SOURCES.standby] : [])],
    });
    const bboxArray = bbox(featureCollection) as [number, number, number, number];
    const bounds: [LngLatTuple, LngLatTuple] = [
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
