import { buildDatabase } from '@graasp/apps-query-client';

import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  EXPLANATION_CY,
  EXPLANATION_PLAY_CY,
  buildQuestionStepCy,
  buildQuestionTypeOption,
  dataCyWrapper,
} from '../../src/config/selectors';
import { MEMBERS } from '../fixtures/members';

Cypress.Commands.add('setUpApi', ({ database = {}, appContext } = {}) => {
  // mock api and database
  Cypress.on('window:before:load', (win) => {
    win.database = buildDatabase({
      members: Object.values(MEMBERS),
      ...database,
    });
    win.appContext = appContext;
  });
});

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
