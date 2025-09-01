export const ACTION_TYPES = ['draw', 'edit', 'helper'] as const;

export const SHAPE_NAMES = [
  // shapes
  'marker',
  'circle',
  'circle_marker',
  'text_marker',
  'line',
  'rectangle',
  'polygon',
] as const;

export const EXTRA_DRAW_MODES = ['freehand', 'custom_shape'] as const;

export const DRAW_MODES = [...SHAPE_NAMES, ...EXTRA_DRAW_MODES] as const;

export const HELPER_MODES = [
  'shape_markers',
  'pin',
  'snapping',
  'snap_guides',
  'measurements',
  'auto_trace',
  'geofencing',
  'zoom_to_features',
  'click_to_edit',
] as const;

export const EDIT_MODES = [
  'drag',
  'change',
  'rotate',
  'scale',
  'copy',
  'cut',
  'split',
  'union',
  'difference',
  'line_simplification',
  'lasso',
  'delete',
] as const;
