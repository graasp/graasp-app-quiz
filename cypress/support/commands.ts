import {
  AppData,
  AppSetting,
  CompleteMember,
  Context,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST } from '../../src/config/constants';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  EXPLANATION_CY,
  EXPLANATION_PLAY_CY,
  NAVIGATION_ANALYTICS_BUTTON_CY,
  NAVIGATION_RESULT_BUTTON_CY,
  RESULT_TABLES_RESULT_BY_USER_BUTTON_CY,
  buildQuestionStepCy,
  buildQuestionTypeOption,
  dataCyWrapper,
} from '../../src/config/selectors';
import { mockItem } from '../../src/data/items';
import { mockCurrentMember, mockMembers } from '../../src/data/members';

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = mockCurrentMember, database, appContext } = {}) => {
    // mock api and database
    // TODO: check why typescript fail on win.
    Cypress.on('window:before:load', (win: Window) => {
      win.database = {
        appData: [],
        appActions: [],
        appSettings: [],
        items: [mockItem],
        members: mockMembers,
        ...database,
      };
      win.appContext = {
        memberId: currentMember.id,
        itemId: mockItem.id,
        apiHost: Cypress.env('REACT_APP_API_HOST') || API_HOST,
        context: Context.Builder,
        permission: PermissionLevel.Read,
        ...appContext,
      };
    });
  }
);

Cypress.Commands.add('switchQuestionType', (type) => {
  // mock api and database

  cy.get(dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)).click();
  cy.get(dataCyWrapper(buildQuestionTypeOption(type))).click();
});

Cypress.Commands.add('checkStepStatus', (id, isCorrect) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get(`${dataCyWrapper(buildQuestionStepCy(id))} svg`).then(($el) => {
    expect($el.attr('class').toLowerCase()).to.contain(
      isCorrect ? 'success' : 'error'
    );
  });
});

Cypress.Commands.add('checkExplanationPlay', (explanation) => {
  if (explanation) {
    cy.get(`${dataCyWrapper(EXPLANATION_PLAY_CY)}`).should(
      'contain',
      explanation
    );
  } else {
    cy.get(`${dataCyWrapper(EXPLANATION_PLAY_CY)}`).should('not.exist');
  }
});

Cypress.Commands.add('checkExplanationField', (explanation) => {
  cy.get(`${dataCyWrapper(EXPLANATION_CY)} textarea:first`).should(
    'have.value',
    explanation
  );
});

Cypress.Commands.add('fillExplanation', (explanation) => {
  cy.get(`${dataCyWrapper(EXPLANATION_CY)} textarea:first`).clear();
  if (explanation.length) {
    cy.get(`${dataCyWrapper(EXPLANATION_CY)} textarea:first`).type(explanation);
  }
});

/**
 * Command to set up the test, to test the table by question view
 *
 * @param app_settings The app settings to use to initialize the test
 * @param app_data The app data to use to initialize the test
 */
Cypress.Commands.add(
  'setupResultTablesByQuestionForCheck',
  (app_settings, app_data, members) => {
    cy.setUpApi({
      database: {
        appSettings: app_settings,
        appData: app_data,
      },
      appContext: {
        permission: PermissionLevel.Admin,
        context: Context.Builder,
      },
      members,
    });
    cy.visit('/');

    // navigate to the table by question
    cy.get(dataCyWrapper(NAVIGATION_RESULT_BUTTON_CY)).click();

    // TODO Cypress doesn't wait long enough, and the members are not fully retrieved, but it freeze the
    //  render like that, and thus the AutoScrollablePanel is not fully initialized
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
  }
);

Cypress.Commands.add(
  'setupAnalyticsForCheck',
  (app_settings, app_data, members) => {
    cy.setUpApi({
      database: {
        appSettings: app_settings,
        appData: app_data,
      },
      appContext: {
        permission: PermissionLevel.Admin,
        context: Context.Builder,
      },
      members,
    });

    cy.visit('/');

    // navigate to Analytics
    cy.get(dataCyWrapper(NAVIGATION_ANALYTICS_BUTTON_CY)).click();
  }
);

/**
 * Command to set up the test, to test the table by user view
 *
 * @param app_settings The app settings to use to initialize the test
 * @param app_data The app data to use to initialize the test
 */
Cypress.Commands.add(
  'setupResultTablesByUserForCheck',
  (app_settings, app_data, members) => {
    cy.setupResultTablesByQuestionForCheck(app_settings, app_data, members);

    // TODO Cypress doesn't wait long enough, and the members are not fully retrieved, but it freeze the
    //  render like that, and thus the AutoScrollablePanel is not fully initialized
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);
    // navigate to the table by user
    cy.get(dataCyWrapper(RESULT_TABLES_RESULT_BY_USER_BUTTON_CY)).click();
  }
);
