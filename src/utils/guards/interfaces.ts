import type { AutoTraceHelperInterface, PinHelperInterface, SnapGuidesHelperInterface } from '@/types/interfaces.ts';
import { BaseHelper } from '@/modes/helpers/base.ts';

export const isSnapGuidesHelper = (instance: unknown): instance is SnapGuidesHelperInterface => {
  return (
    !!instance &&
    typeof instance === 'object' &&
    instance instanceof BaseHelper &&
    'removeSnapGuides' in instance &&
    'updateSnapGuides' in instance &&
    instance.mode === 'snap_guides' &&
    typeof instance.removeSnapGuides === 'function' &&
    typeof instance.updateSnapGuides === 'function'
  );
};

export const isAutoTraceHelper = (instance: unknown): instance is AutoTraceHelperInterface => {
  return (
    !!instance &&
    typeof instance === 'object' &&
    instance instanceof BaseHelper &&
    'getShortestPath' in instance &&
    instance.mode === 'auto_trace' &&
    typeof instance.getShortestPath === 'function'
  );
};

export const isPinHelper = (instance: unknown): instance is PinHelperInterface => {
  return (
    !!instance &&
    typeof instance === 'object' &&
    instance instanceof BaseHelper &&
    'getSharedMarkers' in instance &&
    instance.mode === 'pin' &&
    typeof instance.getSharedMarkers === 'function'
  );
};
