import {
  DEFAULT_QUESTION_TYPE,
  PERMISSION_LEVELS,
  VIEWS,
} from '../../../src/config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

describe('Create View', () => {
  it('Empty data', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: VIEWS.BUILDER,
      },
    });
    cy.visit('/');
    cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
    cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
      .should('be.visible')
      .should('have.value', '');
    cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
      'have.value',
      DEFAULT_QUESTION_TYPE
    );
    cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');
    cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).should('be.disabled');
    cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');
  });

  describe('Create View', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          permission: PERMISSION_LEVELS.ADMIN,
          context: VIEWS.BUILDER,
        },
      });
      cy.visit('/');
    });

    it('Navigation', () => {
      cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');

      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        APP_SETTINGS[0].data.type
      );

      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        APP_SETTINGS[1].data.type
      );
      // go to prev
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).click();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        APP_SETTINGS[0].data.type
      );
      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        APP_SETTINGS[1].data.type
      );
      // go to next
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        APP_SETTINGS[2].data.type
      );
    });

    it('Delete question', () => {
      const toDelete = APP_SETTINGS[1];
      cy.get(dataCyWrapper(buildQuestionStepCy(toDelete.id))).click();

      // delete one
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(toDelete.id))).should(
        'not.exist'
      );

      // delete all
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();

      // fallback to new question screen if no more data
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).should('be.disabled');
      cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');


    });
  });
});
