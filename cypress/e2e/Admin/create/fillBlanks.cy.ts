import { Context, PermissionLevel } from '@graasp/sdk';

import {
  APP_SETTING_NAMES,
  DEFAULT_QUESTION,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../../../src/config/constants';
import i18n from '../../../../src/config/i18n';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  FILL_BLANKS_TEXT_FIELD_CY,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import {
  APP_SETTINGS, QUESTION_APP_SETTINGS,
} from '../../../fixtures/appSettings';

const t = i18n.t;

const newFillBlanksData = {
  question: 'new question text',
  text: 'My text with <blanks> and more <blanks>',
  explanation: 'new explanation',
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
  }: { text: string; question: string; explanation: string },
  originalAppSettingData: object = DEFAULT_QUESTION.data,
  { shouldSave = true } = {}
) => {
  console.debug(originalAppSettingData);

  // fill question
  cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
  if (question.length) {
    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(question);
  }

  if (text?.length) {
    cy.get(dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)).clear();
    cy.get(dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)).type(text);
  }

  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
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
    fillBlanksQuestion(new1, DEFAULT_QUESTION.data);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.FILL_BLANKS_EMPTY_TEXT)
    );

    // faulty text
    const new2 = {
      ...newFillBlanksData,
      text: 'my <faulty< text with <blanks>',
    };
    fillBlanksQuestion(new2, new1, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.FILL_BLANKS_UNMATCHING_TAGS)
    );

    fillBlanksQuestion(newFillBlanksData, new2);

    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should('not.exist');
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

      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
    });

    it('Show saved question', () => {
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`)
        .should('be.visible')
        .should('have.value', data.question);
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QuestionType.FILL_BLANKS
      );
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      cy.get(`${dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)} textarea`).should(
        'have.value',
        data.text
      );
      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      fillBlanksQuestion(newFillBlanksData, data);

      // click new question and come back
      cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', newFillBlanksData.question);

      cy.get(`${dataCyWrapper(FILL_BLANKS_TEXT_FIELD_CY)} textarea`).should(
        'have.value',
        newFillBlanksData.text
      );
      cy.checkExplanationField(newFillBlanksData.explanation);
    });
  });
});
