import { Context } from '@graasp/sdk';

import { TextAppDataData } from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_CY,
  NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_TEXT_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  PLAY_VIEW_TEXT_INPUT_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { mockAppDataFactory } from '../../../src/data/factories';
import { mockItem } from '../../../src/data/items';
import { mockCurrentMember } from '../../../src/data/members';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
  getAppSetting,
} from '../../fixtures/appSettings';

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.TEXT_INPUT
);

const id = data.questionId;

const { text } = data as TextAppDataData;

const submitAnswer = (answer: string) => {
  cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).clear();
  cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(answer);
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
};

/**
 * Checks that the textfield's class is success if answer is correct or error if not.
 * @param isCorrect Indicates if the user's answer correct.
 */
const checkAnswer = (isCorrect: boolean) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500);
  cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} div`).then(($el) => {
    expect($el.attr('class').toLowerCase()).to.contain(
      isCorrect ? 'success' : 'error'
    );
  });
};

/**
 * Checks that the textfield and header's status use correct css class.
 * @param isCorrect Indicates if the user's answer correct.
 */
const checkAnswerAndHeaderStatus = (isCorrect: boolean) => {
  checkAnswer(isCorrect);
  // success or error displayed in question bar
  cy.checkStepStatus(id, isCorrect);
};

const checkNumberOfAttemptsProgression = ({
  numberOfAttempts,
  currentAttempts,
  isCorrect,
}: {
  numberOfAttempts: number;
  currentAttempts: number;
  isCorrect?: boolean;
}) => {
  cy.get(
    `${dataCyWrapper(NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_TEXT_CY)}`
  ).contains(`${currentAttempts}/${numberOfAttempts}`);

  if (currentAttempts > 0) {
    cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_CY)}`).then(
      ($el) => {
        expect($el.attr('class').toLowerCase()).to.contain(
          isCorrect ? 'success' : 'error'
        );
      }
    );
  }
};

// go to another question and comeback, data should have been saved
const goToAnotherQuestionAndComeBack = () => {
  cy.get(
    dataCyWrapper(buildQuestionStepCy(QUESTION_APP_SETTINGS[0].data.questionId))
  ).click();
  cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
};

/**
 * Checks that the textfield and submit buttons are disabled or not.
 * It is useful to check that:
 *  - no more answers can be send if maximum of attempts are reached
 *  - no more answers can be send if the answer is correct
 *  - the user can send answers when the max number of attempts are reached
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 */
const checkInputDisabled = (shouldBeDisabled: boolean) => {
  const status = `${shouldBeDisabled ? '' : 'not.'}be.disabled`;
  cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).should(status);
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);
};

