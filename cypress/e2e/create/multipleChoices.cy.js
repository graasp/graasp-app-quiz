import {
  APP_SETTING_NAMES,
  FAILURE_MESSAGES,
  PERMISSION_LEVELS,
  QUESTION_TYPES,
} from '../../../src/config/constants';
import { CONTEXTS } from '../../../src/config/contexts';
import i18n from '../../../src/config/i18n';
import {
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  QUESTION_BAR_PREV_CY,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const t = i18n.t;

const { data, id } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QUESTION_TYPES.MULTIPLE_CHOICES
);

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
    {
      value: 'new choice 3',
      isCorrect: false,
    },
    {
      value: 'new choice 4',
      isCorrect: false,
    },
  ],
  explanation: 'my new explanation',
};

const fillMultipleChoiceQuestion = (
  { choices, question, explanation },
  { shouldSave = true } = {}
) => {
  // fill question if not empty
  cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
  if (question.length) {
    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(question);
  }

  // fill choices
  cy.get('html')
    .find(`.${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME}`)
    .its('length')
    .then((nbAnswers) => {
      // add or remove answers fields
      const difference = choices.length - nbAnswers;
      if (difference > 0) {
        for (let i = 0; i < difference; i++) {
          cy.get(dataCyWrapper(MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY)).click();
        }
      }
      if (difference < 0) {
        for (let i = 0; i < -difference; i++) {
          cy.get(
            dataCyWrapper(buildMultipleChoiceDeleteAnswerButtonCy(0))
          ).click();
        }
      }
    });

  choices.forEach(({ value, isCorrect }, idx) => {
    cy.get(
      `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input[type="text"]`
    ).clear();
    if (value.length) {
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input[type="text"]`
      ).type(value);
    }
    // click if correctness is different from original data

    cy.get(
      `${dataCyWrapper(
        buildMultipleChoiceAnswerCy(idx)
      )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input[type="checkbox"]`
    ).then(($el) => {
      if (isCorrect !== $el.prop('checked')) {
        $el.click();
      }
    });
  });

  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
  }
};

describe('Multiple Choices', () => {
  it('Start with empty data and save question', () => {
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

    // no question text
    const new1 = { ...newMultipleChoiceData, question: '' };
    fillMultipleChoiceQuestion(new1);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.EMPTY_QUESTION)
    );

    // empty answer
    const new2 = {
      ...newMultipleChoiceData,
      choices: [
        ...newMultipleChoiceData.choices,
        { value: '', isCorrect: true },
      ],
    };
    fillMultipleChoiceQuestion(new2, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE)
    );

    // no correct answer
    const new3 = {
      ...newMultipleChoiceData,
      choices: [
        { value: 'choice1', isCorrect: false },
        { value: 'choice2', isCorrect: false },
        { value: 'choice2', isCorrect: false },
      ],
    };
    fillMultipleChoiceQuestion(new3, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      t(FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER)
    );

    fillMultipleChoiceQuestion(newMultipleChoiceData);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should('not.exist');

    cy.checkExplanationField(newMultipleChoiceData.explanation);
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
    });

    it('Show saved question', () => {
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`)
        .should('be.visible')
        .should('have.value', data.question);
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_TYPES.MULTIPLE_CHOICES
      );
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      data.choices.forEach(({ value, isCorrect }, idx) => {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input`
        ).should('have.value', value);
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input`
        ).should(isCorrect ? 'be.checked' : 'not.be.checked');
      });
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');

      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      fillMultipleChoiceQuestion(newMultipleChoiceData);

      // click new question and come back
      cy.get(`.${QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME}`).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepCy(id)))
        .should('be.visible')
        .should('contain', newMultipleChoiceData.question);

      newMultipleChoiceData.choices.forEach(({ value, isCorrect }, idx) => {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input`
        ).should('have.value', value);
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input`
        ).should(isCorrect ? 'be.checked' : 'not.be.checked');
      });

      cy.checkExplanationField(newMultipleChoiceData.explanation);
    });

    it('Delete answers until two remain', () => {
      // delete 2th and 4th answers
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceDeleteAnswerButtonCy(3))}`
      ).click();
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceDeleteAnswerButtonCy(1))}`
      ).click();

      // remaining answers cannot be deleted
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceDeleteAnswerButtonCy(0))}`
      ).should('be.disabled');
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceDeleteAnswerButtonCy(1))}`
      ).should('be.disabled');
    });
  });
});
