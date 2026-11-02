/**
 * End a map drag when the pointer is released outside the map canvas.
 * Map `mouseup` does not fire over an overlay or a control button (#269).
 * Capture phase still sees that release; the caller must ignore a second call.
 */
export const bindWindowPointerRelease = (onRelease: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const listener = () => onRelease();
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
