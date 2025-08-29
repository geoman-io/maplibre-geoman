import { gmPrefix } from '@/core/events/listeners/base.ts';
import type { FeatureEditEndFwdEvent, FeatureEditStartFwdEvent } from '@/types/events/forwarder/edit.ts';
import type {
  FeatureCreatedFwdEvent,
  FeatureRemovedFwdEvent,
  FeatureUpdatedFwdEvent,
} from '@/types/events/forwarder/features.ts';
import type { AnyEventName } from '@/types/index.ts';
import type { Page } from '@playwright/test';
import type { BaseEventResult } from '../types.ts';
import { waitForGeoman } from './basic.ts';


export const getEventKey = (eventName: string): string => {
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  return `${eventName}_${uniqueId}`;
};

export const getGeomanEventPromise = async (page: Page, eventName: string): Promise<BaseEventResult> => {
  // required to listen to Geoman events
  await waitForGeoman(page);

  const eventKey = getEventKey(eventName);

  const evaluatePromise = page.evaluate(async (context) => {
    // Define the unified result object structure
    const eventResult: BaseEventResult = {
      shape: null,
      feature: false,
      features: false,
      originalFeature: false,
      originalFeatures: false,
      featureId: undefined,
      listenerIsAttached: false,
    };

    if (!window.customData) {
      window.customData = { eventResults: {} };
    }
    if (window.customData.eventResults) {
      window.customData.eventResults[context.eventKey] = eventResult;
    }

    // Define handlers for different event types
    const eventHandlers = {
      'create': (event: unknown, result: BaseEventResult) => {
        const createEvent = event as FeatureCreatedFwdEvent;
        result.shape = createEvent.shape;
        result.feature = !!createEvent.feature;
      },
      'remove': (event: unknown, result: BaseEventResult) => {
        const removeEvent = event as FeatureRemovedFwdEvent;
        result.shape = removeEvent.shape;
        result.featureId = removeEvent.feature?.id;
      },
      'start': (event: unknown, result: BaseEventResult) => {
        const startEvent = event as FeatureEditStartFwdEvent;
        result.shape = startEvent.shape;
        result.feature = !!startEvent.feature;
      },
      'update': (event: unknown, result: BaseEventResult) => {
        const updateEvent = event as FeatureUpdatedFwdEvent;
        result.shape = updateEvent.shape || null;
        result.feature = !!updateEvent.feature;
        result.features = !!updateEvent.features?.length;
        result.originalFeature = !!updateEvent.originalFeature;
        result.originalFeatures = !!updateEvent.originalFeatures?.length;
      },
      'end': (event: unknown, result: BaseEventResult) => {
        const endEvent = event as FeatureEditEndFwdEvent;
        result.shape = endEvent.shape;
        result.feature = !!endEvent.feature;
      },
    };

    // Map specific event names to the generic handlers
    const handlerMap: Record<string, (event: unknown, result: BaseEventResult) => void> = {
      'create': eventHandlers['create'],
      'remove': eventHandlers['remove'],
      'dragstart': eventHandlers['start'],
      'editstart': eventHandlers['start'],
      'rotatestart': eventHandlers['start'],
      'cutstart': eventHandlers['start'],
      'drag': eventHandlers['update'],
      'edit': eventHandlers['update'],
      'rotate': eventHandlers['update'],
      'cut': eventHandlers['update'],
      'dragend': eventHandlers['end'],
      'editend': eventHandlers['end'],
      'rotateend': eventHandlers['end'],
      'cutend': eventHandlers['end'],
    };

    return new Promise<BaseEventResult>((resolve) => {
      window.geoman.mapAdapter.once(`${context.gmPrefix}:${context.eventName}` as AnyEventName, (event) => {
        const handler = handlerMap[context.eventName];
        if (handler) {
          handler(event, eventResult);
        }
        resolve(eventResult);
      });
      eventResult.listenerIsAttached = true;
      console.log(`BROWSER DEBUG: ${context.gmPrefix}:${context.eventName} listener attached.`);
    });
  }, { gmPrefix, eventName, eventKey });

  await page.waitForFunction((context) => {
    return !!window.customData?.eventResults?.[context.eventKey]?.listenerIsAttached;
  }, { eventKey });

  return evaluatePromise;
};

export const saveGeomanEventResultToCustomData = async (
  page: Page,
  eventName: string,
): Promise<string> => {
  const resultId = `${eventName}_${Math.floor(Math.random() * 10e8)}`;

  await page.evaluate(async (context) => {
    if (!window.customData) {
      window.customData = { rawEventResults: {} };
    }

    window.geoman.mapAdapter.once(`${context.gmPrefix}:${context.eventName}` as AnyEventName, (event) => {
      if (window.customData?.rawEventResults) {
        window.customData.rawEventResults[context.resultId] = event;
      }
    });
  }, { gmPrefix, eventName, resultId });

  return resultId;
};

export const getGeomanEventResultById = async (
  page: Page,
  resultId: string,
) => {
  const handle = await page.waitForFunction(async (context) => {
    if (!window.customData) {
      window.customData = { rawEventResults: {} };
    }
    return window.customData?.rawEventResults?.[context.resultId];
  }, { resultId });

  const value = await handle.jsonValue();
  await handle.dispose();
  return value;
};
