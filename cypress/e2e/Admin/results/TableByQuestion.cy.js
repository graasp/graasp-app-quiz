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
import {
  APP_DATA_FEW_QUESTIONS_FEW_USERS,
  APP_DATA_FEW_QUESTIONS_LOT_USERS,
} from '../../../fixtures/appData';
import { APP_SETTINGS_FEW_QUESTIONS } from '../../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../../fixtures/members';
import { RESPONSES } from '../../../fixtures/tableByQuestionsResponses';
import { verifySelectedMenu } from '../../../utils/autoScrollableMenuSelected';
import { hexToRGB } from '../../../utils/color';

describe('Table by Question', () => {
  it('Table by Question no app data', () => {
    cy.setupResultTablesByQuestionForCheck(APP_SETTINGS_FEW_QUESTIONS);

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
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_FEW_USERS,
      MEMBERS_RESULT_TABLES
    );

    // Test that each table are correctly displayed
    APP_SETTINGS_FEW_QUESTIONS.filter(
      (s) => s.name === APP_SETTING_NAMES.QUESTION
    ).forEach((s, idx) => {
      cy.get(dataCyWrapper(buildTableByQuestionCy(s.data.questionId))).should(
        'have.text',
        APP_SETTINGS_FEW_QUESTIONS[idx].data.question
      );

      // test header
      testTableHeader(s.data.questionId, 'sorted ascending');
      // test content
      testTableContent(s.data.questionId, s.data.question, true);

      // sort descending
      cy.get(
        dataCyWrapper(buildTableByQuestionUserHeaderCy(s.data.questionId))
      ).click();

      // test header
      testTableHeader(s.data.questionId, 'sorted descending');
      // test content
      testTableContent(s.data.questionId, s.data.question, false);
    });
  });

  /**
   * Test that the link in the left menu are ordered in the same way as the questions
   */
  it('Menu on left correctly display question title, in the correct order', () => {
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_FEW_USERS,
      MEMBERS_RESULT_TABLES
    );

    // Retrieved the question ordered as in the APP_SETTINGS2
    const orderedResponseText = getSettingsByName(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list.map((elem) => {
      return APP_SETTINGS_FEW_QUESTIONS.find(
        (el) => el.data.questionId === elem
      ).data.question;
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
  // bug: does not transition as expected in cypress
  // it('Click on menu goes to question', () => {
  //   // Enough mock-user in APP_DATA2 to ensure that when one table is visible, all others are hidden
  //   cy.setupResultTablesByQuestionForCheck(
  //     APP_SETTINGS_FEW_QUESTIONS,
  //     APP_DATA_FEW_QUESTIONS_LOT_USERS,
  //     MEMBERS_RESULT_TABLES
  //   );

  //   const orderedResponseText = getSettingsByName(
  //     APP_SETTINGS_FEW_QUESTIONS,
  //     APP_SETTING_NAMES.QUESTION_LIST
  //   )[0].data.list.map((elem) => {
  //     return APP_SETTINGS_FEW_QUESTIONS.find((el) => el.id === elem);
  //   });

  //   orderedResponseText.forEach(({ id }, i) => {
  //     // click on the link
  //     cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).click();

  //     // check that the table is visible ( allow 1s to fetch it, as it may take some times to scroll there)
  //     cy.get(dataCyWrapper(buildTableByQuestionCy(id))).should('be.visible');

  //     // check that other element are not visible
  //     orderedResponseText.forEach((el, idx) => {
  //       if (idx !== i) {
  //         cy.get(dataCyWrapper(buildTableByQuestionCy(el.id))).should(
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
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    const orderedResponseText = getSettingsByName(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list.map((elem) => {
      const e = APP_SETTINGS_FEW_QUESTIONS.find(
        (el) => el.data.questionId === elem
      );
      return {
        label: e.data.question,
        id: e.data.questionId,
      };
    });

    orderedResponseText.forEach(({ id }, i) => {
      // Scroll element into view
      cy.get(dataCyWrapper(buildTableByQuestionCy(id))).scrollIntoView();

      // check that the correct link appear as selected
      verifySelectedMenu(i, orderedResponseText);
    });
  });

  it('click on user redirect us to corresponding table by user', () => {
    cy.setupResultTablesByQuestionForCheck(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_DATA_FEW_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    const rgbBorderColor = hexToRGB(theme.palette.primary.main);

    const fstQuestionId = getSettingsByName(
      APP_SETTINGS_FEW_QUESTIONS,
      APP_SETTING_NAMES.QUESTION_LIST
    )[0].data.list[0];

    let users = [
      ...new Map(
        APP_DATA_FEW_QUESTIONS_LOT_USERS.map(({ member }) => [
          member.id,
          member,
        ])
      ).values(),
    ];
    users.sort(({ name: a }, { name: b }) => {
      return a > b ? 1 : -1;
    });
    for (const [i, { id }] of users.entries()) {
      // navigate to the table by user
      cy.get(dataCyWrapper(RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY)).click();

      cy.get(dataCyWrapper(buildTableByQuestionTableBodyCy(fstQuestionId)))
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
          cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).should(
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
 * @param {string} id The id of the question for which we currently are displaying data
 * @param {string} ascending Suffix to add to User whether it is sorted ascending or descending
 */
const testTableHeader = (id, ascending) => {
  cy.get(dataCyWrapper(buildTableByQuestionUserHeaderCy(id))).should(
    'have.text',
    `User${ascending}`
  );
  cy.get(dataCyWrapper(buildTableByQuestionAnswerHeaderCy(id))).should(
    'have.text',
    'Answer'
  );
  cy.get(dataCyWrapper(buildTableByQuestionDateHeaderCy(id))).should(
    'have.text',
    'Date'
  );
  cy.get(dataCyWrapper(buildTableByQuestionCorrectHeaderCy(id))).should(
    'have.text',
    'Correct'
  );
};

/**
 * Helper function to test that the content of the table is correct
 *
 * @param {string} qId The id of the question for which we currently are displaying data
 * @param {string} qTitle The title of the question for which we currently are displaying data
 * @param {boolean} ascending Whether the current sorting order is ascending or descending
 */
const testTableContent = (qId, qTitle, ascending) => {
  /**
   * Helper function to return the index of the user for which to check the response from,
   *
   * The function is different depending on whether the data is sorted ascending or descending,
   * this is to enforce ordering of entry sorted by user id.
   *
   * @param n the current index when iterating through each child
   */
  const index = ascending ? (n) => n : (n) => 2 - n;
  cy.get(dataCyWrapper(buildTableByQuestionTableBodyCy(qId)))
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
