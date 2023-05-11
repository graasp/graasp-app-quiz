import { useCallback, useSyncExternalStore } from 'react';

/**
 * Custom hook to calculate dynamically the maximum height that an element can take in the window, the element
 * can optionally have an element above and below
 *
 * It will dynamically calculate the height of both the above element and the element below, and
 * subtract their height from the height of the viewport.
 *
 * @param {HTMLElement} elemAbove The element above the element, null by default (i.e. no element above)
 * @param {HTMLElement} elemBelow The element below the element, null by default (i.e. no element below)
 * @return {number} the maximum available height for the current element to display without overflow
 */
export const useMaxAvailableHeightInWindow = (
  elemAbove = null,
  elemBelow = null
) => {
  const maxHeight = useTotalDynamicHeight(elemAbove, elemBelow);

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

  return windowHeight - maxHeight;
};

/**
 * Custom hook to calculate dynamically the maximum height that an element can take in a parent, the element
 * can optionally have an element above and below
 *
 * It will dynamically calculate the height of both the above element and the element below, and
 * subtract their height from the height of the parent.
 *
 * @param {number} parentHeight The height of the parent in which we want to place the component
 * @param {HTMLElement} elemAbove The element above the element, null by default (i.e. no element above)
 * @param {HTMLElement} elemBelow The element below the element, null by default (i.e. no element below)
 * @return {number} the maximum available height for the current element to display without overflow
 */
export const useMaxAvailableHeightWithParentHeight = (
  parentHeight,
  elemAbove = null,
  elemBelow = null
) => {
  const maxHeight = useTotalDynamicHeight(elemAbove, elemBelow);

  return parentHeight - maxHeight;
};

/**
 * Helper hook to calculate dynamically the total height taken by the two element passed in parameter
 *
 * @param {HTMLElement} elemAbove The element above the element, null by default (i.e. no element above)
 * @param {HTMLElement} elemBelow The element below the element, null by default (i.e. no element below)
 * @return {number} the total height of the above and below element.
 */
const useTotalDynamicHeight = (elemAbove = null, elemBelow = null) => {
  /**
   * Memorise the elem above callback function, to avoid subscribing and unsubscribing everytime the
   * hook is called
   */
  const elemAboveCallback = useCallback(
    (callback) => {
      elemAbove?.addEventListener('resize', callback);
      return () => elemAbove?.removeEventListener('resize', callback);
    },
    [elemAbove]
  );

  /**
   * Stores the height of the header, dynamically updated if it is resized
   */
  const elemAboveHeight = useSyncExternalStore(elemAboveCallback, () => {
    return getElemFullHeight(elemAbove);
  });

  /**
   * Memorise the elem below callback function, to avoid subscribing and unsubscribing everytime the
   * hook is called
   */
  const elemBelowCallback = useCallback(
    (callback) => {
      elemBelow?.addEventListener('resize', callback);
      return () => elemBelow?.removeEventListener('resize', callback);
    },
    [elemBelow]
  );

  /**
   * Stores the height of the header, dynamically updated if it is resized
   */
  const elemBelowHeight = useSyncExternalStore(elemBelowCallback, () => {
    return getElemFullHeight(elemBelow);
  });

  // 16 is en empirical value, that allow to have the biggest height possible without showing scroll bar
  return elemAboveHeight + elemBelowHeight + 16;
};

/**
 * Function to calculate the full height of an element, take margin into account
 *
 * @param {HTMLElement} elem The html element from which we want to calculate the full height
 */
const getElemFullHeight = (elem) => {
  if (!elem) return 0;
  const elemStyle = getComputedStyle(elem);
  return (
    elem.offsetHeight +
    parseInt(elemStyle.marginTop) +
    parseInt(elemStyle.marginBottom)
  );
};
