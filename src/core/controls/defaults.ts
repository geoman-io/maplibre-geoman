import type { SystemControls } from '@/main.ts';


export const systemControls: SystemControls = {
  draw: {
    marker: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'marker',
      settings: {
        exclusive: true,
      },
    },
    circle_marker: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'circle_marker',
      settings: {
        exclusive: true,
      },
    },
    text_marker: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'text_marker',
      settings: {
        exclusive: true,
      },
    },
    circle: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'circle',
      settings: {
        exclusive: true,
      },
    },
    ellipse: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'ellipse',
      settings: {
        exclusive: true,
      },
    },
    line: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'line',
      settings: {
        exclusive: true,
      },
    },
    rectangle: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'rectangle',
      settings: {
        exclusive: true,
      },
    },
    polygon: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'polygon',
      settings: {
        exclusive: true,
      },
    },
    freehand: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'freehand',
      settings: {
        exclusive: true,
      },
    },
    custom_shape: {
      type: 'draw',
      eventType: 'toggle',
      targetMode: 'custom_shape',
      settings: {
        exclusive: true,
      },
    },
  },
  edit: {
    drag: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'drag',
      settings: {
        exclusive: true,
      },
    },
    change: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'change',
      settings: {
        exclusive: true,
      },
    },
    rotate: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'rotate',
      settings: {
        exclusive: true,
      },
    },
    scale: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'scale',
      settings: {
        exclusive: true,
      },
    },
    copy: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'copy',
      settings: {
        exclusive: true,
      },
    },
    cut: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'cut',
      settings: {
        exclusive: true,
      },
    },
    split: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'split',
      settings: {
        exclusive: true,
      },
    },
    union: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'union',
      settings: {
        exclusive: true,
      },
    },
    difference: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'difference',
      settings: {
        exclusive: true,
      },
    },
    line_simplification: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'line_simplification',
      settings: {
        exclusive: true,
      },
    },
    lasso: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'lasso',
      settings: {
        exclusive: true,
      },
    },
    delete: {
      type: 'edit',
      eventType: 'toggle',
      targetMode: 'delete',
      settings: {
        exclusive: true,
      },
    },
  },
  helper: {
    shape_markers: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'shape_markers',
      settings: {
        exclusive: false,
        enabledBy: [
          'drag',
          'change',
          'rotate',
          'scale',
          'line_simplification',
        ],
      },
    },
    snapping: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'snapping',
      settings: {
        exclusive: false,
      },
    },
    pin: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'pin',
      settings: {
        exclusive: false,
      },
    },
    snap_guides: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'snap_guides',
      settings: {
        exclusive: false,
      },
    },
    measurements: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'measurements',
      settings: {
        exclusive: false,
      },
    },
    auto_trace: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'auto_trace',
      settings: {
        exclusive: false,
      },
    },
    geofencing: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'geofencing',
      settings: {
        exclusive: false,
      },
    },
    zoom_to_features: {
      type: 'helper',
      eventType: 'click',
      targetMode: 'zoom_to_features',
      settings: {
        exclusive: false,
      },
    },
    click_to_edit: {
      type: 'helper',
      eventType: 'toggle',
      targetMode: 'click_to_edit',
      settings: {
        exclusive: false,
      },
    },
  },
};