const checkTextValueEquals = (expectedValue: string) =>
  cy
    .get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`)
    .should('have.value', expectedValue);

const explanationShouldNotBeVisible = () => cy.checkExplanationPlay(undefined);

describe('Play Text Input', () => {
  describe('Empty app data', () => {
    describe('AppSettings with only 1 attempt', () => {
      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');

        cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      });
      it('Start with empty data', () => {
        cy.get(dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)).should(
          'contain',
          data.question
        );

        // empty answer
        cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).should(
          'be.empty'
        );

        cy.checkExplanationPlay(null);
      });

      it('Correct app data', () => {
        submitAnswer(text);

        checkAnswerAndHeaderStatus(true);

        cy.checkExplanationPlay(data.explanation);

        checkInputDisabled(true);
      });

      it('Incorrect app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(false);

        goToAnotherQuestionAndComeBack();

        checkAnswerAndHeaderStatus(false);

        cy.checkExplanationPlay(data.explanation);

        checkInputDisabled(true);
      });

      it('Correct response but with unmatched case', () => {
        submitAnswer(text.toUpperCase());

        checkAnswerAndHeaderStatus(true);

        checkInputDisabled(true);
      });

      it('Correct response but with trailing space', () => {
        submitAnswer(`${data.text} `);

        checkAnswerAndHeaderStatus(true);

        checkInputDisabled(true);
      });

      it('Correct response but with trailing newline', () => {
        submitAnswer(`${data.text}\n`);

        checkAnswerAndHeaderStatus(true);

        checkInputDisabled(true);
      });

      it('Correct response but with starting space', () => {
        submitAnswer(` ${data.text}`);

        checkAnswerAndHeaderStatus(true);

        checkInputDisabled(true);
      });
    });

    describe('AppSettings with 3 attempts', () => {
      const NUMBER_OF_ATTEMPTS = 3;

      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: getAppSetting(APP_SETTINGS, NUMBER_OF_ATTEMPTS),
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');

        cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      });

      it('Correct app data', () => {
        submitAnswer(text);

        checkAnswerAndHeaderStatus(true);

        checkInputDisabled(true);

        checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });

        cy.checkExplanationPlay(data.explanation);
      });

      it('Incorrect app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(false);
        goToAnotherQuestionAndComeBack();
        checkAnswerAndHeaderStatus(false);
        checkInputDisabled(false);
        checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
        explanationShouldNotBeVisible();

        const incorrectAnswer = 'still incorrect answer';
        submitAnswer(incorrectAnswer);
        checkAnswerAndHeaderStatus(false);
        goToAnotherQuestionAndComeBack();
        checkAnswerAndHeaderStatus(false);
        checkTextValueEquals(incorrectAnswer);
        explanationShouldNotBeVisible();

        submitAnswer('still not correct');
        checkAnswerAndHeaderStatus(false);
        checkInputDisabled(true);
        checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 3,
          isCorrect: false,
        });
        cy.checkExplanationPlay(data.explanation);
      });

      it('Incorrect, but then correct app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(false);
        cy.checkStepStatus(id, false);
        goToAnotherQuestionAndComeBack();
        checkAnswerAndHeaderStatus(false);
        checkInputDisabled(false);
        checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
        explanationShouldNotBeVisible();

        submitAnswer(text);
        checkAnswerAndHeaderStatus(true);
        checkInputDisabled(true);
        checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 2,
          isCorrect: true,
        });
        cy.checkExplanationPlay(data.explanation);
      });
    });
  });

  describe('Display saved settings', () => {
    const incorrectAppData = mockAppDataFactory({
      id: 'app-data-id',
      item: mockItem,
      creator: mockCurrentMember,
      data: {
        questionId: id,
        text: 'my answer',
      },
    });

    const correctAppData = mockAppDataFactory({
      id: 'app-data-id',
      item: mockItem,
      creator: mockCurrentMember,
      data: {
        questionId: id,
        text,
      },
    });

    describe('AppSettings with only 1 attempt', () => {
      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [incorrectAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');

        cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      });

      it('Show saved question', () => {
        checkTextValueEquals(incorrectAppData.data.text);

        cy.checkExplanationPlay(data.explanation);
      });
    });

    describe('AppSettings with 3 attempts (increased)', () => {
      describe('Invalid AppData, user can retry', () => {
        beforeEach(() => {
          cy.setUpApi({
            database: {
              appSettings: getAppSetting(APP_SETTINGS, 3),
              appData: [incorrectAppData],
            },
            appContext: {
              context: Context.Player,
            },
          });
          cy.visit('/');

          cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
        });

        it('Show saved question, user can retry', () => {
          checkTextValueEquals(incorrectAppData.data.text);

          explanationShouldNotBeVisible();
          checkInputDisabled(false);
          checkAnswerAndHeaderStatus(false);

          submitAnswer(text);
          checkAnswerAndHeaderStatus(true);
          checkInputDisabled(true);
          cy.checkExplanationPlay(data.explanation);
        });
      });

      describe('Correct AppData, quizz is in readonly', () => {
        beforeEach(() => {
          cy.setUpApi({
            database: {
              appSettings: getAppSetting(APP_SETTINGS, 3),
              appData: [correctAppData],
            },
            appContext: {
              context: Context.Player,
            },
          });
          cy.visit('/');

          cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
        });

        it('Show saved question', () => {
          checkTextValueEquals(correctAppData.data.text);

          checkAnswerAndHeaderStatus(true);
          checkInputDisabled(true);
          cy.checkExplanationPlay(data.explanation);
        });
      });
    });
  });
});
