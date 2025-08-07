import { SOURCES } from '@/core/features/index.ts';
import type { SourceStyles } from '@/main.ts';
import { IS_PRO } from '@/utils/behavior.ts';

export const defaultRegularStyle = {
  lineColor: '#278cda',
  lineOpacity: 0.8,
  lineWidth: 3,
  fillColor: '#4fb3ff',
  fillOpacity: 0.4,
  circleMarkerRadius: 10,
};

export const defaultTmpStyle = {
  ...defaultRegularStyle,
  lineColor: '#ff5600',
};


export const sourceStyles: SourceStyles = {
  [SOURCES.main]: {
    lineColor: '#278cda',
    lineOpacity: 0.8,
    lineWidth: 3,
    fillColor: '#4fb3ff',
    fillOpacity: 0.4,
    circleMarkerRadius: 10,
  },
  [SOURCES.temporary]: {
    lineColor: '#ff5600',
    lineOpacity: 0.8,
    lineWidth: 3,
    fillColor: '#4fb3ff',
    fillOpacity: 0.4,
    circleMarkerRadius: 10,
  },
  ...(IS_PRO && {
    [SOURCES.standby]: {
      lineColor: '#787878',
      lineOpacity: 0.8,
      lineWidth: 3,
      fillColor: '#a5a5a5',
      fillOpacity: 0.4,
      circleMarkerRadius: 10,
    },
  }),

};
