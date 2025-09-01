import type { AnyEventName } from '@/types/index.ts';
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

export const getGeomanEventResultById = async (page: Page, resultId: string) => {
  const handle = await page.waitForFunction(
    async (context) => {
      if (!window.customData) {
        window.customData = { rawEventResults: {} };
      }
      return window.customData?.rawEventResults?.[context.resultId];
    },
    { resultId },
  );

  const value = await handle.jsonValue();
  await handle.dispose();
  return value;
};
