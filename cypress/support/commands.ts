/// <reference types="../../src/window" />
import { Context, PermissionLevel } from '@graasp/sdk';

import {
  QuestionStatus,
  QuestionStepStyleKeys,
  computeQuestionStatus,
} from '../../src/components/navigation/questionNavigation/QuestionStep';
import { API_HOST } from '../../src/config/constants';
import i18n from '../../src/config/i18n';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  EXPLANATION_CY,
  EXPLANATION_PLAY_CY,
  HINTS_CY,
  HINTS_PLAY_CY,
  NAVIGATION_ANALYTICS_BUTTON_CY,
  buildNavigationQuestionStatus,
  NAVIGATION_RESULT_BUTTON_CY,
  NUMBER_OF_ATTEMPTS_TEXT_CY,
  RESULT_TABLES_RESULT_BY_USER_BUTTON_CY,
  buildQuestionStepCy,
  buildQuestionTypeOption,
  dataCyWrapper,
} from '../../src/config/selectors';
import { mockItem } from '../../src/data/items';
import { mockCurrentMember, mockMembers } from '../../src/data/members';
import { QUIZ_TRANSLATIONS } from '../../src/langs/constants';

const t = i18n.t;

Cypress.Commands.add(
  'setUpApi',
  ({
    currentMember = mockCurrentMember,
    members = mockMembers,
    database,
    appContext,
  } = {}) => {
    Cypress.on('window:before:load', (win: Window) => {
      win.database = {
        appData: [],
        appActions: [],
        appSettings: [],
        items: [mockItem],
        members,
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

const checkTextFieldPlay = (value: string, dataCy: string) => {
  if (value) {
    cy.get(`${dataCyWrapper(dataCy)}`).should('contain', value);
  } else {
    cy.get(`${dataCyWrapper(dataCy)}`).should('not.exist');
  }
};

const checkField = (value: string, dataCy: string) => {
  cy.get(`${dataCyWrapper(dataCy)} textarea:first`).should('have.value', value);
};

const fillTextArea = (value: string, dataCy: string) => {
  cy.get(`${dataCyWrapper(dataCy)} textarea:first`).clear();
  if (value.length) {
    cy.get(`${dataCyWrapper(dataCy)} textarea:first`).type(value);
  }
};

Cypress.Commands.add('checkExplanationPlay', (explanation) => {
  checkTextFieldPlay(explanation, EXPLANATION_PLAY_CY);
});

Cypress.Commands.add('checkExplanationField', (explanation) => {
  checkField(explanation, EXPLANATION_CY);
});

Cypress.Commands.add('fillExplanation', (explanation) => {
  fillTextArea(explanation, EXPLANATION_CY);
});

Cypress.Commands.add('checkHintsPlay', (hints) => {
  checkTextFieldPlay(hints, HINTS_PLAY_CY);
});

Cypress.Commands.add('checkHintsField', (hints) => {
  checkField(hints, HINTS_CY);
});

Cypress.Commands.add('fillHints', (hints) => {
  fillTextArea(hints, HINTS_CY);
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
  (app_settings, app_data = [], members = []) => {
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

Cypress.Commands.add('checkQuizNavigationStatus', (status: QuestionStatus) => {
  cy.get(`${dataCyWrapper(buildNavigationQuestionStatus(status))}`).should(
    'be.visible'
  );
});

Cypress.Commands.add(
  'checkQuizNavigation',
  ({
    questionId,
    numberOfAttempts,
    currentAttempts,
    isCorrect,
  }: {
    questionId: string;
    numberOfAttempts: number;
    currentAttempts: number;
    isCorrect?: boolean;
  }) => {
    const questionStatus = computeQuestionStatus({
      isCorrect,
      numberOfAttempts,
      currentNumberOfAttempts: currentAttempts,
    });

    // check that the question step with given status exists and is visible
    cy.get(
      `${dataCyWrapper(buildQuestionStepCy(questionId, questionStatus))} div`
    ).should('be.visible');

    if (questionStatus !== QuestionStepStyleKeys.DEFAULT) {
      cy.checkQuizNavigationStatus(questionStatus);
    } else {
      cy.get(`${dataCyWrapper(buildNavigationQuestionStatus(questionStatus))}`).should(
        'not.exist'
      );
    }

    if (
      questionStatus === QuestionStepStyleKeys.DEFAULT ||
      questionStatus === QuestionStepStyleKeys.REMAIN_ATTEMPTS
    ) {
      cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_TEXT_CY)}`).contains(
        t(QUIZ_TRANSLATIONS.QUESTION_STEPPER_TITLE_ATTEMPTS, {
          current_attempts: currentAttempts,
          max_attempts: numberOfAttempts,
        })
      );
    } else {
      cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_TEXT_CY)}`).contains(
        t(QUIZ_TRANSLATIONS.QUESTION_STEPPER_TITLE_NO_MORE_ATTEMPTS)
      );
    }
  }
);

Cypress.Commands.add(
  'checkErrorMessage',
  ({
    errorMessage,
    severity = 'warning',
  }: {
    errorMessage?: string;
    severity?: 'error' | 'warning';
  } = {}) => {
    const MUI_ALERT_WARNING = 'MuiAlert-standardWarning'.toLowerCase();
    const MUI_ALERT_ERROR = 'MuiAlert-standardError'.toLowerCase();

    if (errorMessage) {
      cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
        'contain',
        errorMessage
      );

      cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).then(($el) => {
        if (severity === 'warning') {
          expect($el.attr('class').toLowerCase()).to.contain(MUI_ALERT_WARNING);
        } else if (severity === 'error') {
          expect($el.attr('class').toLowerCase()).to.contain(MUI_ALERT_ERROR);
        }
      });
    } else {
      cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should('not.exist');
    }
  }
);
