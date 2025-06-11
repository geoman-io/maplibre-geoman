import defaultShapeMarker from '@/assets/images/markers/default-shape-marker.svg';
import type { MarkerData } from '@/main.ts';
import log from 'loglevel';


const markerIcons: { [key in MarkerData['type']]?: string } = {
  dom: defaultShapeMarker,
};

export const createMarkerElement = (
  type: MarkerData['type'],
  style: Partial<CSSStyleDeclaration> | undefined = undefined,
): HTMLElement => {
  if (!markerIcons[type]) {
    log.error(`createMarkerElement: marker type "${type}" not found`);
  }

  const element = document.createElement('div');
  element.classList.add('marker-wrapper');
  element.style.lineHeight = '0';

  element.innerHTML = markerIcons[type] || 'NO_ICON';
  const svgElement = element.firstChild as HTMLElement;

  if (style) {
    Object.assign(svgElement.style, style);
  }

  return element;
};
