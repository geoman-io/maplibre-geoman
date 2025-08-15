import type { DrawModeName, Geoman } from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import { DrawCircleMarker } from '@/modes/draw/circle-marker.ts';
import { DrawCircle } from '@/modes/draw/circle.ts';
import { DrawLine } from '@/modes/draw/line.ts';
import { DrawMarker } from '@/modes/draw/marker.ts';
import { DrawPolygon } from '@/modes/draw/polygon.ts';
import { DrawRectangle } from '@/modes/draw/rectangle.ts';
import { DrawTextMarker } from '@/modes/draw/text-marker.ts';
import { DrawEllipse } from '@/modes/draw/ellipse.ts';

import log from 'loglevel';

type DrawClassConstructor = new (gm: Geoman) => BaseDraw;
type DrawClassMap = {
  [K in DrawModeName]: DrawClassConstructor | null;
};

export const drawClassMap: DrawClassMap = {
  marker: DrawMarker,
  ellipse: DrawEllipse,
  circle: DrawCircle,
  circle_marker: DrawCircleMarker,
  text_marker: DrawTextMarker,
  line: DrawLine,
  rectangle: DrawRectangle,
  polygon: DrawPolygon,
  freehand: null,
  custom_shape: null,
} as const;

export const createDrawInstance = (gm: Geoman, shape: DrawModeName) => {
  if (drawClassMap[shape]) {
    return new drawClassMap[shape](gm);
  }

  log.error(`Draw "${shape}" is not available`);
  return null;
};
