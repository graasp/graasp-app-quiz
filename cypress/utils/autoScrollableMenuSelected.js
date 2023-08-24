import {
  buildAutoScrollableMenuLinkCy,
  dataCyWrapper,
} from '../../src/config/selectors';

/**
 * Helper function, to test that the selected label is correctly selected, and that the others are not selected
 *
 * @param selectedLabelIndex The index of the label to be selected
 * @param {[{ label: String }]} labels The list of all labels
 */
export const verifySelectedMenu = (selectedLabelIndex, labels) => {
  labels.forEach(({ id }, index) => {
    cy.get(
      dataCyWrapper(
        buildAutoScrollableMenuLinkCy(id, selectedLabelIndex === index)
      )
    ).should('be.visible');
  });
};
