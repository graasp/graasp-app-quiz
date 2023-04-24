import {
  AUTO_SCROLLABLE_MENU_LINK_LIST_CY,
  TABLE_BY_USER_ANSWER_DATA_CY,
  TABLE_BY_USER_CORRECT_ICON_CY,
  TABLE_BY_USER_DATE_DATA_CY,
  TABLE_BY_USER_ENTRY_CY,
  TABLE_BY_USER_QUESTION_NAME_HEADER_CY,
  buildAutoScrollableMenuLinkCy,
  buildTableByUserAnswerHeaderCy,
  buildTableByUserCorrectHeaderCy,
  buildTableByUserCy,
  buildTableByUserDateHeaderCy,
  buildTableByUserQuestionHeaderCy,
  buildTableByUserTableBodyCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import theme from '../../../../src/layout/theme';
import { APP_DATA, APP_DATA_3 } from '../../../fixtures/appData';
import { APP_SETTINGS_2, APP_SETTINGS_3 } from '../../../fixtures/appSettings';
import { USER_RESPONSES } from '../../../fixtures/tableByUserResponses';
import { hexToRGB } from '../../../utils/Color';

describe('Table by User', () => {
  /**
   * Test the table by user view for a few question and some user answers
   */
  it('Table by Question correctly display data', () => {
    cy.setupResultTablesByUserForCheck(APP_SETTINGS_2, APP_DATA);

    // Test that each table are correctly displayed
    getUserFromAppData(APP_DATA).forEach((uId) => {
      cy.get(dataCyWrapper(buildTableByUserCy(uId))).should('have.text', uId);

      // test header
      testTableHeader(uId, 'sorted ascending');
      // test content
      testTableContent(uId, true);

      // sort descending
      cy.get(dataCyWrapper(buildTableByUserQuestionHeaderCy(uId))).click();

      // test header
      testTableHeader(uId, 'sorted descending');
      // test content
      testTableContent(uId, false);
    });
  });

  /**
   * Test that the link in the left menu are ordered in the same way as the users
   */
  it('Menu on left correctly display question title, in the correct order', () => {
    cy.setupResultTablesByUserForCheck(APP_SETTINGS_2, APP_DATA);

    // retrieved the users
    const orderedUser = [...getUserFromAppData(APP_DATA)];

    cy.get(dataCyWrapper(AUTO_SCROLLABLE_MENU_LINK_LIST_CY))
      .children('a')
      .each((elem, idx) => {
        cy.wrap(elem).find('p').should('have.text', orderedUser[idx]);
      });
  });

  /**
   * Test that when clicking on a link, the table become visible
   */
  it('Click on menu goes to question', () => {
    // Enough mock-user in APP_DATA2 to ensure that when one table is visible, all others are hidden
    cy.setupResultTablesByUserForCheck(APP_SETTINGS_3, APP_DATA_3);

    const orderedUser = getUserFromAppData(APP_DATA_3);

    orderedUser.forEach((elem, i) => {
      // click on the link
      cy.get(
        dataCyWrapper(buildAutoScrollableMenuLinkCy(elem.replaceAll(' ', '-')))
      ).click();

      // check that the table is visible ( allow 1s to fetch it, as it may take some times to scroll there)
      cy.get(dataCyWrapper(buildTableByUserCy(elem))).should('be.visible');

      // check that other element are not visible
      orderedUser.forEach((el, idx) => {
        if (idx !== i) {
          cy.get(dataCyWrapper(buildTableByUserCy(el))).should(
            'not.be.visible'
          );
        }
      });
    });
  });

  /**
   * Test that when we scroll, the correct link becomes selected
   */
  it('Scroll to table correctly display selected link', () => {
    cy.setupResultTablesByUserForCheck(APP_SETTINGS_3, APP_DATA_3);

    const rgbBorderColor = hexToRGB(theme.palette.primary.main);

    const orderedUser = getUserFromAppData(APP_DATA_3);

    orderedUser.forEach((elem, i) => {
      // Scroll element into view
      cy.get(dataCyWrapper(buildTableByUserCy(elem))).scrollIntoView();

      // check that the correct link appear as selected
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(elem))).should(
        'have.css',
        'border-color',
        rgbBorderColor
      );

      // check that other border are transparent
      orderedUser.forEach((el, idx) => {
        if (idx !== i) {
          cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(el))).should(
            'have.css',
            'border-color',
            'rgba(0, 0, 0, 0)'
          );
        }
      });
    });
  });
});

/**
 * Helper function to test that the header of the table is correct
 *
 * @param {string} uId The user id
 * @param {string} ascending Suffix to add to User whether it is sorted ascending or descending
 */
const testTableHeader = (uId, ascending) => {
  cy.get(dataCyWrapper(buildTableByUserQuestionHeaderCy(uId))).should(
    'have.text',
    `Question${ascending}`
  );
  cy.get(dataCyWrapper(buildTableByUserAnswerHeaderCy(uId))).should(
    'have.text',
    'Answer'
  );
  cy.get(dataCyWrapper(buildTableByUserDateHeaderCy(uId))).should(
    'have.text',
    'Date'
  );
  cy.get(dataCyWrapper(buildTableByUserCorrectHeaderCy(uId))).should(
    'have.text',
    'Correct'
  );
};

/**
 * Extract all user from app data
 */
const getUserFromAppData = (appData) => {
  return new Set(appData.map((data) => data.memberId));
};

/**
 * Helper function to test that the content of the table is correct
 *
 * @param {string} uId The user id for which we currently are displaying the data
 * @param {boolean} ascending Whether the current sorting order is ascending or descending
 */
const testTableContent = (uId, ascending) => {
  /**
   * Helper function to return the index of the user for which to check the response from,
   *
   * The function is different depending on whether the data is sorted ascending or descending,
   * this is to enforce ordering of entry sorted by user id.
   *
   * @param n the current index when iterating through each child
   * @param length the length of the array we are indexing
   */
  const index = ascending ? (n, _) => n : (n, length) => length - 1 - n;

  cy.get(dataCyWrapper(buildTableByUserTableBodyCy(uId)))
    .children(dataCyWrapper(TABLE_BY_USER_ENTRY_CY))
    .each((entry, idx) => {
      // Test the header (i.e. the userId)
      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_USER_QUESTION_NAME_HEADER_CY), {
          withinSubject: entry,
        })
        .should(
          'have.text',
          USER_RESPONSES[uId][index(idx, USER_RESPONSES[uId].length)].qName
        );

      // Test the answer to the question
      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_USER_ANSWER_DATA_CY), {
          withinSubject: entry,
        })
        .should(
          'have.text',
          USER_RESPONSES[uId][index(idx, USER_RESPONSES[uId].length)].fields
            .answer
        );

      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_USER_DATE_DATA_CY), {
          withinSubject: entry,
        })
        .should(
          'have.text',
          USER_RESPONSES[uId][index(idx, USER_RESPONSES[uId].length)].fields
            .date
        );

      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_USER_CORRECT_ICON_CY), {
          withinSubject: entry,
        })
        .find('svg')
        .should(
          'have.attr',
          'data-testid',
          USER_RESPONSES[uId][index(idx, USER_RESPONSES[uId].length)].fields
            .icon
        );
    });
};
