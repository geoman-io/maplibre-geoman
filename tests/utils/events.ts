import type { AnyEventName, BaseEventListener, FeatureEditFwdEvent } from '@/types/index.ts';
import type { Page } from '@playwright/test';
import { GM_PREFIX } from '@/core/constants.ts';

export const getEventKey = (eventName: string): string => {
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2);
  return `${eventName}_${uniqueId}`;
};

export const saveGeomanEventResultToCustomData = async (
  page: Page,
  eventName: string,
): Promise<string> => {
  const resultId = `${eventName}_${Math.floor(Math.random() * 10e8)}`;

  await page.evaluate(
    async (context) => {
      if (!window.customData) {
        window.customData = { rawEventResults: {} };
      }

      window.geoman.mapAdapter.once(
        `${context.gmPrefix}:${context.eventName}` as AnyEventName,
        (event) => {
          if (window.customData?.rawEventResults) {
            window.customData.rawEventResults[context.resultId] = event;
          }
        },
      );
    },
    { gmPrefix: GM_PREFIX, eventName, resultId },
  );

  return resultId;
};

export const saveGeomanFeatureEventResultToCustomData = async (
  page: Page,
  eventName: string,
  featureId: string | number,
): Promise<string> => {
  const resultId = `${eventName}_${Math.floor(Math.random() * 10e8)}`;

  await page.evaluate(
    async (context) => {
      if (!window.customData) {
        window.customData = { rawEventResults: {} };
      }

      const eventName = `${context.gmPrefix}:${context.eventName}` as AnyEventName;
      const listener = (event: FeatureEditFwdEvent) => {
        if (event.name !== 'gm:selection' && event.feature.id === context.featureId) {
          if (window.customData?.rawEventResults) {
            window.customData.rawEventResults[context.resultId] = event;
          }
          window.geoman.mapAdapter.off(eventName, listener as BaseEventListener);
        }
      };

      window.geoman.mapAdapter.on(eventName, listener as BaseEventListener);
    },
    { gmPrefix: GM_PREFIX, eventName, resultId, featureId },
  );

  return resultId;
};

export const getGeomanEventResultById = async (
  page: Page,
  resultId: string,
  options: { timeout?: number } = {},
) => {
  const timeout = options.timeout ?? 20000; // Default 20s timeout
  const handle = await page.waitForFunction(
    (context) => {
      return window.customData?.rawEventResults?.[context.resultId] || null;
    },
    { resultId },
    { timeout },
  );

  const value = await handle.jsonValue();
  await handle.dispose();
  return value;
};

/**
 * Clear a specific event result from customData.
 * Useful when testing multiple shapes in a loop to avoid interference.
 */
export const clearGeomanEventResult = async (page: Page, resultId: string) => {
  await page.evaluate(
    (context) => {
      if (window.customData?.rawEventResults) {
        delete window.customData.rawEventResults[context.resultId];
      }
    },
    { resultId },
  );
};
