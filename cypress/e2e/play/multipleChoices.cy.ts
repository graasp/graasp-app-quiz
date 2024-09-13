import { Context } from '@graasp/sdk';

import { QuestionStepStyleKeys } from '../../../src/components/navigation/questionNavigation/types';
import {
  AppSettingData,
  MultipleChoicesAppSettingData,
} from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_RETRY_BUTTON_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildMultipleChoiceHintPlayCy,
  buildMultipleChoicesButtonCy,
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
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.MULTIPLE_CHOICES
);

const id = data.questionId;
const { choices } = data as MultipleChoicesAppSettingData;
const allChoicesIdx = choices.map((_c, idx) => idx);

const multipleChoiceAppSettingsData = APP_SETTINGS[0].data as AppSettingData;

// click on choices -> become selected
const clickSelection = (selection: number[]) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  selection.forEach((idx) => {
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, false))).click();
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, true))).should(
      'be.visible'
    );
  });
};

// verify all choices styles
const checkCorrection = (selection: number[], showCorrection = true) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  choices.forEach(({ isCorrect, explanation }, idx) => {
    const wasSelected = selection.includes(idx);
    const correction = (() => {
      switch (true) {
        case wasSelected && isCorrect:
          return 'success';
        // if the user forgot to select, it is an error.
        // But, because it is the correction view, the item is displayed in green.
        case !wasSelected && isCorrect:
          return showCorrection ? 'success' : '';
        case wasSelected && !isCorrect:
          return 'error';
      }
      return '';
    })();
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, wasSelected))).then(
      ($el) => {
        expect($el.attr('class').toLowerCase()).to.contain(correction);
      }
    );

    if (wasSelected && !isCorrect) {
      cy.get(dataCyWrapper(buildMultipleChoiceHintPlayCy(idx))).should(
        'contain',
        explanation
      );
    } else {
      cy.get(dataCyWrapper(buildMultipleChoiceHintPlayCy(idx))).should(
        'not.exist'
      );
    }
  });

  if (showCorrection) {
    cy.checkExplanationPlay(data.explanation);
  }
};

const checkAllChoicesAreNotSelected = () =>
  allChoicesIdx.forEach((idx) =>
    cy
      .get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, false)))
      .should('be.visible')
  );

/**
 * Checks that the buttons inputs and submit buttons are disabled or not.
 * It is useful to check that:
 *  - no more answers can be send if maximum of attempts are reached
 *  - no more answers can be send if the answer is correct
 *  - the user can send answers when the max number of attempts are reached
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 * @param shouldRetry Indicates if the retry button should be display or not.
 */
const checkInputDisabled = (
  selection: number[],
  shouldBeDisabled: boolean,
  shouldRetry = false
) => {
  const status = `${shouldBeDisabled || shouldRetry ? '' : 'not.'}be.disabled`;
  choices.forEach((_data, idx) => {
    // The choices buttons should be disabled between two attempts
    cy.get(
      dataCyWrapper(buildMultipleChoicesButtonCy(idx, selection.includes(idx)))
    ).should(status);
  });
  // If it is between two attempts, the retry button should be enabled.
  // Otherwise, submit button should be disabled.
  if (!shouldRetry) {
    cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);
    cy.get(dataCyWrapper(PLAY_VIEW_RETRY_BUTTON_CY)).should('not.exist');
  } else {
    cy.get(dataCyWrapper(PLAY_VIEW_RETRY_BUTTON_CY)).should('not.be.disabled');
    cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should('not.exist');
  }
};

