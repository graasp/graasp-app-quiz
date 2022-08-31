import { buildDatabase } from '@graasp/apps-query-client';

import {
  CREATE_QUESTION_SELECT_TYPE_CY,
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

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(4000);
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
