import { Context } from '@graasp/sdk';

import { QuestionStepStyleKeys } from '../../../src/components/navigation/questionNavigation/types';
import {
  AppSettingData,
  TextAppDataData,
} from '../../../src/components/types/types';
import {
  APP_SETTING_NAMES,
  FILL_BLANKS_TYPE,
  QuestionType,
} from '../../../src/config/constants';
import {
  FILL_BLANKS_CORRECTION_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_RETRY_BUTTON_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildBlankedTextWordCy,
  buildFillBlanksAnswerId,
  buildFillBlanksCorrectionAnswerCy,
  buildQuestionStepCy,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { mockAppDataFactory } from '../../../src/data/factories';
import { mockItem } from '../../../src/data/items';
import { mockCurrentMember } from '../../../src/data/members';
import {
  EMPTY_BLANK_CONTENT,
  Word,
  splitSentence,
} from '../../../src/utils/fillInTheBlanks';
import {
  APP_SETTINGS,
  FILL_BLANKS_WITH_BREAK_LINES_SETTING,
  QUESTION_APP_SETTINGS,
  setAttemptsOnAppSettings,
} from '../../fixtures/appSettings';
import { APP_SETTINGS_FILL_THE_BLANKS_WITH_DUPLICATED } from './fixtures';

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.FILL_BLANKS
);

const id = data.questionId;

const { text } = data as TextAppDataData;
const { answers, words } = splitSentence(text);

const fillBlanksAppSettingsData = APP_SETTINGS[3].data as AppSettingData;

// verify all answers styles
const checkCorrection = (
  {
    answers: responseAnswers,
  }: {
    answers: Word[];
  },
  shouldBeVisible = true
) => {
  const status = `${shouldBeVisible ? 'be.visible' : 'not.exist'}`;

  answers.forEach((answer, idx) => {
    if (shouldBeVisible) {
      cy.get(dataCyWrapper(FILL_BLANKS_CORRECTION_CY), {
        timeout: 5500,
      }).should('contain', answer.text);
    } else {
      cy.get(dataCyWrapper(FILL_BLANKS_CORRECTION_CY)).should('not.exist');
    }

    if (responseAnswers.length > idx) {
      const isCorrect = answer.text === responseAnswers[idx].text;

      // correction list
      cy.get(
        dataCyWrapper(buildFillBlanksCorrectionAnswerCy(answer.id, isCorrect))
      ).should(status);

      // blank
      cy.get(`[data-id="${answer.id}"]`)
        .should('contain', responseAnswers[idx].text)
        .should('have.attr', 'data-correctness', isCorrect ? 'true' : 'false');
    } else {
      // response answer doesn't exist because the initial sentence changed
      // so it's false by default
      cy.get(
        dataCyWrapper(buildFillBlanksCorrectionAnswerCy(answer.id, false))
      ).should(status);

      // blank
      cy.get(`[data-id="${answer.id}"]`).should(
        'have.attr',
        'data-correctness',
        'false'
      );
    }

    if (shouldBeVisible) {
      cy.checkExplanationPlay(data.explanation);
    } else {
      cy.checkExplanationPlay(null);
    }
  });
};

/**
 * Checks that the answers, blanks and submit button are disabled or not.
 * It is useful to check that:
 *  - no more answers can be sent if maximum of attempts are reached
 *  - no more answers can be sent if the answer is correct
 *  - the user can send answers when the max number of attempts is not reached yet
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 */
const checkInputDisabled = (shouldBeDisabled: boolean) => {
  const status = `${shouldBeDisabled ? '' : 'not.'}be.disabled`;
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);

  const checkElementStatus = (el: JQuery<HTMLElement>) => {
    if (el.length) {
      cy.wrap(el).should('have.attr', 'data-disabled', `${shouldBeDisabled}`);
    }
  };

  // ignore if the element not exist.
  const ignoreNotExist = 'have.length.gte';

  answers.forEach((answer) => {
    // check the answers on top
    cy.get(dataCyWrapper(buildFillBlanksAnswerId(answer.id)))
      .should(ignoreNotExist, 0)
      .then(checkElementStatus);

    // check the blanks
    cy.get(`[data-id="${answer.id}"]`)
      .should(ignoreNotExist, 0)
      .then(checkElementStatus);
  });
};

