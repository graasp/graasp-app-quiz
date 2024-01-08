import { Context } from '@graasp/sdk';

import {
  QuestionStatus,
  QuestionStepStyleKeys,
} from '../../../src/components/navigation/questionNavigation/QuestionStep';
import { AppSettingData, TextAppDataData } from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildPlayViewTextInputCy,
  buildQuestionStepCy,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { mockAppDataFactory } from '../../../src/data/factories';
import { mockItem } from '../../../src/data/items';
import { mockCurrentMember } from '../../../src/data/members';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
  setAttemptsOnAppSettings,
} from '../../fixtures/appSettings';

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.TEXT_INPUT
);

const id = data.questionId;

const { text } = data as TextAppDataData;

const textAppSettingsData = APP_SETTINGS[1].data as AppSettingData;

const getPlayViewTextInputCy = (isCorrect: boolean) =>
  buildPlayViewTextInputCy(isCorrect);

const submitAnswer = (answer: string, hasPreviousAnswer?: boolean) => {
  // Without this wait, the clear seems to be executed during typing the answer.
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(200);
  cy.get(
    `${dataCyWrapper(
      buildPlayViewTextInputCy(hasPreviousAnswer ? false : undefined)
    )} input`
  ).clear();
  cy.get(`${dataCyWrapper(buildPlayViewTextInputCy())} input`).type(answer);
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
};

/**
 * Checks that the textfield's class is success if answer is correct or error if not.
 * @param isCorrect Indicates if the user's answer correct.
 */
const checkAnswer = (isCorrect: boolean) => {
  cy.get(`${dataCyWrapper(getPlayViewTextInputCy(isCorrect))} div`).then(($el) => {
    expect($el.attr('class').toLowerCase()).to.contain(
      isCorrect ? 'success' : 'error'
    );
  });
};

/**
 * Checks that the textfield and header's status use correct css class.
 * @param isCorrect Indicates if the user's answer correct.
 */
const checkAnswerAndHeaderStatus = (status: QuestionStatus) => {
  checkAnswer(status === QuestionStepStyleKeys.CORRECT);
  // success or error displayed in question bar
  cy.checkQuizNavigationStatus(status);
};

// go to another question and comeback, data should have been saved
const goToAnotherQuestionAndComeBack = (status: QuestionStatus) => {
  cy.get(
    dataCyWrapper(
      buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[0].data.questionId)
    )
  ).click();
  cy.get(dataCyWrapper(buildQuestionStepCy(id, status))).click();
};

/**
 * Checks that the textfield and submit buttons are disabled or not.
 * It is useful to check that:
 *  - no more answers can be send if maximum of attempts are reached
 *  - no more answers can be send if the answer is correct
 *  - the user can send answers when the max number of attempts are reached
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 */
const checkInputDisabled = (shouldBeDisabled: boolean, isCorrect: boolean) => {
  const status = `${shouldBeDisabled ? '' : 'not.'}be.disabled`;
  cy.get(`${dataCyWrapper(getPlayViewTextInputCy(isCorrect))} input`).should(
    status
  );
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);
};

