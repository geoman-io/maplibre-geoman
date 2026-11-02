/**
 * End a map drag when the pointer is released outside the map canvas.
 * Map `mouseup` does not fire over an overlay or a Geoman control (#269).
 *
 * Releases whose target is the map canvas are ignored here so the map handler
 * still runs with a real point (selection clicks). Controls live in the map
 * container but outside the canvas, so they still end the drag.
 */
export const bindWindowPointerRelease = (
  onRelease: () => void,
  mapCanvas?: Element | null,
): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    if (
      event.type !== 'blur' &&
      mapCanvas &&
      event.target instanceof Node &&
      (event.target === mapCanvas || mapCanvas.contains(event.target))
    ) {
      return;
    }
    onRelease();
  };
  window.addEventListener('mouseup', listener, true);
  window.addEventListener('touchend', listener, true);
  window.addEventListener('pointerup', listener, true);
  window.addEventListener('pointercancel', listener, true);
  window.addEventListener('blur', listener);
  return () => {
    window.removeEventListener('mouseup', listener, true);
    window.removeEventListener('touchend', listener, true);
    window.removeEventListener('pointerup', listener, true);
    window.removeEventListener('pointercancel', listener, true);
    window.removeEventListener('blur', listener);
  };
};
