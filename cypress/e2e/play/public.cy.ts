import { PermissionLevel } from '@graasp/sdk';

import {
  PLAY_VIEW_EMPTY_QUIZ_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS, QUESTION_APP_SETTINGS } from '../../fixtures/appSettings';

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
