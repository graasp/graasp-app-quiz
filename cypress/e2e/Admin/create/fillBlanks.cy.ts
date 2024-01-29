import { Context, PermissionLevel } from '@graasp/sdk';

import {
  APP_SETTING_NAMES,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../../../src/config/constants';
import i18n from '../../../../src/config/i18n';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  FILL_BLANKS_TEXT_FIELD_CY,
  NAVIGATION_ADD_QUESTION_BUTTON_CY,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../../fixtures/appSettings';

const t = i18n.t;

const newFillBlanksData = {
  question: 'new question text',
  text: 'My text with <blanks> and more <blanks>',
  explanation: 'new explanation',
  hints: 'new hints',
};

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.FILL_BLANKS
);

const id = data.questionId;

const fillBlanksQuestion = (
  {
    text,
    question,
    explanation,
    hints,
  }: { text: string; question: string; explanation: string; hints: string },
  { shouldSave = true } = {}
) => {
  // fill question
  cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
  if (question.length) {
    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(question);
  }

  if (text?.length) {
    cy.get(dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)).clear();
    cy.get(dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)).type(text);
  }

  cy.fillHints(hints);
  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
  } else {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).should('be.disabled');
  }
};

describe('Fill in the Blanks', () => {
  it('Start with empty data and save question', () => {
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

    cy.switchQuestionType(QuestionType.FILL_BLANKS);

    // empty text
    const new1 = { ...newFillBlanksData, text: '' };
    fillBlanksQuestion(new1, { shouldSave: false });
    cy.checkErrorMessage({
      errorMessage: t(FAILURE_MESSAGES.FILL_BLANKS_EMPTY_TEXT),
    });

    // faulty text
    const new2 = {
      ...newFillBlanksData,
      text: 'my <faulty< text with <blanks>',
    };
    fillBlanksQuestion(new2, { shouldSave: false });
    cy.checkErrorMessage({
      errorMessage: t(FAILURE_MESSAGES.FILL_BLANKS_UNMATCHING_TAGS),
    });

    fillBlanksQuestion(newFillBlanksData);
    cy.checkErrorMessage({});
  });

  describe('Display saved settings', () => {
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

      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
    });

    it('Show saved question', () => {
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`)
        .should('be.visible')
        .should('have.value', data.question);
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QuestionType.FILL_BLANKS
      );
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      cy.get(`${dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)} textarea`).should(
        'have.value',
        data.text
      );
      cy.checkHintsField(data.hints);
      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      fillBlanksQuestion(newFillBlanksData);

      // click new question and come back
      cy.get(dataCyWrapper(NAVIGATION_ADD_QUESTION_BUTTON_CY)).click();
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id)))
        .should('be.visible')
        .should('contain', newFillBlanksData.question);

      cy.get(`${dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)} textarea`).should(
        'have.value',
        newFillBlanksData.text
      );
      cy.checkHintsField(newFillBlanksData.hints);
      cy.checkExplanationField(newFillBlanksData.explanation);
    });
  });
});
