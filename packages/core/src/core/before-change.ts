import type { Geoman } from '@/main.ts';
import type { FeatureId } from '@/types/features.ts';
import type { Geometry } from 'geojson';
import log from 'loglevel';

export type BeforeChangeOperation = 'create' | 'update' | 'remove';

/**
 * Context passed to `settings.beforeChange`. Return `false` to refuse the
 * change; `true` or `undefined` allows it. `featureId` is null for a create
 * that does not yet have a feature. `geometry` is the candidate geometry for
 * create/update and null for a removal.
 */
export type BeforeChangeContext = {
  operation: BeforeChangeOperation;
  featureId: FeatureId | null;
  geometry: Geometry | null;
};

/** Run the optional public veto hook. A throw is treated as a refusal. */
export const allowBeforeChange = async (
  gm: Geoman,
  context: BeforeChangeContext,
): Promise<boolean> => {
  const hook = gm.options.settings.beforeChange;
  if (!hook) {
    return true;
  }

  try {
    return (await hook(context)) !== false;
  } catch (error) {
    log.error('settings.beforeChange rejected the change', error);
    return false;
  }
};