/**
 * Test if it is possible to remove an answer or not.
 * This is useful to test if the quizz is readonly.
 *
 * @param answer The answer to remove.
 * @param shouldFail Indicates if it should be possible or not.
 */
const removeAnswer = (answer: Word, shouldFail: boolean) => {
  // start by checking that the answer contains the correct text
  cy.get(`[data-id="${answer.id}"]`).should('not.be.empty');
  // need force because element is not a block
  cy.get(`[data-id="${answer.id}"]`).click({ force: true });

  if (shouldFail) {
    cy.get(`[data-id="${answer.id}"]`).should('not.be.empty');
  } else {
    // testing should contain '' seems not to work, so check is empty.
    cy.get(`[data-id="${answer.id}"]`).should('contain', EMPTY_BLANK_CONTENT);
  }
};

const checkBadAnswersAreReset = (state: { answers: Word[]; words: Word[] }) => {
  const correctAnswersId = state.words
    .filter((w) => w.displayed === w.text)
    .map((w) => w.id);

  state.answers.forEach((answer) => {
    if (correctAnswersId.find((id) => id === answer.id)) {
      cy.get(`[data-id="${answer.id}"]`).should('contain', answer.text);
    } else {
      cy.get(`[data-id="${answer.id}"]`).should('contain', '');
    }
  });
};

