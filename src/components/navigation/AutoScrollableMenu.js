import { useEffect, useRef, useState } from 'react';

import { Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { AUTO_SCROLLABLE_HOVER_COLOR } from '../../config/constants';
import {
  AUTO_SCROLLABLE_MENU_LINK_LIST,
  buildAutoScrollableMenuLinkCy,
} from '../../config/selectors';

/**
 * Restyled link
 */
const AutoScrollableLink = styled(Link)(({ theme, isHighlighted }) => {
  const condStyle = isHighlighted
    ? {
        borderColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.main,
        },
      }
    : {
        borderColor: 'transparent',
        '&:hover': {
          color: AUTO_SCROLLABLE_HOVER_COLOR,
          borderColor: AUTO_SCROLLABLE_HOVER_COLOR,
        },
      };

  return {
    color: theme.palette.text.primary,
    maxWidth: '150px',
    padding: theme.spacing(1),
    textDecoration: 'none',
    borderWidth: '2px',
    borderRightStyle: 'solid',
    ...condStyle,
  };
});

/**
 * A component that serve as a menu, that is used to easily navigate between different element of a page,
 * And follow the position of the user on the page to let him know where he is.
 *
 * @param {MutableRefObject<null>} containerRef The element to use as parent for the observer pattern
 * @param {MutableRefObject<{}>} elemRefs A list of element stored as an object, those element will be observed
 * for intersection with the parent element
 * @param {{label: string, link: string}[]} links The list of the elements we want to add to this menu
 */
const AutoScrollableMenu = ({ containerRef, elemRefs, links }) => {
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
   */
  const clickedLink = useRef(null);

  /**
   * register call back to listen for intersection with the received elements
   */
  useEffect(() => {
    const observerOption = {
      root: containerRef?.current,
      rootMargin: '0px',
      threshold: 0.25,
    };
    const intersectionCallback = (entries) => {
      const newVisibility = entries.reduce((obj, elm) => {
        return {
          ...obj,
          [elm.target.id]: elm.isIntersecting,
        };
      }, {});
      setQuestionVisibility((prev) => {
        return { ...prev, ...newVisibility };
      });
    };
    const observer = new IntersectionObserver(
      intersectionCallback,
      observerOption
    );
    Object.entries(elemRefs.current).forEach(([, value]) =>
      observer.observe(value)
    );

    // disconnect all observed value upon destruction of component
    return () => {
      observer.disconnect();
    };
  }, [elemRefs, containerRef]);

  /**
   * Subscribe to scroll event to be able to determine when we stop scrolling to set the correct clicked item
   * if the scroll has been triggered by a click event
   */
  useEffect(() => {
    // store ref, to be able to remove listener when component is destroyed
    const ref = containerRef.current;
    const endScrollCallback = () => {
      setHighlightedLink(clickedLink.current);
      clickedLink.current = null; // set back the clicked item to null once set
    };

    // If an item as been clicked, the link won't be null, and we will set a timeout
    // to set the clicked link as clicked when scroll end (i.e. we reached the bottom)
    // create a new timeout each 100ms as long as we keep scrolling
    const callback = () => {
      if (clickedLink.current !== null) {
        clearTimeout(window?.scrollEndTimer);
        window.scrollEndTimer = setTimeout(endScrollCallback, 100);
      }
    };
    ref.addEventListener('scroll', callback);

    // remove the listener upon destruction of component
    return () => {
      ref.removeEventListener('scroll', callback);
    };
  }, [containerRef]);

  /**
   * update the highlighted link whenever the question visibility changes
   */
  useEffect(() => {
    if (questionVisibility !== undefined) {
      const e = Object.entries(questionVisibility).find(([, value]) => value);
      if (e !== undefined) {
        setHighlightedLink(e[0]);
      }
    }
  }, [questionVisibility]);

  /**
   * Helper function to handle the click on a link
   *
   * We already start a timeout upon clicking, to handle scenario where no scroll is required to
   * reach an element, to be sure that the element we clicked on appears as selected
   *
   * @param {string} link The label of the question we clicked on
   */
  const handleLinkClicked = (link) => {
    clickedLink.current = link;
    const clickCallback = () => {
      setHighlightedLink(link);
      clickedLink.current = null; // set back the clicked item to null once set
    };

    window.scrollEndTimer = setTimeout(clickCallback, 100);
  };

  return (
    <Stack data-cy={AUTO_SCROLLABLE_MENU_LINK_LIST}>
      {links.map(({ label, link }) => {
        return (
          <AutoScrollableLink
            isHighlighted={highlightedLink === link}
            key={label}
            href={`#${link}`}
            onClick={() => handleLinkClicked(link)}
            data-cy={buildAutoScrollableMenuLinkCy(label)}
          >
            <Typography>{label}</Typography>
          </AutoScrollableLink>
        );
      })}
    </Stack>
  );
};

export default AutoScrollableMenu;
