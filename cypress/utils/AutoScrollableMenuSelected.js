import {
  buildAutoScrollableMenuLinkCy,
  dataCyWrapper,
} from '../../src/config/selectors';
import theme from '../../src/layout/theme';
import { hexToRGB } from './Color';

/**
 * Helper function, to test that the selected label is correctly selected, and that the others are not selected
 *
 * @param selectedLabelIndex The index of the label to be selected
 * @param {[{ label: String }]} labels The list of all labels
 */
export const verifySelectedMenu = (selectedLabelIndex, labels) => {
  const rgbBorderColor = hexToRGB(theme.palette.primary.main);

  labels.forEach(({ label }, index) => {
    if (selectedLabelIndex === index) {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(label))).should(
        'have.css',
        'border-color',
        rgbBorderColor
      );
    } else {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(label))).should(
        'have.css',
        'border-color',
        'rgba(0, 0, 0, 0)'
      );
    }
  });
};
