import { Context, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_QUESTION_TYPE } from '../../../../src/config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  QUESTION_STEP_CLASSNAME,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { APP_SETTINGS } from '../../../fixtures/appSettings';
import { fillMultipleChoiceQuestion } from './multipleChoices.cy';

const newMultipleChoiceData = {
  question: 'new question text',
  choices: [
    {
      value: 'new choice 1',
      isCorrect: true,
    },
    {
      value: 'new choice 2',
      isCorrect: true,
    },
  ],
  explanation: 'my new explanation',
};

describe('Create View', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PermissionLevel.Admin,
        context: Context.Builder,
      },
    });
    cy.visit('/');
  });

  it('Empty data', () => {
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

  it('Add questions from empty quiz', () => {
    // Add three questions and make sure they are added to the QuestionTopBar
    cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
    fillMultipleChoiceQuestion(newMultipleChoiceData);
    cy.wait(2000); // Wait for the new question to appear
    cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
    cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
      .should('be.visible')
      .should('have.value', '');
    fillMultipleChoiceQuestion(newMultipleChoiceData);
    cy.wait(2000);
    cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
    cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
      .should('be.visible')
      .should('have.value', '');
    fillMultipleChoiceQuestion(newMultipleChoiceData);
    // Verify the questions are added to the order list by checking the number of
    // question nodes in the QuestionTopBar, as we cannot check the app settings directly
    cy.get('html').find(`.${QUESTION_STEP_CLASSNAME}`).should('have.length', 3);
  });

  describe('Create View', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          permission: PermissionLevel.Admin,
          context: Context.Builder,
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
      for (let i = 0; i < APP_SETTINGS.length - 2; i += 1) {
        cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();
      }

      // fallback to new question screen if no more data
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).should('be.disabled');
      cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
    });

    it('Add question from existing quiz', () => {
      const currentQuestion = APP_SETTINGS[1];
      cy.get(dataCyWrapper(buildQuestionStepCy(currentQuestion.id))).click();
      // click new question and come back
      cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();

      // New question title should be visible
      cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
      cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
        .should('be.visible')
        .should('have.value', '');
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        DEFAULT_QUESTION_TYPE
      );
      cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');
      fillMultipleChoiceQuestion(newMultipleChoiceData);
      cy.get('html')
        .find(`.${QUESTION_STEP_CLASSNAME}`)
        .should('have.length', 5);
    });
  });
});
