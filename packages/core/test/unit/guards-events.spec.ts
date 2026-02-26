import { describe, expect, it } from 'vitest';
import { GM_SYSTEM_PREFIX } from '@/core/constants.ts';
import { isGmControlEvent } from '@/utils/guards/events/control.ts';
import {
  isGmDrawEvent,
  isGmDrawFreehandDrawerEvent,
  isGmDrawLineDrawerEvent,
  isGmDrawShapeEvent,
} from '@/utils/guards/events/draw.ts';
import { isGmEditEvent } from '@/utils/guards/events/edit.ts';
import {
  isGmFeatureBeforeCreateEvent,
  isGmFeatureBeforeUpdateEvent,
} from '@/utils/guards/events/features.ts';
import { isGmGeofencingViolationEvent, isGmHelperEvent } from '@/utils/guards/events/helper.ts';
import { isBaseMapEvent, isGmEvent } from '@/utils/guards/events/index.ts';

const baseGmPayload = {
  level: 'gm',
  actionType: 'draw',
  action: 'create',
};

describe('utils/guards/events', () => {
  it('validates the generic gm event shape', () => {
    expect(
      isGmEvent({
        ...baseGmPayload,
        name: `${GM_SYSTEM_PREFIX}:draw:shape`,
      }),
    ).toBe(true);
    expect(isGmEvent({ ...baseGmPayload })).toBe(false);
  });

  it('validates base map events', () => {
    expect(
      isBaseMapEvent({
        type: 'click',
        originalEvent: {},
        target: {},
      }),
    ).toBe(true);
    expect(isBaseMapEvent({ type: 'click' })).toBe(false);
  });

  it('validates control/edit/helper event classifiers', () => {
    expect(
      isGmControlEvent({
        ...baseGmPayload,
        actionType: 'mode',
        name: `${GM_SYSTEM_PREFIX}:control:switch`,
      }),
    ).toBe(true);
    expect(
      isGmEditEvent({
        ...baseGmPayload,
        actionType: 'edit',
        name: `${GM_SYSTEM_PREFIX}:edit:change`,
      }),
    ).toBe(true);
    expect(
      isGmHelperEvent({
        ...baseGmPayload,
        actionType: 'helper',
        name: `${GM_SYSTEM_PREFIX}:helper:snapping`,
      }),
    ).toBe(true);
    expect(
      isGmGeofencingViolationEvent({
        ...baseGmPayload,
        actionType: 'helper',
        name: `${GM_SYSTEM_PREFIX}:helper:geofencing_violation`,
      }),
    ).toBe(true);
    expect(
      isGmGeofencingViolationEvent({
        ...baseGmPayload,
        name: `${GM_SYSTEM_PREFIX}:helper:snapping`,
      }),
    ).toBe(false);
  });

  it('validates feature before-create/before-update event names', () => {
    expect(
      isGmFeatureBeforeCreateEvent({
        ...baseGmPayload,
        actionType: 'feature',
        name: `${GM_SYSTEM_PREFIX}:feature:before_create`,
      }),
    ).toBe(true);
    expect(
      isGmFeatureBeforeUpdateEvent({
        ...baseGmPayload,
        actionType: 'feature',
        name: `${GM_SYSTEM_PREFIX}:feature:before_update`,
      }),
    ).toBe(true);
    expect(
      isGmFeatureBeforeCreateEvent({
        ...baseGmPayload,
        actionType: 'feature',
        name: `${GM_SYSTEM_PREFIX}:feature:created`,
      }),
    ).toBe(false);
  });

  it('validates draw event variants and drawer subtypes', () => {
    const drawShapePayload = {
      ...baseGmPayload,
      actionType: 'draw',
      name: `${GM_SYSTEM_PREFIX}:draw:shape`,
      variant: 'line_drawer',
    };

    expect(isGmDrawEvent(drawShapePayload)).toBe(true);
    expect(isGmDrawShapeEvent(drawShapePayload)).toBe(true);
    expect(isGmDrawLineDrawerEvent(drawShapePayload)).toBe(true);
    expect(isGmDrawFreehandDrawerEvent(drawShapePayload)).toBe(false);

    expect(
      isGmDrawShapeEvent({
        ...drawShapePayload,
        name: `${GM_SYSTEM_PREFIX}:draw:shape_with_data`,
      }),
    ).toBe(true);
    expect(
      isGmDrawShapeEvent({
        ...drawShapePayload,
        name: `${GM_SYSTEM_PREFIX}:draw:start`,
      }),
    ).toBe(false);
  });
});
