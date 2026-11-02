import { FEATURE_ID_PROPERTY } from '@/core/features/constants.ts';
import type { Geoman } from '@/main.ts';
import { BaseDraw } from '@/modes/draw/base.ts';
import type { DrawDraft, DrawInput, DrawResult } from '@/types/draw-api.ts';
import type { EventHandlers, MapHandlerReturnData } from '@/types/events/bus.ts';
import type { DrawModeName, ShapeName } from '@/types/modes/index.ts';
import { buildDrawFeature, isCompleteDrawFeature } from '@/utils/draw-input.ts';
import { cloneDeep } from 'lodash-es';

/** A validation context that never starts a UI mode or registers pointer handlers. */
class InputDraw extends BaseDraw {
  mode: DrawModeName;
  shape: ShapeName;
  eventHandlers: EventHandlers = {};
  constructor(gm: Geoman, shape: DrawInput['shape']) {
    super(gm);
    this.mode = shape;
    this.shape = shape;
  }
  onStartAction() {}
  onEndAction() {}
}

/** Create form-defined shapes and commit existing circle, marker, or rectangle drawings. */
export class GmDrawApi {
  private pending = false;
  private interactions = 0;
  constructor(private readonly gm: Geoman) {}

  /** @internal Excludes in-flight pointer handlers from programmatic commits. */
  async runInteraction(
    callback: () => MapHandlerReturnData | Promise<MapHandlerReturnData>,
  ): Promise<MapHandlerReturnData> {
    if (this.pending) return { next: false };
    this.interactions += 1;
    try {
      return await callback();
    } finally {
      this.interactions -= 1;
    }
  }

  /** Create one completed feature without enabling drawing. Rejects an active draw. */
  create(input: DrawInput): Promise<DrawResult> {
    return this.commit(input, false);
  }

  /** Commit the current preview, or replace it with a complete matching input, then disable drawing. */
  finish(input?: DrawInput): Promise<DrawResult> {
    return this.commit(input, true);
  }

  /**
   * Placed vertices of the in-progress line or polygon, or null when nothing is
   * being drawn. Does not include the cursor preview (#268).
   */
  getDraft(): DrawDraft | null {
    const drawer = this.activeLineDrawer();
    if (!drawer?.featureData || drawer.shapeLngLats.length === 0) return null;
    return {
      shape: drawer.drawOptions.targetShape,
      coordinates: drawer.shapeLngLats.map((coordinate) => [coordinate[0], coordinate[1]]),
    };
  }

  /**
   * Remove the last placed vertex, the same action as the keyboard binding.
   * Returns false when no line or polygon is in progress.
   */
  removeLastVertex(): Promise<boolean> {
    const drawer = this.activeLineDrawer();
    if (!drawer?.featureData) return Promise.resolve(false);
    return drawer.removeLastVertex();
  }

  private activeLineDrawer(): {
    featureData: unknown;
    shapeLngLats: Array<[number, number]>;
    drawOptions: { targetShape: ShapeName };
    removeLastVertex: () => Promise<boolean>;
  } | null {
    for (const instance of Object.values(this.gm.actionInstances)) {
      if (!instance || !('lineDrawer' in instance)) continue;
      const drawer = instance.lineDrawer;
      if (
        drawer &&
        typeof drawer === 'object' &&
        'featureData' in drawer &&
        drawer.featureData &&
        'shapeLngLats' in drawer &&
        Array.isArray(drawer.shapeLngLats) &&
        'drawOptions' in drawer &&
        drawer.drawOptions &&
        typeof drawer.drawOptions === 'object' &&
        'targetShape' in drawer.drawOptions &&
        'removeLastVertex' in drawer &&
        typeof drawer.removeLastVertex === 'function'
      ) {
        return drawer as {
          featureData: unknown;
          shapeLngLats: Array<[number, number]>;
          drawOptions: { targetShape: ShapeName };
          removeLastVertex: () => Promise<boolean>;
        };
      }
    }
    return null;
  }

  private async commit(input: DrawInput | undefined, finishing: boolean): Promise<DrawResult> {
    if (this.gm.destroyed) return { ok: false, reason: 'destroyed' };
    if (!this.gm.loaded) return { ok: false, reason: 'not_loaded' };
    if (this.pending || this.interactions > 0) return { ok: false, reason: 'busy' };
    this.pending = true;
    let context: InputDraw | undefined;
    try {
      const modes = this.gm.getActiveDrawModes();
      if (!finishing && modes.length) return { ok: false, reason: 'active_draw' };
      if (finishing && !modes.length) return { ok: false, reason: 'no_active_draw' };
      if (modes.length > 1) return { ok: false, reason: 'busy' };
      const active = finishing ? this.gm.actionInstances[`draw__${modes[0]}`] : undefined;
      if (finishing && !(active instanceof BaseDraw))
        return { ok: false, reason: 'no_active_draw' };
      const shape = finishing ? modes[0] : input?.shape;
      if (shape !== 'circle' && shape !== 'rectangle' && shape !== 'marker') {
        return { ok: false, reason: 'unsupported_shape' };
      }
      if (finishing && input !== undefined && input?.shape !== shape)
        return { ok: false, reason: 'shape_mismatch' };
      const candidate =
        input !== undefined
          ? buildDrawFeature(input)
          : active instanceof BaseDraw
            ? active.getFinishGeoJson()
            : null;
      if (!candidate || !isCompleteDrawFeature(candidate)) {
        return { ok: false, reason: input !== undefined ? 'invalid_input' : 'incomplete_draft' };
      }
      // Validation helpers report violations to this context, without touching the live draft's flags.
      context = new InputDraw(this.gm, shape);
      this.gm.events.bus.attachEvents(context.internalEventHandlers);
      const geoJson = cloneDeep(candidate);
      // A preview is still registered under its temporary id. Allocate a new persistent id.
      delete geoJson.id;
      delete geoJson.properties[FEATURE_ID_PROPERTY];
      await context.fireBeforeFeatureCreate({ geoJsonFeatures: [geoJson] });
      if (!context.flags.featureCreateAllowed || !isCompleteDrawFeature(geoJson)) {
        return { ok: false, reason: 'creation_rejected' };
      }
      // A validation listener may destroy the map or change the active draw.
      if (this.gm.destroyed) return { ok: false, reason: 'destroyed' };
      if (finishing && this.gm.actionInstances[`draw__${shape}`] !== active) {
        return { ok: false, reason: 'no_active_draw' };
      }
      if (!finishing && this.gm.getActiveDrawModes().length)
        return { ok: false, reason: 'active_draw' };
      const feature = await context.commitFeature(geoJson);
      if (!feature) return { ok: false, reason: 'creation_rejected' };
      // Disabling removes the old scratch feature and emits the existing finish event once.
      if (finishing) await this.gm.disableMode('draw', shape);
      return { ok: true, feature };
    } finally {
      if (context) this.gm.events.bus.detachEvents(context.internalEventHandlers);
      this.pending = false;
    }
  }
}
