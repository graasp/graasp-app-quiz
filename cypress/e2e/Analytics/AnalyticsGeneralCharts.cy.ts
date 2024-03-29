import { getSettingsByName } from '../../../src/components/context/utilities';
import { APP_SETTING_NAMES } from '../../../src/config/constants';
import {
  ANALYTICS_CONTAINER_CY,
  ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY,
  ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY,
  ANALYTICS_GENERAL_QUIZ_PERFORMANCE_CY,
  ANALYTICS_GENERAL_TAB_MENU_CY,
  buildAnalyticsDetailedQuestionTabMenuCy,
  buildAutoScrollableMenuLinkCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_DATA_LOT_QUESTIONS_LOT_USERS } from '../../fixtures/appData';
import {
  APP_SETTINGS_FEW_QUESTIONS,
  APP_SETTINGS_LOT_QUESTIONS,
} from '../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../fixtures/members';
import { verifySelectedMenu } from '../../utils/autoScrollableMenuSelected';

const generalCharts = [
  {
    label: 'Quiz performance',
    id: 'quiz-performance',
    selector: ANALYTICS_GENERAL_QUIZ_PERFORMANCE_CY,
    chartTitle: 'Number of correct/incorrect responses per question',
  },
  {
    label: 'Users performance',
    id: 'users-performance',
    selector: ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY,
    chartTitle: 'Number of correct responses per user',
  },
  {
    label: 'Quiz correct response percentage',
    id: 'quiz-correctness-percentage',
    selector: ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY,
    chartTitle: 'Quiz correct response percentage',
  },
];

describe('Analytics General', () => {
  it('General Analytics no app data', () => {
    cy.setupAnalyticsForCheck(APP_SETTINGS_FEW_QUESTIONS);

    // if empty app data, then should display that no user have answered the quiz yet
    cy.get(dataCyWrapper(ANALYTICS_CONTAINER_CY)).should(
      'have.text',
      'No users answered the quiz yet'
    );
  });

  /**
   * Check the layout when opening the Analytics tab
   */
  it('Analytics tab with data, layout correctly displayed', () => {
    cy.setupAnalyticsForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    // The general tab should be present
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).scrollIntoView();
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).should(
      'have.text',
      'General'
    );

    // Check that initially General tab is selected
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).scrollIntoView();
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).should(
      'have.attr',
      'aria-selected',
      'true'
    );

    // All the question of the quiz should have their own tab, to navigate to detailed questions
    getSettingsByName(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_SETTING_NAMES.QUESTION
    ).forEach((q) => {
      cy.get(
        dataCyWrapper(buildAnalyticsDetailedQuestionTabMenuCy(q.data.question))
      ).scrollIntoView();
      cy.get(
        dataCyWrapper(buildAnalyticsDetailedQuestionTabMenuCy(q.data.question))
      ).should('have.text', q.data.question);
    });

    // The charts should correctly have en entry in the menu
    generalCharts.forEach(({ label, id }) => {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).scrollIntoView();
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(id))).should(
        'have.text',
        label
      );
    });

    generalCharts.forEach(({ selector }) => {
      cy.get(dataCyWrapper(selector)).scrollIntoView();
      cy.get(dataCyWrapper(selector)).should('be.visible');
    });
  });

  it('Scroll to chart, select correct menu entry', () => {
    cy.setupAnalyticsForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    generalCharts.forEach(({ selector }, index) => {
      cy.get(dataCyWrapper(selector)).scrollIntoView();
      cy.get(dataCyWrapper(selector)).should('be.visible');

      verifySelectedMenu(index, generalCharts);
    });
  });
});
