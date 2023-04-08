import { useEffect, useState } from 'react';

import { Link, Stack, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

import {
  AUTO_SCROLLABLE_MENU_LINK_LIST,
  buildAutoScrollableMenuLinkCy,
} from '../../config/selectors';

/**
 * Base style for the links
 */
const baseLinkStyle = {
  color: 'black',
  maxWidth: '150px',
  padding: '5px',
  textDecoration: 'none',
  borderWidth: '2px',
  borderRightStyle: 'solid',
  borderColor: 'transparent',
  '&:hover': {
    color: '#878383',
    borderColor: '#878383',
  },
};

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
  const theme = useTheme();
  const [highlightedLink, setHighlightedLink] = useState('');
  const [questionVisibility, setQuestionVisibility] = useState({});
  const [clickedItem, setClickedItem] = useState({});

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
      setHighlightedLink(clickedItem.link);
      setClickedItem({}); // set back the clicked item to null once set
    };

    // If an item as been clicked, 'link' property won't be undefined, and we will set a timeout
    // to set the clicked link as clicked when scroll end (i.e. we reached the bottom)
    // create a new timeout each 100ms as long as we keep scrolling
    const callback = () => {
      if (clickedItem.link !== undefined) {
        clearTimeout(window?.scrollEndTimer);
        window.scrollEndTimer = setTimeout(endScrollCallback, 100);
      }
    };
    ref.addEventListener('scroll', callback);

    // remove the listener upon destruction of component
    return () => {
      ref.removeEventListener('scroll', callback);
    };
  }, [containerRef, clickedItem]);

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
   * Helper function to set the correct style to the link given link property
   *
   * @param {string} link the link associated with this question
   * @returns The additional css style to apply to thins link
   */
  const linkSxProp = (link) => {
    return highlightedLink === link
      ? {
          ...baseLinkStyle,
          borderColor: theme.palette.primary.main,
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }
      : baseLinkStyle;
  };

  /**
   * Helper function to handle the click on a link
   *
   * We already start a timeout upon clicking, to handle scenario where no scroll is required to
   * reach an element, to be sure that the element we clicked on appears as selected
   *
   * @param {string} link The label of the question we clicked on
   */
  const handleLinkClicked = (link) => {
    setClickedItem({ link });
    const clickCallback = () => {
      setHighlightedLink(link);
      setClickedItem({}); // set back the clicked item to null once set
    };

    window.scrollEndTimer = setTimeout(clickCallback, 100);
  };

  return (
    <Stack data-cy={AUTO_SCROLLABLE_MENU_LINK_LIST}>
      {links.map(({ label, link }) => {
        return (
          <Link
            key={label}
            href={`#${link}`}
            sx={() => linkSxProp(link)}
            onClick={() => handleLinkClicked(link)}
            data-cy={buildAutoScrollableMenuLinkCy(label)}
          >
            <Typography>{label}</Typography>
          </Link>
        );
      })}
    </Stack>
  );
};

export default AutoScrollableMenu;
