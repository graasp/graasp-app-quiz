import {
  APP_SETTING_NAMES,
  PERMISSION_LEVELS,
} from '../../../src/config/constants';
import { CONTEXTS } from '../../../src/config/contexts';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  ANALYTICS_CONTAINER_CY,
  CREATE_VIEW_CONTAINER_CY,
  NAVIGATION_ANALYTICS_BUTTON_CY,
  NAVIGATION_CREATE_QUIZ_BUTTON_CY,
  NAVIGATION_RESULT_BUTTON_CY,
  NAVIGATION_TAB_CONTAINER_CY,
  TABLE_BY_QUESTION_CONTAINER_CY,
  buildTableByQuestionCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_DATA_2 } from '../../fixtures/appData';
import { APP_SETTINGS_2 } from '../../fixtures/appSettings';

describe('Admin View', () => {
  /**
   * Test the admin view for empty data
   */
  it('Empty Data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');
    testAdminViewBaseLayout();

    cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();
    cy.get(dataCyWrapper(TABLE_BY_QUESTION_CONTAINER_CY)).should(
      'have.text',
      "There isn't any question to display"
    );

    cy.get(dataCyWrapper(NAVIGATION_ANALYTICS_BUTTON_CY)).click();
    cy.get(dataCyWrapper(ANALYTICS_CONTAINER_CY)).should(
      'have.text',
      "There isn't any question to display"
    );
  });

  /**
   * Test the admin view when there is some question in app data
   */
  it('Question data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS_2,
        appData: APP_DATA_2,
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');
    testAdminViewBaseLayout();

    cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();
    APP_SETTINGS_2.filter((s) => s.name === APP_SETTING_NAMES.QUESTION).forEach(
      (s, idx) =>
        cy
          .get(dataCyWrapper(buildTableByQuestionCy(s.data.question)))
          .should('have.text', APP_SETTINGS_2[idx].data.question)
    );
  });
});

/**
 * Helper function to test the base layout of AdminView
 */
export const testAdminViewBaseLayout = () => {
  cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
  cy.get(dataCyWrapper(CREATE_VIEW_CONTAINER_CY)).should('be.visible');
  cy.get(dataCyWrapper(TABLE_BY_QUESTION_CONTAINER_CY)).should('not.exist');
  cy.get(dataCyWrapper(NAVIGATION_TAB_CONTAINER_CY)).should('be.visible');
  cy.get(dataCyWrapper(NAVIGATION_CREATE_QUIZ_BUTTON_CY)).should('be.visible');
  cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).should('be.visible');
  cy.get(dataCyWrapper(NAVIGATION_ANALYTICS_BUTTON_CY)).should('be.visible');
  cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();

  // after we click on result, the table component should be visible and the table
  cy.get(dataCyWrapper(CREATE_VIEW_CONTAINER_CY)).should('not.exist');
  cy.get(dataCyWrapper(TABLE_BY_QUESTION_CONTAINER_CY)).should('be.visible');

  // after clicking on analytics, the component should be visible
  cy.get(dataCyWrapper(NAVIGATION_ANALYTICS_BUTTON_CY)).click();
  cy.get(dataCyWrapper(ANALYTICS_CONTAINER_CY)).should('be.visible');
};
