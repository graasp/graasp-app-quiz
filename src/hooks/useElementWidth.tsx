import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook to calculate the width of a given element dynamically upon window resize
 *
 * @param {HTMLElement} elem The element from which to get the width
 * @return {number} The width of the element
 */
export const useElementWidth = (elem: HTMLElement | null) => {
  const windowResizeCallback = useCallback(
    (callback: (this: Window, ev: UIEvent) => unknown) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    []
  );

  return useSyncExternalStore(
    windowResizeCallback,
    () => elem?.offsetWidth ?? 0
  );
};
