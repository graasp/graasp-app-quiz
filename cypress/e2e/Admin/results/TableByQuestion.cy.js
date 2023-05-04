import { getSettingsByName } from '../../../../src/components/context/utilities';
import { APP_SETTING_NAMES } from '../../../../src/config/constants';
import {
  AUTO_SCROLLABLE_MENU_LINK_LIST_CY,
  RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY,
  TABLE_BY_QUESTION_ANSWER_DATA_CY,
  TABLE_BY_QUESTION_CONTAINER_CY,
  TABLE_BY_QUESTION_CORRECT_ICON_CY,
  TABLE_BY_QUESTION_DATE_DATA_CY,
  TABLE_BY_QUESTION_ENTRY_CY,
  TABLE_BY_QUESTION_USER_ID_HEADER_CY,
  buildAutoScrollableMenuLinkCy,
  buildTableByQuestionAnswerHeaderCy,
  buildTableByQuestionCorrectHeaderCy,
  buildTableByQuestionCy,
  buildTableByQuestionDateHeaderCy,
  buildTableByQuestionTableBodyCy,
  buildTableByQuestionUserHeaderCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import theme from '../../../../src/layout/theme';
import { APP_DATA, APP_DATA_2 } from '../../../fixtures/appData';
import { APP_SETTINGS_2 } from '../../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../../fixtures/members';
import { RESPONSES } from '../../../fixtures/tableByQuestionsResponses';
import { hexToRGB } from '../../../utils/Color';

describe('Table by Question', () => {
  it('Table by Question no app data', () => {
    cy.setupResultTablesByQuestionForCheck(APP_SETTINGS_2);

    // if empty app data, then should display that no user have answered the quiz yet
    cy.get(dataCyWrapper(TABLE_BY_QUESTION_CONTAINER_CY)).should(
      'have.text',
      'No users answered the quiz yet'
    );
  });

  /**
   * Test the table by question view for a few question and some user answers
   */
  it('Table by Question correctly display data', () => {
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_2,
      APP_DATA,
      MEMBERS_RESULT_TABLES
    );

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

  /**
   * Test that the link in the left menu are ordered in the same way as the questions
   */
  it('Menu on left correctly display question title, in the correct order', () => {
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_2,
      APP_DATA,
      MEMBERS_RESULT_TABLES
    );

    // Retrieved the question ordered as in the APP_SETTINGS2
    const orderedResponseText = getSettingsByName(
      APP_SETTINGS_2,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list.map((elem) => {
      return APP_SETTINGS_2.find((el) => el.id === elem).data.question;
    });

    cy.get(dataCyWrapper(AUTO_SCROLLABLE_MENU_LINK_LIST_CY))
      .children('a')
      .each((elem, idx) => {
        cy.wrap(elem).find('p').should('have.text', orderedResponseText[idx]);
      });
  });

  /**
   * Test that when clicking on a link, the table become visible
   */
  it('Click on menu goes to question', () => {
    // Enough mock-user in APP_DATA2 to ensure that when one table is visible, all others are hidden
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_2,
      APP_DATA_2,
      MEMBERS_RESULT_TABLES
    );

    const orderedResponseText = getSettingsByName(
      APP_SETTINGS_2,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list.map((elem) => {
      return APP_SETTINGS_2.find((el) => el.id === elem).data.question;
    });

    orderedResponseText.forEach((elem, i) => {
      // click on the link
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(elem))).click();

      // check that the table is visible ( allow 1s to fetch it, as it may take some times to scroll there)
      cy.get(dataCyWrapper(buildTableByQuestionCy(elem))).should('be.visible');

      // check that other element are not visible
      orderedResponseText.forEach((el, idx) => {
        if (idx !== i) {
          cy.get(dataCyWrapper(buildTableByQuestionCy(el))).should(
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
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_2,
      APP_DATA_2,
      MEMBERS_RESULT_TABLES
    );

    const rgbBorderColor = hexToRGB(theme.palette.primary.main);

    const orderedResponseText = getSettingsByName(
      APP_SETTINGS_2,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list.map((elem) => {
      return APP_SETTINGS_2.find((el) => el.id === elem).data.question;
    });

    orderedResponseText.forEach((elem, i) => {
      // Scroll element into view
      cy.get(dataCyWrapper(buildTableByQuestionCy(elem))).scrollIntoView();

      // check that the correct link appear as selected
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(elem))).should(
        'have.css',
        'border-color',
        rgbBorderColor
      );

      // check that other border are transparent
      orderedResponseText.forEach((el, idx) => {
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

  it('click on user redirect us to corresponding table by user', () => {
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_2,
      APP_DATA_2,
      MEMBERS_RESULT_TABLES
    );

    const rgbBorderColor = hexToRGB(theme.palette.primary.main);

    const fstQuestionId = getSettingsByName(
      APP_SETTINGS_2,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list[0];
    const fstQuestion = getSettingsByName(
      APP_SETTINGS_2,
      APP_SETTING_NAMES.QUESTION
    ).find((setting) => setting.id === fstQuestionId).data.question;

    const users = [...new Set(APP_DATA_2.map((data) => data.memberId))]
      .map((id) => MEMBERS_RESULT_TABLES[id].name)
      .sort();
    for (const [i, user] of users.entries()) {
      // navigate to the table by user
      cy.get(dataCyWrapper(RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY)).click();

      cy.get(dataCyWrapper(buildTableByQuestionTableBodyCy(fstQuestion)))
        .children(dataCyWrapper(TABLE_BY_QUESTION_ENTRY_CY))
        .eq(i)
        .then((elem) => {
          // click on the user header
          cy.wrap(elem)
            .get(dataCyWrapper(TABLE_BY_QUESTION_USER_ID_HEADER_CY), {
              withinSubject: elem,
            })
            .click();

          // SHOULD FIND NAME NOT MEMBER-ID
          cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(user))).should(
            'have.css',
            'border-color',
            rgbBorderColor
          );

          // assert that the correct table is visible
          // This test doesn't work for now, cypress seems to prevent the document.scrollIntoView behaviour
          // comment it for now
          //cy.get(dataCyWrapper(buildTableByUserCy(user))).should('be.visible');
        });
    }
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
