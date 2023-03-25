import {
  APP_SETTING_NAMES,
  PERMISSION_LEVELS,
} from '../../../../src/config/constants';
import { CONTEXTS } from '../../../../src/config/contexts';
import {
  NAVIGATION_RESULT_BUTTON_CY,
  buildTableByQuestionAnswerHeader,
  buildTableByQuestionCorrectHeader,
  buildTableByQuestionCy,
  buildTableByQuestionDateHeader,
  buildTableByQuestionTableBodyCy,
  buildTableByQuestionUserHeader,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { APP_DATA } from '../../../fixtures/appData';
import { APP_SETTINGS2 } from '../../../fixtures/appSettings';

describe('Table by Question', () => {
  /**
   * Test the table by question view for a few question and some user answers
   */
  it('Table by Question correctly display data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS2,
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
    APP_SETTINGS2.filter((s) => s.name === APP_SETTING_NAMES.QUESTION).forEach(
      (s, idx) => {
        cy.get(dataCyWrapper(buildTableByQuestionCy(s.data.question))).should(
          'have.text',
          APP_SETTINGS2[idx].data.question
        );

        // test header
        testTableHeader(s.data.question, 'sorted ascending');
        // test content
        testTableContent(s.data.question, true);

        // sort descending
        cy.get(
          dataCyWrapper(buildTableByQuestionUserHeader(s.data.question))
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
  cy.get(dataCyWrapper(buildTableByQuestionUserHeader(qTitle))).should(
    'have.text',
    `User${ascending}`
  );
  cy.get(dataCyWrapper(buildTableByQuestionAnswerHeader(qTitle))).should(
    'have.text',
    'Answer'
  );
  cy.get(dataCyWrapper(buildTableByQuestionDateHeader(qTitle))).should(
    'have.text',
    'Date'
  );
  cy.get(dataCyWrapper(buildTableByQuestionCorrectHeader(qTitle))).should(
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
  const n = ascending ? 0 : 2;
  cy.get(dataCyWrapper(buildTableByQuestionTableBodyCy(qTitle)))
    .children('tr')
    .each((tr, idxTr) => {
      // test for the header of the row
      cy.wrap(tr)
        .children('th')
        .first()
        .should('have.text', RESPONSES[qTitle][Math.abs(n - idxTr)].userId);

      // test for the content of the row
      cy.wrap(tr)
        .children('td')
        .each((td, idxTd) => {
          if (idxTd === 2) {
            cy.wrap(td)
              .children('svg')
              .first()
              .should(
                'have.attr',
                'data-testid',
                RESPONSES[qTitle][Math.abs(n - idxTr)].fields[idxTd]
              );
          } else {
            cy.wrap(td).should(
              'have.text',
              RESPONSES[qTitle][Math.abs(n - idxTr)].fields[idxTd]
            );
          }
        });
    });
};

/**
 * Array containing the expected data for each table in the table by question page
 */
const RESPONSES = {
  // Data first question
  'Fill In The Blanks': [
    {
      userId: 'mock-member-id-1',
      fields: [
        'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
        'Fri Jul 22 2022',
        'CancelOutlinedIcon',
      ],
    },
    {
      userId: 'mock-member-id-2',
      fields: ['Not yet answered'],
    },
    {
      userId: 'mock-member-id-3',
      fields: [
        'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
        'Fri Jul 22 2022',
        'CancelOutlinedIcon',
      ],
    },
  ],
  // Data second question
  'How happy are you?': [
    {
      userId: 'mock-member-id-1',
      fields: ['Not yet answered'],
    },
    {
      userId: 'mock-member-id-2',
      fields: ['60', 'Fri Jul 22 2022', 'CancelOutlinedIcon'],
    },
    {
      userId: 'mock-member-id-3',
      fields: ['Not yet answered'],
    },
  ],
  // Data third question
  'What is a baby cat called?': [
    {
      userId: 'mock-member-id-1',
      fields: ['90', 'Fri Jul 22 2022', 'CancelOutlinedIcon'],
    },
    {
      userId: 'mock-member-id-2',
      fields: ['Not yet answered'],
    },
    {
      userId: 'mock-member-id-3',
      fields: ['Not yet answered'],
    },
  ],
  // Data fourth question
  'What is the capital of France?': [
    {
      userId: 'mock-member-id-1',
      fields: ['Paris', 'Fri Jul 22 2022', 'CheckCircleOutlinedIcon'],
    },
    {
      userId: 'mock-member-id-2',
      fields: ['Tokyo, London', 'Fri Jul 22 2022', 'CancelOutlinedIcon'],
    },
    {
      userId: 'mock-member-id-3',
      fields: ['Not yet answered'],
    },
  ],
};
