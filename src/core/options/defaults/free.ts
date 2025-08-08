import { controlIcons } from '@/core/options/icons.ts';
import defaultLayerStyles from '@/core/options/layers/style.ts';
import type { GmOptionsData } from '@/main.ts';


export const defaultOptions: GmOptionsData = {
  settings: {
    throttlingDelay: 10,
    controlsPosition: 'top-left',
    controlsUiEnabledByDefault: true,
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
