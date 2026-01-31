import { controlIcons } from '@/core/options/icons.ts';
import defaultLayerStyles from '@/core/options/layers/style.ts';
import type { GmOptionsData } from '@/main.ts';
import defaultMarker from '@/assets/images/markers/default-marker.svg';
import defaultShapeMarker from '@/assets/images/markers/default-shape-marker.svg';

export const defaultOptions: GmOptionsData = {
  settings: {
    throttlingDelay: 10,
    awaitDataUpdatesOnEvents: true,
    useDefaultLayers: true,
    useControlsUi: true,
    controlsPosition: 'top-left',
    controlsUiEnabledByDefault: true,
    controlsCollapsible: false,
    controlsStyles: {
      controlGroupClass: 'maplibregl-ctrl maplibregl-ctrl-group',
      controlContainerClass: 'gm-control-container',
      controlButtonClass: 'gm-control-button',
    },
    idGenerator: null,
    markerIcons: {
      default: defaultMarker,
      control: defaultShapeMarker,
    },
  },
  layerStyles: defaultLayerStyles,
  controls: {
    draw: {
      marker: {
        title: 'Marker',
        icon: controlIcons.marker,
        uiEnabled: true,
        active: false,
      },
      circle_marker: {
        title: 'Circle Marker',
        icon: controlIcons.circle_marker,
        uiEnabled: true,
        active: false,
      },
      text_marker: {
        title: 'Text Marker',
        icon: controlIcons.text_marker,
        uiEnabled: true,
        active: false,
      },
      circle: {
        title: 'Circle',
        icon: controlIcons.circle,
        uiEnabled: true,
        active: false,
      },
      ellipse: {
        title: 'Ellipse',
        icon: controlIcons.ellipse,
        uiEnabled: true,
        active: false,
      },
      line: {
        title: 'Line',
        icon: controlIcons.line,
        uiEnabled: true,
        active: false,
      },
      rectangle: {
        title: 'Rectangle',
        icon: controlIcons.rectangle,
        uiEnabled: true,
        active: false,
      },
      polygon: {
        title: 'Polygon',
        icon: controlIcons.polygon,
        uiEnabled: true,
        active: false,
      },
    },
    edit: {
      drag: {
        title: 'Drag',
        icon: controlIcons.drag,
        uiEnabled: true,
        active: false,
      },
      change: {
        title: 'Change',
        icon: controlIcons.change,
        uiEnabled: true,
        active: false,
      },
      rotate: {
        title: 'Rotate',
        icon: controlIcons.rotate,
        uiEnabled: true,
        active: false,
      },

      cut: {
        title: 'Cut',
        icon: controlIcons.cut,
        uiEnabled: true,
        active: false,
      },

      delete: {
        title: 'Delete',
        icon: controlIcons.delete,
        uiEnabled: true,
        active: false,
      },
    },
    helper: {
      shape_markers: {
        title: 'Shape markers',
        icon: null,
        uiEnabled: false,
        active: false,
      },
      snapping: {
        title: 'Snapping',
        icon: controlIcons.snapping,
        uiEnabled: true,
        active: false,
      },

      zoom_to_features: {
        title: 'Zoom to features',
        icon: controlIcons.zoom_to_features,
        uiEnabled: true,
        active: false,
      },
    },
  },
};
