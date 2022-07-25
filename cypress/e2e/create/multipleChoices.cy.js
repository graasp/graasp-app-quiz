import {
  APP_SETTING_NAMES,
  DEFAULT_QUESTION,
  DEFAULT_QUESTION_TYPE,
  FAILURE_MESSAGES,
  PERMISSION_LEVELS,
  QUESTION_TYPES,
  VIEWS,
} from '../../../src/config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_ERROR_ALERT_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY,
  MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME,
  QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME,
  QUESTION_BAR_ADD_NEW_BUTTON_CY,
  QUESTION_BAR_CY,
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  buildMultipleChoiceAnswerCy,
  buildMultipleChoiceDeleteAnswerButtonCy,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const { data, id } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QUESTION_TYPES.MULTIPLE_CHOICES
);

const newMultipleChoiceData = {
  question: 'new question text',
  choices: [
    {
      choice: 'new choice 1',
      isCorrect: true,
    },
    {
      choice: 'new choice 2',
      isCorrect: true,
    },
    {
      choice: 'new choice 3',
      isCorrect: false,
    },
    {
      choice: 'new choice 4',
      isCorrect: false,
    },
  ],
};

const fillMultipleChoiceQuestion = (
  { choices, question },
  originalAppSettingData = DEFAULT_QUESTION.data,
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

  choices.forEach(({ choice, isCorrect }, idx) => {
    cy.get(
      `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input[type="text"]`
    ).clear();
    if (choice.length) {
      cy.get(
        `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input[type="text"]`
      ).type(choice);
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
        context: VIEWS.BUILDER,
      },
    });
    cy.visit('/');

    // no question text
    const new1 = { ...newMultipleChoiceData, question: '' };
    fillMultipleChoiceQuestion(new1, DEFAULT_QUESTION.data);
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      FAILURE_MESSAGES.EMPTY_QUESTION
    );

    // empty answer
    const new2 = {
      ...newMultipleChoiceData,
      choices: [
        ...newMultipleChoiceData.choices,
        { choice: '', isCorrect: true },
      ],
    };
    fillMultipleChoiceQuestion(new2, new1, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE
    );

    // no correct answer
    const new3 = {
      ...newMultipleChoiceData,
      choices: [
        { choice: 'choice1', isCorrect: false },
        { choice: 'choice2', isCorrect: false },
        { choice: 'choice2', isCorrect: false },
      ],
    };
    fillMultipleChoiceQuestion(new3, new2, { shouldSave: false });
    cy.get(dataCyWrapper(CREATE_VIEW_ERROR_ALERT_CY)).should(
      'contain',
      FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER
    );

    fillMultipleChoiceQuestion(newMultipleChoiceData, new3);
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
          context: VIEWS.BUILDER,
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

      data.choices.forEach(({ choice, isCorrect }, idx) => {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input`
        ).should('have.value', choice);
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input`
        ).should(isCorrect ? 'be.checked' : 'not.be.checked');
      });
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).should('be.disabled');
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

      newMultipleChoiceData.choices.forEach(({ choice, isCorrect }, idx) => {
        cy.get(
          `${dataCyWrapper(buildMultipleChoiceAnswerCy(idx))} input`
        ).should('have.value', choice);
        cy.get(
          `${dataCyWrapper(
            buildMultipleChoiceAnswerCy(idx)
          )} .${MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME} input`
        ).should(isCorrect ? 'be.checked' : 'not.be.checked');
      });
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
