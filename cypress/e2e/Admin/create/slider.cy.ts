import { Context, PermissionLevel } from '@graasp/sdk';

import { SliderAppDataData } from '../../../../src/components/types/types';
import {
  APP_SETTING_NAMES,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../../../src/config/constants';
import i18n from '../../../../src/config/i18n';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  SLIDER_CY,
  SLIDER_MAX_FIELD_CY,
  SLIDER_MIN_FIELD_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../../fixtures/appSettings';

const t = i18n.t;

const newSliderData = {
  question: 'new question text',
  min: 0,
  max: 90,
  value: 40,
  explanation: 'new explanation',
};

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.SLIDER
);

type SliderValues = {
  min: number;
  question: string;
  max: number;
  value: number;
  explanation: string;
}

const id = data.questionId;

const fillSliderQuestion = (
  {
    min,
    max,
    value,
    question,
    explanation,
  }: SliderValues,
  originalAppSettingDataValue: number,
  { shouldSave = true } = {}
) => {
  // fill question
  cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
  if (question.length) {
    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(question);
  }

  // fill min, max
  cy.get(`${dataCyWrapper(SLIDER_MIN_FIELD_CY)} input`).clear();
  if (Number.isInteger(min)) {
    cy.get(`${dataCyWrapper(SLIDER_MIN_FIELD_CY)} input`).type(min.toString());
  }
  cy.get(`${dataCyWrapper(SLIDER_MAX_FIELD_CY)} input`).clear();
  if (Number.isInteger(max)) {
    cy.get(`${dataCyWrapper(SLIDER_MAX_FIELD_CY)} input`).type(max.toString());
  }

  // change slider - randomly because it's difficult to move the slider precisely
  const steps = value - originalAppSettingDataValue;
  if (steps) {
    const direction = steps > 0 ? '{rightarrow}' : '{leftarrow}';
    const stepsString = direction.repeat(steps);
    cy.get(`${dataCyWrapper(SLIDER_CY)}`).type(stepsString);
  }

  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
  }
};

describe('Slider', () => {
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

    cy.switchQuestionType(QuestionType.SLIDER);

    // empty min
    const new1 = { ...newSliderData, min: null } as SliderValues;
    const dataValue = (data as SliderAppDataData).value;
    fillSliderQuestion(new1, dataValue);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX)
    );
    // empty max
    const new2 = { ...newSliderData, max: null } as SliderValues;
    fillSliderQuestion(new2, new1.value, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX)
    );
    // // min higher than max
    const new3 = { ...newSliderData, min: 100, max: 30 };
    fillSliderQuestion(new3, new2.value, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.SLIDER_MIN_SMALLER_THAN_MAX)
    );

    fillSliderQuestion(newSliderData, new3.value);
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
        QuestionType.SLIDER
      );
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      cy.get(`${dataCyWrapper(SLIDER_MIN_FIELD_CY)} input`).should(
        'have.value',
        data.min
      );
      cy.get(`${dataCyWrapper(SLIDER_MAX_FIELD_CY)} input`).should(
        'have.value',
        data.max
      );
      cy.get(`${dataCyWrapper(SLIDER_CY)} input`).should(
        'have.value',
        data.value
      );
      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      const dataValue = (data as SliderAppDataData).value;
      fillSliderQuestion(newSliderData, dataValue);

      // click new question and come back
      cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', newSliderData.question);

      cy.get(`${dataCyWrapper(SLIDER_MIN_FIELD_CY)} input`).should(
        'have.value',
        newSliderData.min
      );
      cy.get(`${dataCyWrapper(SLIDER_MAX_FIELD_CY)} input`).should(
        'have.value',
        newSliderData.max
      );
      cy.get(`${dataCyWrapper(SLIDER_CY)} input`).should(
        'not.have.value',
        data.value
      );
      cy.checkExplanationField(newSliderData.explanation);
    });
  });
});