describe('Play Fill In The Blanks', () => {
  describe('Only 1 attempt', () => {
    const NUMBER_OF_ATTEMPTS = 1;

    describe('Empty data', () => {
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

      it('Start with empty app data', () => {
        cy.get(dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)).should(
          'contain',
          data.question
        );

        // all answers are displayed
        answers.forEach((answer) => {
          cy.get(dataCyWrapper(buildFillBlanksAnswerId(answer.id))).should(
            'contain',
            answer.text
          );
        });

        // text and blanks are displayed
        words.forEach((w) => {
          if (w.type === FILL_BLANKS_TYPE.WORD) {
            cy.get(dataCyWrapper(buildBlankedTextWordCy(w.id))).should(
              'contain',
              w.text
            );
          } else {
            cy.get(dataCyWrapper(buildBlankedTextWordCy(w.id))).should(
              'contain',
              EMPTY_BLANK_CONTENT
            );
          }
        });
        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(null);
        checkInputDisabled(false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 0,
        });
      });

      // todo: difficult to test drag and drop
    });

    describe('Display saved settings', () => {
      const buildAppData = (text: string) =>
        mockAppDataFactory({
          id: 'app-data-1',
          item: mockItem,
          creator: mockCurrentMember,
          data: {
            questionId: id,
            text,
          },
        });

      it('Show correct saved question', () => {
        const correctAppData = buildAppData(
          'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.'
        );
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [correctAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(
          dataCyWrapper(buildQuestionStepCy(id, QuestionStepStyleKeys.CORRECT))
        ).click();
        const data = correctAppData.data;

        checkCorrection(splitSentence(data.text));

        // hints should be hidden
        cy.checkHintsPlay(null);

        // delete one answer
        removeAnswer(answers[0], true);
        checkInputDisabled(true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });
      });

      it('Show partially correct saved question', () => {
        const partiallyCorrectAppData = buildAppData(
          'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <wefwe> ut fermentum nulla, sed <suscipit> sem.'
        );
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [partiallyCorrectAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(id, QuestionStepStyleKeys.INCORRECT)
          )
        ).click();

        const data = partiallyCorrectAppData.data;
        checkCorrection(splitSentence(data.text));

        // hints should be hidden
        cy.checkHintsPlay(null);

        removeAnswer(answers[0], true);
        checkInputDisabled(true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it('Show partially correct saved question with duplicate words', () => {
        const partiallyCorrectAppData = buildAppData(
          'Lorem <> dolor sit amet, consectetur adipiscing elit. <something> ut fermentum nulla, sed <> sem.'
        );
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS_FILL_THE_BLANKS_WITH_DUPLICATED,
            appData: [partiallyCorrectAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');

        // answer block still exists
        cy.get(`${dataCyWrapper(buildFillBlanksAnswerId(3))}`).should(
          'have.text',
          'something'
        );

        // dropped answer block exists  and is displayed
        cy.get(`${dataCyWrapper(buildBlankedTextWordCy(3))}`).should(
          'have.text',
          'something'
        );
      });

      it('Show unmatching and shorter saved question', () => {
        const shorterAppData = buildAppData(
          'Lorem <ergerg> dolor sit amet, consectetur adipiscing elit.'
        );
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [shorterAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(id, QuestionStepStyleKeys.INCORRECT)
          )
        ).click();

        const data = shorterAppData.data;
        checkCorrection(splitSentence(data.text));

        // hints should be hidden
        cy.checkHintsPlay(null);

        removeAnswer(answers[0], true);
        checkInputDisabled(true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it('Show unmatching and longer saved question', () => {
        const longerAppData = buildAppData(
          'Lorem <ergerg> dolor <sit> amet, <consectetur> <adipiscing> elit.'
        );
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [longerAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

        // hints should be hidden
        cy.checkHintsPlay(null);

        // we do not check correction: nothing matches
        // but we want to know that the app didn't crash

        removeAnswer(answers[0], true);
        checkInputDisabled(true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });
    });
  });

  describe('3 attempts', () => {
    const NUMBER_OF_ATTEMPTS = 3;

    describe('Display saved settings', () => {
      const buildAppData = (text: string, questionId = id) =>
        mockAppDataFactory({
          id: 'app-data-1',
          item: mockItem,
          creator: mockCurrentMember,
          data: {
            questionId,
            text,
          },
        });

      it('Show correct saved question', () => {
        const correctAppData = buildAppData(
          'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.'
        );
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
            appData: [correctAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
        const data = correctAppData.data;

        checkCorrection(splitSentence(data.text));

        // hints should be hidden
        cy.checkHintsPlay(null);

        // delete one answer
        removeAnswer(answers[0], true);
        checkInputDisabled(true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });
      });

      it('Show partially correct saved question', () => {
        const partiallyCorrectAppData = buildAppData(
          'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <wefwe> ut fermentum nulla, sed <suscipit> sem.'
        );
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
            appData: [partiallyCorrectAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

        const data = partiallyCorrectAppData.data;
        checkCorrection(splitSentence(data.text), false);

        // hints should be displayed
        cy.checkHintsPlay(fillBlanksAppSettingsData.hints);

        // check that user have to click on retry before updating their answer
        removeAnswer(answers[2], true);
        cy.get(dataCyWrapper(PLAY_VIEW_RETRY_BUTTON_CY)).click();

        // check that the input is reset on retry and keep only correct answers
        checkBadAnswersAreReset(
          splitSentence(partiallyCorrectAppData.data.text)
        );

        removeAnswer(answers[2], false);

        checkInputDisabled(false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it('Show unmatching and shorter saved question', () => {
        const shorterAppData = buildAppData(
          'Lorem <ergerg> dolor sit amet, consectetur adipiscing elit.'
        );
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
            appData: [shorterAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();

        const data = shorterAppData.data;
        checkCorrection(splitSentence(data.text), false);

        // hints should be displayed
        cy.checkHintsPlay(fillBlanksAppSettingsData.hints);

        cy.get(dataCyWrapper(PLAY_VIEW_RETRY_BUTTON_CY)).click();

        checkInputDisabled(false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it.only('Show break lines', () => {
        const questionId = FILL_BLANKS_WITH_BREAK_LINES_SETTING.data.questionId;
        const longerAppData = buildAppData(
          'Lorem <ipsum> dolor sit amet, consectetur \n\nadipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
          questionId
        );
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
            appData: [longerAppData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(questionId))).click();

        // check break lines
        cy.get(dataCyWrapper(buildBlankedTextWordCy(2)))
          .first()
          .next()
          .get('br')
          .should('exist');
      });
    });
  });
});
