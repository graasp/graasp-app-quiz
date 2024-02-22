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
// TODO: update this code to really check if correctly selected
export const verifySelectedMenu = (
  selectedLabelIndex: number,
  labels: { id: string }[]
) => {
  labels.forEach(({ id }) => {
    cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).should(
      'be.visible'
    );
  });
};
