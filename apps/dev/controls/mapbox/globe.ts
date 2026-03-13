import type { IControl, Map } from 'mapbox-gl';
import { CONTROL_GROUP_CLASS } from '@mapLib/constants.ts';

export class MapboxGlobeControl implements IControl {
  private map?: Map;
  private container?: HTMLElement;
  public static controlClass = 'mapboxgl-ctrl-globe';

  onAdd(map: Map): HTMLElement {
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = `${CONTROL_GROUP_CLASS} ${MapboxGlobeControl.controlClass}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'Toggle Globe Projection';
    button.innerHTML = '🌐';

    button.onclick = () => {
      const currentProj = this.map?.getProjection().name;
      this.map?.setProjection(currentProj === 'globe' ? 'mercator' : 'globe');
    };

    this.container.appendChild(button);
    return this.container;
  }

  onRemove(): void {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}