const checkTextValueEquals = (expectedValue: string, isCorrect: boolean) => {
  cy.get(`${dataCyWrapper(getPlayViewTextInputCy(isCorrect))} input`).should(
    'have.value',
    expectedValue
  );
};

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

        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      });
      it('Start with empty data', () => {
        cy.get(dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)).should(
          'contain',
          data.question
        );

        // empty answer
        cy.get(`${dataCyWrapper(buildPlayViewTextInputCy())} input`).should(
          'be.empty'
        );

        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(null);
      });

      it('Correct app data', () => {
        submitAnswer(text);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(data.explanation);

        checkInputDisabled(true, true);
      });

      it('Incorrect app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.INCORRECT);

        goToAnotherQuestionAndComeBack(QuestionStepStyleKeys.INCORRECT);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.INCORRECT);

        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(data.explanation);

        checkInputDisabled(true, false);
      });

      it('Correct response but with unmatched case', () => {
        submitAnswer(text.toUpperCase());

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        cy.checkHintsPlay(null);
        
        checkInputDisabled(true, true);
      });

      it('Correct response but with trailing space', () => {
        submitAnswer(`${data.text} `);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        cy.checkHintsPlay(null);

        checkInputDisabled(true, true);
      });

      it('Correct response but with trailing newline', () => {
        submitAnswer(`${data.text}\n`);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        cy.checkHintsPlay(null);

        checkInputDisabled(true, true);
      });

      it('Correct response but with starting space', () => {
        submitAnswer(` ${data.text}`);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        cy.checkHintsPlay(null);

        checkInputDisabled(true, true);
      });
    });

    describe('AppSettings with 3 attempts', () => {
      const NUMBER_OF_ATTEMPTS = 3;

      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');

        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      });

      it('Correct app data', () => {
        submitAnswer(text);

        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);

        checkInputDisabled(true, true);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });

        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(data.explanation);
      });

      it('Incorrect app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        goToAnotherQuestionAndComeBack(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkInputDisabled(false, false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
        explanationShouldNotBeVisible();
        cy.checkHintsPlay(textAppSettingsData.hints);

        const incorrectAnswer = 'still incorrect answer';
        submitAnswer(incorrectAnswer, true);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        goToAnotherQuestionAndComeBack(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkTextValueEquals(incorrectAnswer, false);
        explanationShouldNotBeVisible();
        cy.checkHintsPlay(textAppSettingsData.hints);

        submitAnswer('still not correct', true);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.INCORRECT);
        checkInputDisabled(true, false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 3,
          isCorrect: false,
        });
        cy.checkExplanationPlay(data.explanation);
        cy.checkHintsPlay(null);
      });

      it('Incorrect, but then correct app data', () => {
        submitAnswer('incorrect answer');
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        goToAnotherQuestionAndComeBack(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);
        checkInputDisabled(false, false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
        explanationShouldNotBeVisible();
        cy.checkHintsPlay(textAppSettingsData.hints);

        submitAnswer(text, true);
        checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);
        checkInputDisabled(true, true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 2,
          isCorrect: true,
        });
        cy.checkExplanationPlay(data.explanation);
        cy.checkHintsPlay(null);
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

        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      });

      it('Show saved question', () => {
        checkTextValueEquals(incorrectAppData.data.text, false);

        cy.checkExplanationPlay(data.explanation);
        cy.checkHintsPlay(null);
      });
    });

    describe('AppSettings with 3 attempts (increased)', () => {
      describe('Invalid AppData, user can retry', () => {
        beforeEach(() => {
          cy.setUpApi({
            database: {
              appSettings: setAttemptsOnAppSettings(APP_SETTINGS, 3),
              appData: [incorrectAppData],
            },
            appContext: {
              context: Context.Player,
            },
          });
          cy.visit('/');

          cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
        });

        it('Show saved question, user can retry', () => {
          checkTextValueEquals(incorrectAppData.data.text, false);

          explanationShouldNotBeVisible();
          checkInputDisabled(false, false);
          checkAnswerAndHeaderStatus(QuestionStepStyleKeys.REMAIN_ATTEMPTS);

          submitAnswer(text, true);
          checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);
          checkInputDisabled(true, true);
          cy.checkExplanationPlay(data.explanation);
          cy.checkHintsPlay(null);
        });
      });

      describe('Correct AppData, quizz is in readonly', () => {
        beforeEach(() => {
          cy.setUpApi({
            database: {
              appSettings: setAttemptsOnAppSettings(APP_SETTINGS, 3),
              appData: [correctAppData],
            },
            appContext: {
              context: Context.Player,
            },
          });
          cy.visit('/');

          cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
        });

        it('Show saved question', () => {
          checkTextValueEquals(correctAppData.data.text, true);

          checkAnswerAndHeaderStatus(QuestionStepStyleKeys.CORRECT);
          checkInputDisabled(true, true);
          cy.checkExplanationPlay(data.explanation);
          cy.checkHintsPlay(null);
        });
      });
    });
  });
});
