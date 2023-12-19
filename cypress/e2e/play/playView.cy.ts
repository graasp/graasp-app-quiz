import { PermissionLevel } from '@graasp/sdk';

import {
  EXPLANATION_PLAY_CY,
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { LIAM_RESPONSES } from '../../fixtures/appData';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../fixtures/appSettings';

describe('Play View', () => {
  it('Empty data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
    });
    cy.visit('/');

    cy.get(dataCyWrapper(PLAY_VIEW_EMPTY_QUIZ_CY)).should('be.visible');
  });

  it('Show nothing even if receive other users data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS,
        appData: LIAM_RESPONSES, // app data but not the current user's
      },
    });
    cy.visit('/');

    cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
      'contain',
      QUESTION_APP_SETTINGS[0].data.question
    );

    // should not display app data
    cy.get(
      `${dataCyWrapper(
        buildQuestionStepCy(QUESTION_APP_SETTINGS[0].data.questionId)
      )} svg`
    ).then(($el) => {
      expect($el.attr('class').toLowerCase()).not.to.contain('error');
      expect($el.attr('class').toLowerCase()).not.to.contain('success');
    });

    cy.get(`${dataCyWrapper(EXPLANATION_PLAY_CY)}`).should('not.exist');
  });

  describe('Play View', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          permission: PermissionLevel.Admin,
        },
      });
      cy.visit('/');
    });

    it('Navigation', () => {
      cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');

      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[0].data.question
      );

      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[1].data.question
      );
      // go to prev
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).click();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[0].data.question
      );
      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[1].data.question
      );
      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[2].data.question
      );
    });
  });
});
