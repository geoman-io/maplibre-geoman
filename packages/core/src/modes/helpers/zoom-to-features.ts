import { IS_PRO } from '@/core/constants.ts';
import { SOURCES } from '@/core/features/constants.ts';
import type { LngLatTuple } from '@/types/map/index.ts';
import type { HelperModeName } from '@/types/modes/index.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';
import bbox from '@turf/bbox';
import log from 'loglevel';

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
