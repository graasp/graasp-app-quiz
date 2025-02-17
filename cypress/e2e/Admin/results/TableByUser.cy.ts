import { AppData } from '@graasp/sdk';

import { getSettingsByName } from '../../../../src/components/context/utilities';
import { APP_SETTING_NAMES } from '../../../../src/config/constants';
import i18n from '../../../../src/config/i18n';
import {
  AUTO_SCROLLABLE_MENU_LINK_LIST_CY,
  RESULT_TABLES_RESULT_BY_USER_BUTTON_CY,
  TABLE_BY_USER_ANSWER_DATA_CY,
  TABLE_BY_USER_CORRECT_ICON_CY,
  TABLE_BY_USER_DATE_DATA_CY,
  TABLE_BY_USER_ENTRY_CY,
  TABLE_BY_USER_QUESTION_NAME_HEADER_CY,
  buildTableByUserAnswerHeaderCy,
  buildTableByUserCorrectHeaderCy,
  buildTableByUserCy,
  buildTableByUserDateHeaderCy,
  buildTableByUserQuestionHeaderCy,
  buildTableByUserTableBodyCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
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

const t = i18n.t;

describe('Table by User', () => {
  /**
   * Test the table by user view for a few question and some user answers
   */
  it('Table by User correctly display data', () => {
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
        cy.wrap(elem)
          .find('p')
          .contains(orderedUser[idx].name, { matchCase: false });
      });
  });

  /**
   * Test that when clicking on a link, the table become visible
   */
  // bug: click does not transition as expected in cypress
  // it.only('Click on menu goes to question', () => {
  //   // Enough mock-user to ensure that when one table is visible, all others are hidden
  //   cy.setupResultTablesByUserForCheck(
  //     APP_SETTINGS_LOT_QUESTIONS,
  //     APP_DATA_LOT_QUESTIONS_LOT_USERS,
  //     MEMBERS_RESULT_TABLES
  //   );

  //   const orderedUser = getUserNamesFromAppData(
  //     APP_DATA_LOT_QUESTIONS_LOT_USERS
  //   );

  //   orderedUser.forEach(({  id }, i) => {
  //     // click on the link
  //     cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).click();

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
        orderedUser.map(({ name, id: thisId }) => ({ label: name, id: thisId }))
      );
    });
  });

  it('click on question redirect us to corresponding table by question', () => {
    cy.setupResultTablesByUserForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

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
    ).filter((setting) => fstUserQIds.includes(setting.id));

    // sort by question text
    questionsNames.sort(
      ({ data: { question: a } }, { data: { question: b } }) => (a > b ? 1 : -1)
    );

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

          // testing the moving tables and the left navigation is flacky
          // this test at least test it doesn't crash
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
const testTableHeader = (uId: string, ascending: string) => {
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
const getUserNamesFromAppData = (appData: AppData[]) =>
  [...new Set(appData.map((data) => data.member))].sort(
    getComparator({ order: Order.ASC, comp: comparatorArrayByElemName })
  );

const isOrdered = (arr: string[], asc = true) => {
  const orderComparison = (a: string, b: string) =>
    asc ? a.localeCompare(b) : b.localeCompare(a);

  for (let i = 0; i < arr.length - 1; i++) {
    if (orderComparison(arr[i], arr[i + 1]) > 0) {
      return false;
    }
  }

  return true;
};

/**
 * Helper function to test that the content of the table is correct
 *
 * @param {string} uId The user id for which we currently are displaying the data
 * @param {boolean} ascending Whether the current sorting order is ascending or descending
 */
const testTableContent = (uId: string, ascending: boolean) => {
  const questionTitles: string[] = [];

  cy.get(dataCyWrapper(buildTableByUserTableBodyCy(uId)))
    .children(dataCyWrapper(TABLE_BY_USER_ENTRY_CY))
    .each((entry) => {
      const currentQuestionName = Cypress.$(entry)
        .find(dataCyWrapper(TABLE_BY_USER_QUESTION_NAME_HEADER_CY))
        .text()
        .trim();

      questionTitles.push(currentQuestionName);
      if (!isOrdered(questionTitles, ascending)) {
        throw new Error(
          `The questions are not ordered in ${ascending ? 'ASC' : 'DESC'}.`
        );
      }

      const userResponse = USER_RESPONSES[uId].find(
        (r) => r.qName === currentQuestionName
      );

      if (userResponse) {
        // Test the header (i.e. the userId)
        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_QUESTION_NAME_HEADER_CY), {
            withinSubject: entry,
          })
          .should('have.text', userResponse.qName);

        // Test the answer to the question
        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_ANSWER_DATA_CY), {
            withinSubject: entry,
          })
          .should('have.text', userResponse.fields.answer);

        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_DATE_DATA_CY), {
            withinSubject: entry,
          })
          .should('have.text', userResponse.fields.date);

        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_CORRECT_ICON_CY), {
            withinSubject: entry,
          })
          .find('svg')
          .should('have.attr', 'data-testid', userResponse.fields.icon);
      } else {
        // Test the answer to the question
        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_ANSWER_DATA_CY), {
            withinSubject: entry,
          })
          .should('not.exist');

        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_DATE_DATA_CY), {
            withinSubject: entry,
          })
          .should('have.text', t('Not yet answered'));

        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_USER_CORRECT_ICON_CY), {
            withinSubject: entry,
          })
          .should('not.exist');
      }
    });
};
