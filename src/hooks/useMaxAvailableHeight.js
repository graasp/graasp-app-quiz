import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook to calculate the available height to display an element on the screen to avoid overflow
 *
 * It will dynamically calculate the height of both the above element and the element below, and
 * subtract their height from the height of the viewport.
 *
 * @param elemAbove The element above the element, null by default (i.e. no element above)
 * @param elemBelow The element below the element, null by default (i.e. no element below)
 * @return {number} the maximum available height for the current element to display without overflow
 */
export const useMaxAvailableHeight = (elemAbove = null, elemBelow = null) => {
  /**
   * Helper function to calculate the full height of an element, take margin into account
   */
  const getElemFullHeight = useCallback((elem) => {
    if (elem === undefined) return 0;
    const elemStyle = getComputedStyle(elem);
    return (
      elem.offsetHeight +
      parseInt(elemStyle.marginTop) +
      parseInt(elemStyle.marginBottom)
    );
  }, []);

  /**
   * Memorise the elem above callback function, to avoid subscribing and unsubscribing everytime the
   * hook is called
   */
  const elemAboveCallback = useCallback(
    (callback) => {
      elemAbove?.current.addEventListener('resize', callback);
      return () => elemAbove?.current.removeEventListener('resize', callback);
    },
    [elemAbove]
  );

  /**
   * Stores the height of the header, dynamically updated if it is resized
   */
  const elemAboveHeight = useSyncExternalStore(elemAboveCallback, () => {
    return getElemFullHeight(elemAbove?.current);
  });

  /**
   * Memorise the elem below callback function, to avoid subscribing and unsubscribing everytime the
   * hook is called
   */
  const elemBelowCallback = useCallback(
    (callback) => {
      elemBelow?.current.addEventListener('resize', callback);
      return () => elemBelow?.current.removeEventListener('resize', callback);
    },
    [elemBelow]
  );

  /**
   * Stores the height of the header, dynamically updated if it is resized
   */
  const elemBelowHeight = useSyncExternalStore(elemBelowCallback, () => {
    return getElemFullHeight(elemBelow?.current);
  });

  /**
   * Memorise the windows callback function, to avoid subscribing and unsubscribing everytime the
   * hook is called
   */
  const windowCallback = useCallback((callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  }, []);

  /**
   * Stores the height of the viewport, dynamically updated if it is resized
   */
  const windowHeight = useSyncExternalStore(windowCallback, () => {
    return window.innerHeight;
  });

  // 16 is en empirical value, that allow to have the biggest height possible without showing scroll bar
  return windowHeight - elemAboveHeight - elemBelowHeight - 16;
};
