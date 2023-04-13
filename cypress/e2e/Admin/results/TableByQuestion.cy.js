import {
  APP_SETTING_NAMES,
  PERMISSION_LEVELS,
} from '../../../../src/config/constants';
import { CONTEXTS } from '../../../../src/config/contexts';
import {
  NAVIGATION_RESULT_BUTTON_CY,
  TABLE_BY_QUESTION_ANSWER_DATA_CY,
  TABLE_BY_QUESTION_CORRECT_ICON_CY,
  TABLE_BY_QUESTION_DATE_DATA_CY,
  TABLE_BY_QUESTION_ENTRY_CY,
  TABLE_BY_QUESTION_USER_ID_HEADER_CY,
  buildTableByQuestionAnswerHeaderCy,
  buildTableByQuestionCorrectHeaderCy,
  buildTableByQuestionCy,
  buildTableByQuestionDateHeaderCy,
  buildTableByQuestionTableBodyCy,
  buildTableByQuestionUserHeaderCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { APP_DATA } from '../../../fixtures/appData';
import { APP_SETTINGS_2 } from '../../../fixtures/appSettings';
import { RESPONSES } from '../../../fixtures/tableByQuestionsResponses';

describe('Table by Question', () => {
  it('Table by Question no app data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS_2,
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');

    // navigate to the table by question
    cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();

    APP_SETTINGS_2.filter((s) => s.name === APP_SETTING_NAMES.QUESTION).forEach(
      (s, idx) => {
        // check that the title is present
        cy.get(dataCyWrapper(buildTableByQuestionCy(s.data.question))).should(
          'have.text',
          APP_SETTINGS_2[idx].data.question
        );

        // check that the table header is present
        testTableHeader(s.data.question, 'sorted ascending');

        // check that the body is empty
        cy.get(
          dataCyWrapper(buildTableByQuestionTableBodyCy(s.data.question))
        ).should('be.empty');
      }
    );
  });

  /**
   * Test the table by question view for a few question and some user answers
   */
  it('Table by Question correctly display data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS_2,
        appData: APP_DATA,
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');

    // navigate to the table by question
    cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();

    // Test that each table are correctly displayed
    APP_SETTINGS_2.filter((s) => s.name === APP_SETTING_NAMES.QUESTION).forEach(
      (s, idx) => {
        cy.get(dataCyWrapper(buildTableByQuestionCy(s.data.question))).should(
          'have.text',
          APP_SETTINGS_2[idx].data.question
        );

        // test header
        testTableHeader(s.data.question, 'sorted ascending');
        // test content
        testTableContent(s.data.question, true);

        // sort descending
        cy.get(
          dataCyWrapper(buildTableByQuestionUserHeaderCy(s.data.question))
        ).click();

        // test header
        testTableHeader(s.data.question, 'sorted descending');
        // test content
        testTableContent(s.data.question, false);
      }
    );
  });
});

/**
 * Helper function to test that the header of the table is correct
 *
 * @param {string} qTitle The title of the question for which we currently are displaying data
 * @param {string} ascending Suffix to add to User whether it is sorted ascending or descending
 */
const testTableHeader = (qTitle, ascending) => {
  cy.get(dataCyWrapper(buildTableByQuestionUserHeaderCy(qTitle))).should(
    'have.text',
    `User${ascending}`
  );
  cy.get(dataCyWrapper(buildTableByQuestionAnswerHeaderCy(qTitle))).should(
    'have.text',
    'Answer'
  );
  cy.get(dataCyWrapper(buildTableByQuestionDateHeaderCy(qTitle))).should(
    'have.text',
    'Date'
  );
  cy.get(dataCyWrapper(buildTableByQuestionCorrectHeaderCy(qTitle))).should(
    'have.text',
    'Correct'
  );
};

/**
 * Helper function to test that the content of the table is correct
 *
 * @param {string} qTitle The title of the question for which we currently are displaying data
 * @param {boolean} ascending Whether the current sorting order is ascending or descending
 */
const testTableContent = (qTitle, ascending) => {
  /**
   * Helper function to return the index of the user for which to check the response from,
   *
   * The function is different depending on whether the data is sorted ascending or descending,
   * this is to enforce ordering of entry sorted by user id.
   *
   * @param n the current index when iterating through each child
   */
  const index = ascending ? (n) => n : (n) => 2 - n;
  cy.get(dataCyWrapper(buildTableByQuestionTableBodyCy(qTitle)))
    .children(dataCyWrapper(TABLE_BY_QUESTION_ENTRY_CY))
    .each((entry, idx) => {
      // Test the header (i.e. the userId)
      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_QUESTION_USER_ID_HEADER_CY), {
          withinSubject: entry,
        })
        .should('have.text', RESPONSES[qTitle][index(idx)].userId);

      // Test the answer to the question
      cy.wrap(entry)
        .get(dataCyWrapper(TABLE_BY_QUESTION_ANSWER_DATA_CY), {
          withinSubject: entry,
        })
        .should('have.text', RESPONSES[qTitle][index(idx)].fields.answer);

      // If the question has been answer test the date
      const date = RESPONSES[qTitle][index(idx)].fields.date;
      if (date !== undefined) {
        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_QUESTION_DATE_DATA_CY), {
            withinSubject: entry,
          })
          .should('have.text', date);
      }

      // If the question has been answered test the icon
      const icon = RESPONSES[qTitle][index(idx)].fields.icon;
      if (icon !== undefined) {
        cy.wrap(entry)
          .get(dataCyWrapper(TABLE_BY_QUESTION_CORRECT_ICON_CY), {
            withinSubject: entry,
          })
          .find('svg')
          .should('have.attr', 'data-testid', icon);
      }
    });
};
