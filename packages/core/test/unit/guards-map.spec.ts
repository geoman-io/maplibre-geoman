import { describe, expect, it, vi } from 'vitest';
import log from 'loglevel';

vi.mock('@/main.ts', () => ({
  Geoman: class Geoman {},
}));

import {
  isBaseMapEventName,
  isMapMouseEvent,
  isMapPointerEvent,
  isMapTouchEvent,
  isMapWithOnceMethod,
  isPartialLayer,
  isPointerEventName,
  isPointerEventWithModifiers,
} from '@/utils/guards/map.ts';

describe('utils/guards/map', () => {
  it('validates event name helpers', () => {
    expect(isPointerEventName('click')).toBe(true);
    expect(isPointerEventName('load')).toBe(false);
    expect(isBaseMapEventName('load')).toBe(true);
    expect(isBaseMapEventName('click')).toBe(false);
  });

  it('validates maps exposing the once method', () => {
    expect(
      isMapWithOnceMethod({
        once: () => undefined,
      }),
    ).toBe(true);
    expect(isMapWithOnceMethod({ once: 1 })).toBe(false);
    expect(isMapWithOnceMethod(null)).toBe(false);
  });

  it('validates pointer, mouse, and touch events', () => {
    const mouseEvent = {
      lngLat: { lng: 1, lat: 2 },
      point: { x: 10, y: 20 },
      type: 'click',
      originalEvent: { ctrlKey: false, shiftKey: false, altKey: false, metaKey: false },
    };
    const touchEvent = {
      ...mouseEvent,
      type: 'touchstart',
    };

    expect(isMapPointerEvent(mouseEvent)).toBe(true);
    expect(isMapMouseEvent(mouseEvent)).toBe(true);
    expect(isMapTouchEvent(mouseEvent)).toBe(false);

    expect(isMapPointerEvent(touchEvent)).toBe(true);
    expect(isMapTouchEvent(touchEvent)).toBe(true);
    expect(isMapMouseEvent(touchEvent)).toBe(false);
  });

  it('warns when invalid events are checked with warning=true', () => {
    const warnSpy = vi.spyOn(log, 'warn').mockImplementation(() => undefined);

    expect(isMapPointerEvent(null, { warning: true })).toBe(false);
    expect(isMapPointerEvent({ type: 'unknown' }, { warning: true })).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });

  it('detects keyboard modifiers on pointer events', () => {
    expect(
      isPointerEventWithModifiers({
        originalEvent: { ctrlKey: false, shiftKey: false, altKey: false, metaKey: false },
      } as never),
    ).toBe(false);
    expect(
      isPointerEventWithModifiers({
        originalEvent: { ctrlKey: true, shiftKey: false, altKey: false, metaKey: false },
      } as never),
    ).toBe(true);
  });

  it('validates partial layer styles by supported type', () => {
    expect(isPartialLayer({ type: 'line' })).toBe(true);
    expect(isPartialLayer({ type: 'circle' })).toBe(true);
    expect(isPartialLayer({ type: 'heatmap' })).toBe(false);
    expect(isPartialLayer(null)).toBe(false);
  });
});
