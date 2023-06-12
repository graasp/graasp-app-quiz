import { getSettingsByName } from '../../../../src/components/context/utilities';
import { APP_SETTING_NAMES } from '../../../../src/config/constants';
import {
  AUTO_SCROLLABLE_MENU_LINK_LIST_CY,
  RESULT_TABLES_RESULT_BY_USER_BUTTON_CY,
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
import {
  Order,
  comparatorArrayByElemName,
  getComparator,
} from '../../../../src/utils/tableUtils';
import {
  APP_DATA_FEW_QUESTIONS_FEW_USERS,
  APP_DATA_LOT_QUESTIONS_LOT_USERS,
} from '../../../fixtures/appData';
import {
  APP_SETTINGS_FEW_QUESTIONS,
  APP_SETTINGS_LOT_QUESTIONS,
} from '../../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../../fixtures/members';
import { USER_RESPONSES } from '../../../fixtures/tableByUserResponses';
import { verifySelectedMenu } from '../../../utils/autoScrollableMenuSelected';
import { hexToRGB } from '../../../utils/color';

describe('Table by User', () => {
  /**
   * Test the table by user view for a few question and some user answers
   */
  it('Table by Question correctly display data', () => {
    cy.setupResultTablesByUserForCheck(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_FEW_USERS,
      MEMBERS_RESULT_TABLES
    );

    // Test that each table are correctly displayed
    getUserNamesFromAppData(APP_DATA_FEW_QUESTIONS_FEW_USERS).forEach(
      ({ id, name }) => {
        cy.get(dataCyWrapper(buildTableByUserCy(id))).contains(name, {
          matchCase: false,
        });

        // test header
        testTableHeader(id, 'sorted ascending');
        // test content
        testTableContent(id, true);

        // sort descending
        cy.get(dataCyWrapper(buildTableByUserQuestionHeaderCy(id))).click();

        // test header
        testTableHeader(id, 'sorted descending');
        // test content
        testTableContent(id, false);
      }
    );
  });

  /**
   * Test that the link in the left menu are ordered in the same way as the users
   */
  it('Menu on left correctly display question title, in the correct order', () => {
    cy.setupResultTablesByUserForCheck(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_FEW_USERS,
      MEMBERS_RESULT_TABLES
    );

    // retrieved the users
    const orderedUser = getUserNamesFromAppData(
      APP_DATA_FEW_QUESTIONS_FEW_USERS
    );

    cy.get(dataCyWrapper(AUTO_SCROLLABLE_MENU_LINK_LIST_CY))
      .children('a')
      .each((elem, idx) => {
        cy.wrap(elem).find('p').should('have.text', orderedUser[idx].name);
      });
  });

  /**
   * Test that when clicking on a link, the table become visible
   */
  // bug: click does not transition as expected in cypress
  // it('Click on menu goes to question', () => {
  //   // Enough mock-user to ensure that when one table is visible, all others are hidden
  //   cy.setupResultTablesByUserForCheck(
  //     APP_SETTINGS_LOT_QUESTIONS,
  //     APP_DATA_LOT_QUESTIONS_LOT_USERS,
  //     MEMBERS_RESULT_TABLES
  //   );

  //   const orderedUser = getUserNamesFromAppData(
  //     APP_DATA_LOT_QUESTIONS_LOT_USERS
  //   );

  //   orderedUser.forEach(({ name, id }, i) => {
  //     const lowercaseName = name.toLowerCase();

  //     // click on the link
  //     cy.get(
  //       dataCyWrapper(buildAutoScrollableMenuLinkCy(lowercaseName))
  //     ).click();

  //     // check that the table is visible ( allow 1s to fetch it, as it may take some time to scroll there)
  //     cy.get(dataCyWrapper(buildTableByUserCy(id))).should('be.visible');

  //     // check that other element are not visible
  //     orderedUser.forEach(({ id }, idx) => {
  //       if (idx !== i) {
  //         cy.get(dataCyWrapper(buildTableByUserCy(id))).should(
  //           'not.be.visible'
  //         );
  //       }
  //     });
  //   });
  // });

  /**
   * Test that when we scroll, the correct link becomes selected
   */
  it('Scroll to table correctly display selected link', () => {
    cy.setupResultTablesByUserForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    const orderedUser = getUserNamesFromAppData(
      APP_DATA_LOT_QUESTIONS_LOT_USERS
    );

    orderedUser.forEach(({ id }, i) => {
      // Scroll element into view
      cy.get(dataCyWrapper(buildTableByUserCy(id))).scrollIntoView();

      // check that the correct link appear as selected
      verifySelectedMenu(
        i,
        orderedUser.map(({ name }) => ({ label: name }))
      );
    });
  });

  it('click on question redirect us to corresponding table by question', () => {
    cy.setupResultTablesByUserForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    const rgbBorderColor = hexToRGB(theme.palette.primary.main);

    const { id: fstUserId } = getUserNamesFromAppData(
      APP_DATA_LOT_QUESTIONS_LOT_USERS
    )[0];

    // question id for first user
    const fstUserQIds = APP_DATA_LOT_QUESTIONS_LOT_USERS.filter(
      (appData) => appData.member.id === fstUserId
    ).map((appData) => appData.data.questionId);

    const questionsNames = getSettingsByName(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_SETTING_NAMES.QUESTION
    )
      .filter((setting) => fstUserQIds.includes(setting.id))
      .map((setting) => setting.data.question)
      .sort();

    for (let i = 0; i < questionsNames.length; i++) {
      // navigate to the table by user
      cy.get(dataCyWrapper(RESULT_TABLES_RESULT_BY_USER_BUTTON_CY)).click();

      cy.get(dataCyWrapper(buildTableByUserTableBodyCy(fstUserId)))
        .children(dataCyWrapper(TABLE_BY_USER_ENTRY_CY))
        .eq(i)
        .then((elem) => {
          // click on the user header
          cy.wrap(elem)
            .get(dataCyWrapper(TABLE_BY_USER_QUESTION_NAME_HEADER_CY), {
              withinSubject: elem,
            })
            .click();

          cy.get(
            dataCyWrapper(
              buildAutoScrollableMenuLinkCy(questionsNames[i].toLowerCase())
            )
          ).should('have.css', 'border-color', rgbBorderColor);

          // assert that the correct table is visible
          // This test doesn't work for now, cypress seems to prevent the document.scrollIntoView behaviour
          // comment for now
          //cy.get(dataCyWrapper(buildTableByQuestionCy(questions[i]))).should('be.visible');
        });
    }
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
 *
 * @return list of tuple containing the user id along with its name, sorted by name
 */
const getUserNamesFromAppData = (appData) => {
  return [...new Set(appData.map((data) => data.member))].sort(
    getComparator(Order.ASC, comparatorArrayByElemName)
  );
};

/**
 * Helper function to test that the content of the table is correct
 *
 * @param {string} uName The name of the user for which we currently are displayint the data
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
  const index = ascending ? (n) => n : (n, length) => length - 1 - n;

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
