import { FeatureData } from '@/core/features/feature-data.ts';
import {
  type DrawModeName,
  type FeatureSourceName,
  type GeoJsonShapeFeature,
  type LngLatTuple,
  type MapHandlerReturnData,
  type ShapeName,
  SOURCES,
} from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { isMapPointerEvent } from '@/utils/guards/map.ts';
import type { BaseMapEvent, BaseMapPointerEvent } from '@mapLib/types/events.ts';

export class DrawMarker extends BaseDraw {
  mode: DrawModeName = 'marker';
  shape: ShapeName = 'marker';
  eventHandlers = {
    click: this.onMouseClick.bind(this),
    mousemove: this.onMouseMove.bind(this),
  };

  onStartAction() {
    const customMarker = this.createMarker();
    this.gm.markerPointer.enable({ customMarker });
    this.fireMarkerPointerStartEvent();
  }

  onEndAction() {
    this.gm.markerPointer.disable();
    this.fireMarkerPointerFinishEvent();
  }

  onMouseClick(event: BaseMapEvent): MapHandlerReturnData {
    if (isMapPointerEvent(event)) {
      this.gm.features.clearSelection();
      this.featureData = this.createFeature(event);
      if (this.featureData) {
        this.saveFeature();
      }
    }
    return { next: false };
  }

  onMouseMove(event: BaseMapEvent): MapHandlerReturnData {
    if (!isMapPointerEvent(event) || !this.gm.markerPointer.marker) {
      return { next: true };
    }
    this.fireMarkerPointerUpdateEvent();
    return { next: true };
  }

  createFeature(event: BaseMapPointerEvent): FeatureData | null {
    const lngLat = this.gm.markerPointer.marker?.getLngLat() || event.lngLat.toArray();
    const geoJson = this.getFeatureGeoJson(lngLat);

    if (geoJson) {
      this.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });

      if (this.flags.featureCreateAllowed) {
        return this.gm.features.createFeature({
          shapeGeoJson: geoJson,
          sourceName: SOURCES.temporary,
        });
      }
    }
    return null;
  }

  getFeatureGeoJson(lngLat: LngLatTuple): GeoJsonShapeFeature | null {
    return {
      type: 'Feature',
      properties: {
        shape: this.shape,
      },
      geometry: {
        type: 'Point',
        coordinates: lngLat,
      },
    };
  }

  protected createMarker(sourceName: FeatureSourceName = SOURCES.temporary) {
    // Extract style properties from marker layer styles for the specified source
    const markerStyles = this.gm.options.layerStyles.marker[sourceName];
    const symbolLayer = markerStyles?.find((layer) => layer.type === 'symbol');

    // Get icon-opacity from paint properties
    const iconOpacity =
      symbolLayer?.paint && 'icon-opacity' in symbolLayer.paint
        ? (symbolLayer.paint['icon-opacity'] as number)
        : undefined;

    // Get icon-size from layout properties (default is 0.18 in marker.ts defaults)
    const iconSize =
      symbolLayer?.layout && 'icon-size' in symbolLayer.layout
        ? (symbolLayer.layout['icon-size'] as number)
        : undefined;

    // Calculate pixel size based on icon-size (base size is 36px at icon-size: 0.18)
    const baseSize = 36;
    const defaultIconSize = 0.18;
    const pixelSize =
      iconSize !== undefined ? Math.round(baseSize * (iconSize / defaultIconSize)) : baseSize;
    const sizeStr = `${pixelSize}px`;

    const iconElement = this.gm.createSvgMarkerElement('default', {
      width: sizeStr,
      height: sizeStr,
      pointerEvents: 'none',
      ...(iconOpacity !== undefined && { opacity: String(iconOpacity) }),
    });

    return this.gm.mapAdapter.createDomMarker(
      {
        draggable: false,
        anchor: 'bottom',
        element: iconElement,
      },
      [0, 0],
    );
  }
}
