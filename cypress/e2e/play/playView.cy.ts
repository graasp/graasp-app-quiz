import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  QUESTION_BAR_CY,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { appDataChloe } from '../../../src/data/appDataChloe';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../fixtures/appSettings';
import { QuizNavigator } from '../../utils/navigation';

describe('Play View', () => {
  let quizNavigator: QuizNavigator;

  it('Empty data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        context: Context.Player,
      },
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
        buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[0].data.questionId)
      )} svg`
    ).should('not.exist');

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
      quizNavigator = new QuizNavigator({
        questionSettings: QUESTION_APP_SETTINGS,
        context: Context.Player,
      });
      cy.visit('/');
    });

    it('Navigation', () => {
      cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');
      quizNavigator.prevBtnShouldDisabled();

      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[0].data.question
      );

      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[1].data.question
      );
      // go to prev
      quizNavigator.goToPrev();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[0].data.question
      );
      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[1].data.question
      );
      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
        'contain',
        QUESTION_APP_SETTINGS[2].data.question
      );
    });
  });
});