describe('Play Multiple Choices', () => {
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
      });

      it('Start with empty app data', () => {
        cy.get(dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)).should(
          'contain',
          data.question
        );

        // all choices are displayed and are not selected
        choices.forEach((_data, idx) => {
          cy.get(
            dataCyWrapper(buildMultipleChoicesButtonCy(idx, false))
          ).should('be.visible');
        });
        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(null);
        checkInputDisabled([], false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 0,
        });
      });

      it('Incorrect app data', () => {
        const selection = [0, 2];
        clickSelection(selection);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

        // verify all choices styles
        checkCorrection(selection);

        // hints should be hidden
        cy.checkHintsPlay(null);

        checkInputDisabled(selection, true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it('Correct app data', () => {
        // click on choices -> become selected
        const selection = choices.reduce(
          (arr, { isCorrect }, idx) => (isCorrect ? [...arr, idx] : arr),
          []
        );

        clickSelection(selection);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

        checkCorrection(selection);

        // hints should be hidden
        cy.checkHintsPlay(null);

        checkInputDisabled(selection, true);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[1].data.questionId)
          )
        ).click();
        cy.get(
          dataCyWrapper(buildQuestionStepCy(id, QuestionStepStyleKeys.CORRECT))
        ).click();
        checkCorrection(selection);
        checkInputDisabled(selection, true);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });
      });
    });

    describe('Display saved settings', () => {
      // The user's choices don't have the same shape than the appSetting choices.
      const responseChoices = choices.slice(2).map((c) => c.value);
      const appData = mockAppDataFactory({
        id: 'app-data-1',
        item: mockItem,
        creator: mockCurrentMember,
        data: {
          questionId: id,
          choices: responseChoices,
        },
      });

      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: APP_SETTINGS,
            appData: [appData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
      });

      it('Show saved question', () => {
        const data = appData.data;
        const selection = data.choices.map((choice) =>
          choices.findIndex(({ value }) => value === choice)
        );

        checkCorrection(selection);
        // hints should be hidden
        cy.checkHintsPlay(null);
        checkInputDisabled(selection, true);
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

    describe('Empty data', () => {
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
      });

      it('Incorrect app data', () => {
        const selection = [0, 2];
        clickSelection(selection);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

        // verify all choices styles
        checkCorrection(selection, false);

        cy.checkHintsPlay(multipleChoiceAppSettingsData.hints);

        checkInputDisabled(selection, false, true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });

      it('Reset selection on retry', () => {
        const selection = [0, 2];

        clickSelection(selection);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
        cy.get(dataCyWrapper(PLAY_VIEW_RETRY_BUTTON_CY)).click();

        // Checks that the user's selection is reset on retry.
        checkAllChoicesAreNotSelected();
      });

      it('Correct app data', () => {
        // click on choices -> become selected
        const selection = choices.reduce(
          (arr, { isCorrect }, idx) => (isCorrect ? [...arr, idx] : arr),
          []
        );

        clickSelection(selection);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

        checkCorrection(selection);
        cy.checkHintsPlay(null);

        checkInputDisabled(selection, true, false);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[1].data.questionId)
          )
        ).click();
        cy.get(
          dataCyWrapper(buildQuestionStepCy(id, QuestionStepStyleKeys.CORRECT))
        ).click();
        checkCorrection(selection);
        checkInputDisabled(selection, true, false);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });
      });
    });

    describe('Display saved settings', () => {
      // The user's choices don't have the same shape than the appSetting choices.
      const responseChoices = choices.slice(2).map((c) => c.value);
      const appData = mockAppDataFactory({
        id: 'app-data-1',
        item: mockItem,
        creator: mockCurrentMember,
        data: {
          questionId: id,
          choices: responseChoices,
        },
      });

      beforeEach(() => {
        cy.setUpApi({
          database: {
            appSettings: setAttemptsOnAppSettings(
              APP_SETTINGS,
              NUMBER_OF_ATTEMPTS
            ),
            appData: [appData],
          },
          appContext: {
            context: Context.Player,
          },
        });
        cy.visit('/');
      });

      it('Show saved question', () => {
        const data = appData.data;
        const selection = data.choices.map((choice) =>
          choices.findIndex(({ value }) => value === choice)
        );

        checkCorrection(selection, false);
        cy.checkHintsPlay(multipleChoiceAppSettingsData.hints);
        checkInputDisabled(selection, false, true);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });
    });
  });
});
