import { useEffect } from 'react';

import { Link, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { AUTO_SCROLLABLE_HOVER_COLOR } from '../../config/constants';
import {
  AUTO_SCROLLABLE_MENU_LINK_LIST_CY,
  buildAutoScrollableMenuLinkCy,
} from '../../config/selectors';
import { useDynamicHighlightedLink } from '../../hooks/useDynamicHighilghtedLink';

/**
 * Restyled link
 */
const AutoScrollableLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isHighlighted',
})(({ theme, isHighlighted }) => {
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
 * @param {MutableRefObject<null>} initiallyClickedId The id of the link to click on when, wrapped in a `MutableRefObject`
 * so that we can reset its value directly after having click on it (without triggering a re-render),
 * so that it doesn't always go there upon re-render
 * @param triggerVal Value to pass, to manually re-trigger the `DynamicHighlightedLink` hook, if no value passed,
 * the hook will only be triggered once upon component creation
 */
const AutoScrollableMenu = ({
  containerRef,
  elemRefs,
  links,
  initiallyClickedId,
  triggerVal,
}) => {
  const [highlightedLink, clickOnLink] = useDynamicHighlightedLink(
    containerRef,
    elemRefs,
    triggerVal
  );

  /**
   * Helper function to handle the click on a link
   *
   * We already start a timeout upon clicking, to handle scenario where no scroll is required to
   * reach an element, to be sure that the element we clicked on appears as selected
   *
   * @param {string} link The label of the question we clicked on
   */
  const handleLinkClicked = (link) => {
    clickOnLink(link);
  };

  // If there is an initial value, click on it to directly go to it
  useEffect(() => {
    if (initiallyClickedId?.current) {
      document.getElementById(initiallyClickedId.current).scrollIntoView(true);
      clickOnLink(initiallyClickedId.current);

      // once set, reset the initialClicked to null
      // as it is a ref, it won't re-render the component
      initiallyClickedId.current = null;
    }
  }, [initiallyClickedId, clickOnLink]);

  return (
    <Stack data-cy={AUTO_SCROLLABLE_MENU_LINK_LIST_CY}>
      {links?.map(({ label, id, link }) => {
        const isHighlighted = highlightedLink === link;
        return (
          <AutoScrollableLink
            isHighlighted={isHighlighted}
            key={label}
            href={`#${link}`}
            onClick={() => handleLinkClicked(link)}
            data-cy={buildAutoScrollableMenuLinkCy(id, isHighlighted)}
          >
            <Typography>{label}</Typography>
          </AutoScrollableLink>
        );
      })}
    </Stack>
  );
};

export default AutoScrollableMenu;
