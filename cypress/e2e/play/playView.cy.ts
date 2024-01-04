import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS, QUESTION_APP_SETTINGS } from '../../fixtures/appSettings';
import { appDataChloe } from '../../../src/data/appDataChloe';

describe('Play View', () => {
  it('Empty data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        context: Context.Player,
      }
    });
    cy.visit('/');

    cy.get(dataCyWrapper(PLAY_VIEW_EMPTY_QUIZ_CY)).should('be.visible');
  });

  it('Show nothing even if receive other users data', () => {
    cy.setUpApi({
      database: {
        appSettings: APP_SETTINGS,
        appData: appDataChloe, // app data but not the current user's
      },
      appContext: {
        context: Context.Player,
      }
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

    cy.checkHintsPlay(null);
    cy.checkExplanationPlay(null);
  });

  describe('Play View', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          context: Context.Player,
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
