import { Context, PermissionLevel } from '@graasp/sdk';

import { MultipleChoicesChoice } from '../../../../src/components/types/types';
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
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  NAVIGATION_ADD_QUESTION_BUTTON_CY,
  buildMultipleChoiceAddAnswerHintButtonCy,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceAnswerHintCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
  buildMultipleChoiceDeleteAnswerHintButtonCy,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../../fixtures/appSettings';

const t = i18n.t;

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.MULTIPLE_CHOICES
);

const id = data.questionId;

const newMultipleChoiceData = {
  question: 'new question text',
  choices: [
    {
      value: 'new choice 1',
      isCorrect: true,
      explanation: 'reason 1',
    },
    {
      value: 'new choice 2',
      isCorrect: true,
      explanation: 'reason 2',
    },
    {
      value: 'new choice 3',
      isCorrect: false,
      explanation: 'reason 3',
    },
    {
      value: 'new choice 4',
      isCorrect: false,
      explanation: 'reason 4',
    },
  ],
  explanation: 'my new explanation',
  hints: 'my new hints',
};

export const fillMultipleChoiceQuestion = (
  {
    choices,
    question,
    explanation,
    hints,
  }: {
    choices: MultipleChoicesChoice[];
    question: string;
    explanation: string;
    hints: string;
  },
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
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input[type="checkbox"]`
        ).click();
      }
    });
  });

  cy.fillHints(hints);
  cy.fillExplanation(explanation);

  // save
  if (shouldSave) {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).click();
  } else {
    cy.get(dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)).should('be.disabled');
  }
};

describe('Multiple Choices', () => {
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

    // no question text
    const new1 = { ...newMultipleChoiceData, question: '' };
    fillMultipleChoiceQuestion(new1, { shouldSave: false });
    cy.checkErrorMessage({ errorMessage: t(FAILURE_MESSAGES.EMPTY_QUESTION) });

    // empty answer
    const new2 = {
      ...newMultipleChoiceData,
      choices: [
        ...newMultipleChoiceData.choices,
        { value: '', isCorrect: true, explanation: '' },
      ],
    };
    fillMultipleChoiceQuestion(new2, { shouldSave: false });
    cy.checkErrorMessage({
      errorMessage: t(FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE),
    });

    // no correct answer
    const new3 = {
      ...newMultipleChoiceData,
      choices: [
        { value: 'choice1', isCorrect: false, explanation: 'reason 1' },
        { value: 'choice2', isCorrect: false, explanation: 'reason 2' },
        { value: 'choice2', isCorrect: false, explanation: 'reason 3' },
      ],
    };
    fillMultipleChoiceQuestion(new3, { shouldSave: false });
    cy.checkErrorMessage({
      errorMessage: t(FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER),
    });

    fillMultipleChoiceQuestion(newMultipleChoiceData);
    cy.checkErrorMessage({});

    cy.checkHintsField(newMultipleChoiceData.hints);
    cy.checkExplanationField(newMultipleChoiceData.explanation);
  });

  it('Add explanations', () => {
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

    fillMultipleChoiceQuestion(newMultipleChoiceData);

    newMultipleChoiceData.choices.forEach(({ explanation }, idx) => {
      cy.get(
        dataCyWrapper(buildMultipleChoiceAddAnswerHintButtonCy(idx))
      ).should('be.visible');
      cy.get(
        dataCyWrapper(buildMultipleChoiceAddAnswerHintButtonCy(idx))
      ).click();
      cy.get(`${dataCyWrapper(buildMultipleChoiceAnswerHintCy(idx))} textarea`)
        .should('be.visible')
        .should('have.value', '');
      if (explanation.length) {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerHintCy(idx))} textarea`
        )
          .first()
          .type(explanation);
        cy.get(
          dataCyWrapper(buildMultipleChoiceDeleteAnswerHintButtonCy(idx))
        ).should('be.visible');
        cy.get(
          dataCyWrapper(buildMultipleChoiceDeleteAnswerHintButtonCy(idx))
        ).click();
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerHintCy(idx))} textarea`
        ).should('not.exist');
        cy.get(
          dataCyWrapper(buildMultipleChoiceAddAnswerHintButtonCy(idx))
        ).should('be.visible');
      }
    });
  });

  it('Duplicated answers are not allowed', () => {
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

    const new1 = {
      ...newMultipleChoiceData,
      choices: [
        ...newMultipleChoiceData.choices,
        { value: 'choice1', isCorrect: true, explanation: '' },
        { value: 'choice1', isCorrect: true, explanation: '' },
      ],
    };
    fillMultipleChoiceQuestion(new1, { shouldSave: false });
    cy.checkErrorMessage({
      errorMessage: t(FAILURE_MESSAGES.MULTIPLE_CHOICES_DUPLICATED_CHOICE),
    });
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
    });

    it('Show saved question', () => {
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`)
        .should('be.visible')
        .should('have.value', data.question);
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QuestionType.MULTIPLE_CHOICES
      );
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id)))
        .should('be.visible')
        .should('contain', data.question);

      const choices = data.choices as MultipleChoicesChoice[];

      choices.forEach(({ value, isCorrect, explanation }, idx) => {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input`
        ).should('have.value', value);
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerHintCy(idx))} textarea`
        )
          .should('be.visible')
          .should('have.value', explanation);
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input`
        ).should(isCorrect ? 'be.checked' : 'not.be.checked');
      });

      cy.checkHintsField(data.hints);
      cy.checkExplanationField(data.explanation);
    });

    it('Update question', () => {
      fillMultipleChoiceQuestion(newMultipleChoiceData);

      // click new question and come back
      cy.get(dataCyWrapper(NAVIGATION_ADD_QUESTION_BUTTON_CY)).click();
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

      // question bar should be updated
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id)))
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

      cy.checkHintsField(newMultipleChoiceData.hints);
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
