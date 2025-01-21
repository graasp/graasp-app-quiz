import { Context, PermissionLevel } from '@graasp/sdk';

import {
  DEFAULT_QUESTION_TYPE,
  QuestionType,
} from '../../../../src/config/constants';
import {
  ADD_NEW_QUESTION_TITLE_CY,
  CREATE_QUESTION_SELECT_TYPE_CY,
  CREATE_QUESTION_TITLE_CY,
  CREATE_VIEW_DELETE_BUTTON_CY,
  CREATE_VIEW_SAVE_BUTTON_CY,
  CREATE_VIEW_SELECT_POSITION_QUESTION_CY,
  NAVIGATION_ADD_QUESTION_BUTTON_CY,
  NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY,
  NUMBER_OF_ATTEMPTS_INPUT_CY,
  QUESTION_BAR_CY,
  QUESTION_STEP_CLASSNAME,
  TEXT_INPUT_FIELD_CY,
  buildQuestionPositionOption,
  buildQuestionStepDefaultCy,
  buildQuestionStepTitle,
  buildQuestionTypeOption,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
} from '../../../fixtures/appSettings';
import { QuizNavigator } from '../../../utils/navigation';
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
  hints: 'my new hints',
};

describe('Create View', () => {
  describe('Empty Quizz', () => {
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
    });

    it('Cannot duplicate empty data', () => {
      cy.get(dataCyWrapper(NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY)).should(
        'be.disabled'
      );
    });

    it('Add questions from empty quiz', () => {
      // Add three questions and make sure they are added to the QuestionTopBar
      cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
      fillMultipleChoiceQuestion(newMultipleChoiceData);
      // Wait for the new question to appear
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should('have.length', 1);
      cy.get(dataCyWrapper(NAVIGATION_ADD_QUESTION_BUTTON_CY)).click();
      cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
        .should('be.visible')
        .should('have.value', '');
      fillMultipleChoiceQuestion(newMultipleChoiceData);
      // Wait for the new question to appear
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should('have.length', 2);
      cy.get(dataCyWrapper(NAVIGATION_ADD_QUESTION_BUTTON_CY)).click();
      cy.get(dataCyWrapper(CREATE_QUESTION_TITLE_CY))
        .should('be.visible')
        .should('have.value', '');
      fillMultipleChoiceQuestion(newMultipleChoiceData);
      // Verify the questions are added to the order list by checking the number of
      // question nodes in the QuestionTopBar, as we cannot check the app settings directly
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should('have.length', 3);
    });
  });

  describe('Existing Quizz', () => {
    let quizNavigator: QuizNavigator;

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

      quizNavigator = new QuizNavigator({
        questionSettings: QUESTION_APP_SETTINGS,
        context: Context.Builder,
      });

      cy.visit('/');
    });

    it('Navigation', () => {
      cy.get(dataCyWrapper(QUESTION_BAR_CY)).should('be.visible');

      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_APP_SETTINGS[0].data.type
      );

      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_APP_SETTINGS[1].data.type
      );
      // go to prev
      quizNavigator.goToPrev();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_APP_SETTINGS[0].data.type
      );
      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_APP_SETTINGS[1].data.type
      );
      // go to next
      quizNavigator.goToNext();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        QUESTION_APP_SETTINGS[2].data.type
      );
    });

    it('Delete question', () => {
      const toDelete = QUESTION_APP_SETTINGS[1];
      const id = toDelete.data.questionId;
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

      // delete one
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).should('not.exist');

      // delete all
      for (let i = 0; i < QUESTION_APP_SETTINGS.length - 2; i += 1) {
        cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).click();
      }

      // fallback to new question screen if no more data
      cy.get(dataCyWrapper(CREATE_VIEW_DELETE_BUTTON_CY)).should('be.disabled');
      cy.get(dataCyWrapper(ADD_NEW_QUESTION_TITLE_CY)).should('be.visible');
    });

    it('Add question from existing quiz', () => {
      const currentQuestion = QUESTION_APP_SETTINGS[1];
      const id = currentQuestion.data.questionId;
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      // click new question and come back
      cy.get(dataCyWrapper(NAVIGATION_ADD_QUESTION_BUTTON_CY)).click();

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
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should('have.length', 5);
    });

    it('Update Question type should not create a new question', () => {
      const numberOfQuestions = 5;
      const numberOfAttempts = 3;

      // update the number of attempts to ensure that changing question type
      // keep the good the number of attempts.
      cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).clear();
      cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).type(
        `${numberOfAttempts}`
      );
      cy.get(`${dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)}`).click();

      // Check the current number of questions
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should(
        'have.length',
        numberOfQuestions
      );

      // update the question type and save
      const updatedQuestion = {
        question: 'My new text input question',
        questionType: QuestionType.TEXT_INPUT,
        answer: 'new answer',
      };
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).type(
        updatedQuestion.question
      );
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)}`).click();
      cy.get(
        `${dataCyWrapper(
          buildQuestionTypeOption(updatedQuestion.questionType)
        )}`
      ).click();
      cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)}`).type(
        updatedQuestion.answer
      );
      cy.get(`${dataCyWrapper(CREATE_VIEW_SAVE_BUTTON_CY)}`).click();

      // Check that the current number of questions is still unchanged
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should(
        'have.length',
        numberOfQuestions
      );

      // Check the question title, question type, the answer and attempts.
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).should(
        'have.value',
        updatedQuestion.question
      );
      cy.get(`${dataCyWrapper(CREATE_QUESTION_SELECT_TYPE_CY)} input`).should(
        'have.value',
        updatedQuestion.questionType
      );
      cy.get(`${dataCyWrapper(TEXT_INPUT_FIELD_CY)} input`).should(
        'have.value',
        updatedQuestion.answer
      );
      cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).should(
        'have.value',
        numberOfAttempts
      );
    });

    it('Move question to another position', () => {
      // Position idx start with 0, so index 0 is the first question.
      const FIRST_POSITION_IDX = 0;
      const THIRD_POSITION_IDX = 2;
      const firstQuestionTitle = QUESTION_APP_SETTINGS[0].data.question;

      // Check that the first question has the position 0.
      cy.get(
        `${dataCyWrapper(CREATE_VIEW_SELECT_POSITION_QUESTION_CY)} input`
      ).should('have.value', FIRST_POSITION_IDX);

      // Check that the question at position 0 is the right question by checking the question's title.
      cy.get(
        `${dataCyWrapper(buildQuestionStepTitle(FIRST_POSITION_IDX))}`
      ).should('have.text', firstQuestionTitle);

      // Move the question to the third position (index 2).
      cy.get(dataCyWrapper(CREATE_VIEW_SELECT_POSITION_QUESTION_CY)).click();
      cy.get(
        `${dataCyWrapper(buildQuestionPositionOption(THIRD_POSITION_IDX))}`
      ).click();

      cy.get(
        `${dataCyWrapper(CREATE_VIEW_SELECT_POSITION_QUESTION_CY)} input`
      ).should('have.value', THIRD_POSITION_IDX);

      cy.get(
        `${dataCyWrapper(buildQuestionStepTitle(THIRD_POSITION_IDX))}`
      ).should('have.text', firstQuestionTitle);
    });

    it('Duplicate question after the original one', () => {
      const numberOfQuestions = QUESTION_APP_SETTINGS.length;
      const currentQuestion = QUESTION_APP_SETTINGS[1];
      const currentIdx = QUESTION_APP_SETTINGS.indexOf(currentQuestion);
      const id = currentQuestion.data.questionId;

      // Check the current number of questions
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should(
        'have.length',
        numberOfQuestions
      );

      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

      // Check that the position index equals to the selected question.
      cy.get(
        `${dataCyWrapper(CREATE_VIEW_SELECT_POSITION_QUESTION_CY)} input`
      ).should('have.value', currentIdx);

      // Duplicate the current question
      cy.get(dataCyWrapper(NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY)).click();

      // Check the current number of questions increased
      cy.get(`.${QUESTION_STEP_CLASSNAME}`).should(
        'have.length',
        numberOfQuestions + 1
      );

      // Check that the new question is selected and next to previous question.
      cy.get(
        `${dataCyWrapper(CREATE_VIEW_SELECT_POSITION_QUESTION_CY)} input`
      ).should('have.value', currentIdx + 1);

      // Check that the new question's title equals the original question.
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).should(
        'have.value',
        currentQuestion.data.question
      );
    });

    it('Cannot duplicate question with error', () => {
      const currentQuestion = QUESTION_APP_SETTINGS[1];
      const id = currentQuestion.data.questionId;

      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

      // Invalidate the question
      cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).clear();

      // Duplicate the current question
      cy.get(dataCyWrapper(NAVIGATION_DUPLICATE_QUESTION_BUTTON_CY)).should(
        'be.disabled'
      );
    });
  });
});
