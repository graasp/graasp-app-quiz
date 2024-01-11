import { Context, PermissionLevel } from '@graasp/sdk';

import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  QUESTION_BAR_CY,
  dataCyWrapper,
} from '../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../fixtures/appSettings';
import { QuizNavigator } from '../../utils/navigation';

describe('Play View', () => {
  it('Empty data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PermissionLevel.Read,
        memberId: null,
      },
    });
    cy.visit('/');

    cy.get(dataCyWrapper(PLAY_VIEW_EMPTY_QUIZ_CY)).should('be.visible');
  });

  describe('Public Play View', () => {
    let quizNavigator: QuizNavigator;

    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          permission: PermissionLevel.Read,
          memberId: null,
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
