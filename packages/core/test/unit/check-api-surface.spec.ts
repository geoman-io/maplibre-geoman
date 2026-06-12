import { describe, expect, it } from 'vitest';

// @ts-expect-error plain .mjs script without type declarations
import { extractExports } from '../../../../scripts/check-api-surface.mjs';

describe('scripts/check-api-surface extractExports', () => {
  it('captures value and type re-export lines, keeping public alias names', () => {
    const dts = [
      'declare class Geoman {}',
      'declare const styles: Record<string, unknown>;',
      'export { Geoman, styles as defaultLayerStyles };',
      'export type { FeatureId, BaseEventListener$1 as BaseEventListener };',
    ].join('\n');

    expect(extractExports(dts)).toEqual([
      'reexport-type:BaseEventListener',
      'reexport-type:FeatureId',
      'reexport:Geoman',
      'reexport:defaultLayerStyles',
    ]);
  });

  it('captures direct export declarations', () => {
    const dts = [
      'export declare function createGeomanInstance(): void;',
      'export declare class Geoman {}',
      'export declare const SOURCES: Record<string, string>;',
      'export interface GmOptionsData {}',
      'export type ShapeName = string;',
    ].join('\n');

    expect(extractExports(dts)).toEqual([
      'class:Geoman',
      'const:SOURCES',
      'function:createGeomanInstance',
      'interface:GmOptionsData',
      'type:ShapeName',
    ]);
  });

  it('does not record an "export type {" line as a type declaration', () => {
    const dts = 'export type { FeatureId };';
    expect(extractExports(dts)).toEqual(['reexport-type:FeatureId']);
  });
});
