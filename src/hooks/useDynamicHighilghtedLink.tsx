import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { MultipleRefs } from '../components/types/types';

/**
 * Custom hook to extract the logic behind the highlighted link in the AutoScrollableMenu
 *
 * This hook allow to determine which link should be highlighted based on two inputs, that are computed from within
 * the hook based on the two hook argument and the `clickOnLink` function.
 *
 *  - The first input is the menu link on which we clicked when we click on one link. The clicked link
 *    will be set by calling the return method `clickOnLink`.
 *  - The second input is the highest object from the `elemRefs` list visible inside the `containerRef` element.
 *    Those element will be observed for changes upon scroll, and `highlightedLink` will be automatically updated.
 *
 * @param {MutableRefObject<null>} containerRef The element to use as parent for the observer pattern
 * @param {MutableRefObject<Element>} elemRefs A list of element stored as an object, those element will be observed
 * for intersection with the parent element
 * @param triggerVal Value to pass, to manually re-trigger the hook, as Ref do not change, if its value changed
 * from outside, the useEffect won't be triggered automatically, in some cases, we might want to change it and
 * trigger again the observable, pass a different triggerVal to achieve this behavior.
 * @return {[string, (link: String) => void]} An array containing two elements
 *
 *  - elem 1 (highlightedLink): This is the link that is currently highlighted
 *  - elem 2 (clickOnLink): This is a function to click on a link (i.e. the link we want to be highlighted next).
 */
export const useDynamicHighlightedLink = (
  containerRef: MutableRefObject<null | HTMLElement>,
  elemRefs: MultipleRefs<HTMLElement>,
  triggerVal?: number
): [string, (link: string) => void] => {
  /**
   * Store the link that is currently highlighted
   */
  const [highlightedLink, setHighlightedLink] = useState('');
  /**
   * Store an object that contains every link, and whether they are currently visible or not.
   * This object will be used to display which link is currently highlighted, whenever this object change
   * select the first visible link and set it as highlighted
   */
  const [questionVisibility, setQuestionVisibility] = useState({});
  /**
   * Store the value of the last clicked value.
   * Store it in a useRef to avoid registering and unregistering a new callback on the scroll event
   * every time we click on a link
   * @type MutableRefObject<String>
   */
  const clickedLink = useRef<string | null>(null);

  type IntersectionObserverEntry = {
    target: Element;
    isIntersecting: boolean;
  };

  /**
   * register call back to listen for intersection with the received elements
   */
  useEffect(() => {
    const observerOption = {
      root: containerRef?.current,
      rootMargin: '0px',
      threshold: 0.25,
    };
    const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
      const newVisibility = entries.reduce(
        (obj, elm) => ({
          ...obj,
          [elm.target.id]: elm.isIntersecting,
        }),
        {}
      );
      setQuestionVisibility((prev) => ({ ...prev, ...newVisibility }));
    };
    const observer = new IntersectionObserver(
      intersectionCallback,
      observerOption
    );
    Object.entries(elemRefs.current).forEach(([, value]) => {
      if (value) {
        observer.observe(value);
      }
    });

    // disconnect all observed value upon destruction of component
    return () => {
      setQuestionVisibility({}); // reset visibility so its ready again for new elements
      observer.disconnect();
    };
  }, [elemRefs, containerRef, triggerVal]);

  /**
   * Subscribe to scroll event to be able to determine when we stop scrolling to set the correct clicked item
   * if the scroll has been triggered by a click event
   */
  useEffect(() => {
    // store ref, to be able to remove listener when component is destroyed
    const ref = containerRef.current;
    const endScrollCallback = () => {
      if (clickedLink.current) {
        setHighlightedLink(clickedLink.current);
        clickedLink.current = null; // set back the clicked item to null once set
      }
    };

    // If an item as been clicked, the link won't be null, and we will set a timeout
    // to set the clicked link as clicked when scroll end (i.e. we reached the bottom)
    // create a new timeout each 100ms as long as we keep scrolling
    const scrollCallback = () => {
      if (clickedLink.current !== null) {
        clearTimeout(window?.scrollEndTimer);
        window.scrollEndTimer = setTimeout(endScrollCallback, 100);
      }
    };

    // If an item is selected, but the user scroll manually, we want the user's scroll effect to take
    // over, and we set the clicked link to null, and clear the timeout.
    // This prevents from inconsistent behaviour
    const wheelCallback = () => {
      if (clickedLink.current !== null) {
        clickedLink.current = null;
        clearTimeout(window?.scrollEndTimer);
      }
    };

    if (ref) {
      ref.addEventListener('scroll', scrollCallback);
      ref.addEventListener('wheel', wheelCallback);
    }

    // remove the listener upon destruction of component
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', scrollCallback);
        ref.removeEventListener('wheel', wheelCallback);
      }
    };
  }, [containerRef, triggerVal]);

  /**
   * update the highlighted link whenever the question visibility changes
   */
  useEffect(() => {
    if (questionVisibility) {
      const e = Object.entries(questionVisibility).find(([, value]) => value);
      if (e !== undefined) {
        setHighlightedLink(e[0]);
      }
    }
  }, [questionVisibility]);

  /**
   * A function to call when we click on a link, to set it as highlighted
   */
  const clickOnLink = useCallback((link: string) => {
    clickedLink.current = link;
    const clickCallback = () => {
      setHighlightedLink(link);
      clickedLink.current = null; // set back the clicked item to null once set
    };

    window.scrollEndTimer = setTimeout(clickCallback, 100);
  }, []);

  return [highlightedLink, clickOnLink];
};
