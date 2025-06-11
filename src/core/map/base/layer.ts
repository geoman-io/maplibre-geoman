import log from 'loglevel';


export abstract class BaseLayer<TLayerInstance = unknown> {
  abstract layerInstance: TLayerInstance | null;

  abstract get id(): string;

  abstract get source(): string;

  abstract createLayer(options: unknown): TLayerInstance;

  abstract remove(): void;

  isInstanceAvailable(): this is { layerInstance: TLayerInstance } {
    if (this.layerInstance) {
      return true;
    }

    log.error('layerInstance is not available');
    return false;
  }
}
