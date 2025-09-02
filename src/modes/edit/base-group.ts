import { FeatureData } from '@/core/features/feature-data.ts';
import type {
  AnyEvent,
  EditModeName,
  FeatureShape,
  FeatureSourceName,
  MapHandlerReturnData,
} from '@/main.ts';
import { BaseEdit } from '@/modes/edit/base.ts';
import { isNonEmptyArray } from '@/utils/guards/index.ts';
import booleanIntersects from '@turf/boolean-intersects';
import difference from '@turf/difference';
import union from '@turf/union';
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import log from 'loglevel';

import { SOURCES } from '@/core/features/constants.ts';

export abstract class BaseGroupEdit extends BaseEdit {
  abstract mode: EditModeName;
  abstract allowedShapeTypes: Array<FeatureShape>;
  features: Array<FeatureData> = [];
  featureData: FeatureData | null = null;
  eventHandlers = {
    click: this.onMouseClick.bind(this),
  };

  onStartAction() {
    // ...
  }

  onEndAction() {
    this.features.forEach((featureData) => {
      featureData.changeSource({ sourceName: SOURCES.main, atomic: true });
    });
    this.features = [];
  }

  onMouseClick(event: AnyEvent): MapHandlerReturnData {
    // check if a clicked feature temporary, if yes, convert it to regular
    const featureUnselected = this.unselectFeature(event);
    if (featureUnselected) {
      return { next: true };
    }

    // if a feature is regular, convert it to temporary and add to the features array
    const featureData = this.getAllowedFeatureByMouseEvent({ event, sourceNames: [SOURCES.main] });
    if (featureData && this.isFeatureAllowedToGroup(featureData)) {
      featureData.changeSource({ sourceName: SOURCES.temporary, atomic: true });
      this.features.push(featureData);
    }

    // if there are two features in the array, group them
    if (this.features.length > 1) {
      this.groupFeatures();
      return { next: true };
    }

    return { next: true };
  }

  unselectFeature(event: AnyEvent) {
    const tmpFeatureData = this.getAllowedFeatureByMouseEvent({
      event,
      sourceNames: [SOURCES.temporary],
    });
    if (tmpFeatureData) {
      const featureIndex = this.features.findIndex((featureData) => featureData === tmpFeatureData);
      if (featureIndex > -1) {
        this.features.splice(featureIndex, 1);
      }
      tmpFeatureData.changeSource({ sourceName: SOURCES.main, atomic: true });
      return true;
    }
    return false;
  }

  getAllowedFeatureByMouseEvent({
    event,
    sourceNames,
  }: {
    event: AnyEvent;
    sourceNames: Array<FeatureSourceName>;
  }) {
    const featureData = this.gm.features.getFeatureByMouseEvent({ event, sourceNames });
    if (featureData && this.allowedShapeTypes.includes(featureData.shape)) {
      return featureData;
    }
    return null;
  }

  isFeatureAllowedToGroup(featureData: FeatureData) {
    if (!this.allowedShapeTypes.includes(featureData.shape)) {
      return false;
    }
    if (this.features.length === 0) {
      return true;
    }

    const newFeatureGeoJson = featureData.getGeoJson();
    return this.features.every((feature) =>
      booleanIntersects(feature.getGeoJson(), newFeatureGeoJson),
    );
  }

  groupFeatures() {
    if (!this.features.length) {
      log.error('BaseGroupEdit.groupFeatures: no features to group');
      return;
    }

    const featureCollection: FeatureCollection<Polygon | MultiPolygon> = {
      type: 'FeatureCollection',
      features: this.features
        .map((featureData) => {
          const geoJson = featureData.getGeoJson();
          if (['Polygon', 'MultiPolygon'].includes(geoJson.geometry.type)) {
            return geoJson as Feature<Polygon | MultiPolygon>;
          }
          return null;
        })
        .filter((feature) => !!feature),
    };

    let resultGeoJson: Feature<Polygon | MultiPolygon> | null = null;
    if (this.mode === 'union') {
      resultGeoJson = union(featureCollection);
    } else if (this.mode === 'difference') {
      resultGeoJson = difference(featureCollection);
    }

    if (resultGeoJson) {
      const featureData = this.gm.features.createFeature({
        shapeGeoJson: {
          ...resultGeoJson,
          properties: {
            ...resultGeoJson.properties,
            shape: 'polygon',
          },
        },
        sourceName: SOURCES.main,
      });

      this.features.forEach((feature) => {
        this.gm.features.delete(feature);
      });

      if (featureData && isNonEmptyArray(this.features)) {
        this.fireFeatureUpdatedEvent({
          sourceFeatures: this.features,
          targetFeatures: [featureData],
        });
      }

      this.features = [];
    }
  }
}
