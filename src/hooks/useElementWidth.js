import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook to calculate the width of a given element dynamically upon window resize
 *
 * @param {HTMLElement} elem The element from which to get the width
 * @return {number} The width of the element
 */
export const useElementWidth = (elem) => {
  const windowResizeCallback = useCallback((callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, []);

  return useSyncExternalStore(windowResizeCallback, () => {
    return elem?.offsetWidth ?? 0;
  });
};
