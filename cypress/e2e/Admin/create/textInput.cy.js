import {
  APP_SETTING_NAMES,
  PERMISSION_LEVELS,
  QUESTION_TYPES,
} from '../../../../src/config/constants';
import { CONTEXTS } from '../../../../src/config/contexts';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  TEXT_INPUT_FIELD_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { APP_SETTINGS } from '../../../fixtures/appSettings';

const newTextInputData = {
  question: 'new question text',
  text: 'new text',
  explanation: 'my explanation',
};

const { data, id } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QUESTION_TYPES.TEXT_INPUT
);

const fillTextInputQuestion = (
  { text, question, explanation },
  { shouldSave = true } = {}
) => {
  // fill question if not empty
  cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
  if (question.length) {
    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(question);
  }

  // fill answer if not empty
  cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)} input`).clear();
  if (text.length) {
    cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)} input`).type(text);
  }

  // fill explanation
  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
  }
};

describe('Text Input', () => {
  it('Start with empty data and save empty response', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');

    cy.switchQuestionType(QUESTION_TYPES.TEXT_INPUT);

    // empty answer
    const new1 = {
      ...newTextInputData,
      text: '',
    };
    fillTextInputQuestion(new1);

    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should('not.exist');
  });

  it('Start with empty data and save question with non-empty response', () => {
    cy.setUpApi({
      database: {
        appSettings: [],
      },
      appContext: {
        permission: PERMISSION_LEVELS.ADMIN,
        context: CONTEXTS.BUILDER,
      },
    });
    cy.visit('/');

    cy.switchQuestionType(QUESTION_TYPES.TEXT_INPUT);

    fillTextInputQuestion(newTextInputData);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should('not.exist');
  });

  describe('Display saved settings', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
        appContext: {
          permission: PERMISSION_LEVELS.ADMIN,
          context: CONTEXTS.BUILDER,
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
        QUESTION_TYPES.TEXT_INPUT
      );
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)} input`).should(
        'have.value',
        data.text
      );

      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      fillTextInputQuestion(newTextInputData);

      // click new question and come back
      cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', newTextInputData.question);

      cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)} input`).should(
        'have.value',
        newTextInputData.text
      );

      cy.checkExplanationField(newTextInputData.explanation);
    });
  });
});