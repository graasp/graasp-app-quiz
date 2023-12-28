import { Context } from '@graasp/sdk';

import { MultipleChoicesAppSettingData } from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  EXPLANATION_PLAY_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildMultipleChoicesButtonCy,
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
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.MULTIPLE_CHOICES
);

const id = data.questionId;
const { choices } = data as MultipleChoicesAppSettingData;

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
      if (wasSelected && isCorrect) {
        return 'success';
      }
      if (!wasSelected && isCorrect) {
        return 'error';
      }
      return '';
    })();
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, wasSelected))).then(
      ($el) => {
        if (wasSelected || showCorrection) {
          expect($el.attr('class').toLowerCase()).to.contain(correction);
        } else if (correction) {
          expect($el.attr('class').toLowerCase()).to.not.contain(correction);
        }
      }
    );
    // Because multiplechoice explanation is displayed for each selection or all when show correction is on,
    // it is easier to test that the explanation bloc doesn't contains the explanation, instead of
    // verifying each buildMultipleChoiceExplanationPlayCy individually.
    // Indeed, checking individually may cause problem of indexes, causing selection of inexisting explanation.
    if (wasSelected || showCorrection) {
      cy.get(dataCyWrapper(EXPLANATION_PLAY_CY)).should('contain', explanation);
    } else {
      if (explanation) {
        cy.get(dataCyWrapper(EXPLANATION_PLAY_CY)).should(
          'not.contain',
          explanation
        );
      }
    }
  });

  if (showCorrection) {
    cy.checkExplanationPlay(data.explanation);
  }
};

/**
 * Checks that the buttons inputs and submit buttons are disabled or not.
 * It is useful to check that:
 *  - no more answers can be send if maximum of attempts are reached
 *  - no more answers can be send if the answer is correct
 *  - the user can send answers when the max number of attempts are reached
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 */
const checkInputDisabled = (selection: number[], shouldBeDisabled: boolean) => {
  const status = `${shouldBeDisabled ? '' : 'not.'}be.disabled`;
  choices.forEach((_data, idx) => {
    cy.get(
      dataCyWrapper(buildMultipleChoicesButtonCy(idx, selection.includes(idx)))
    ).should(status);
  });
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);
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
        cy.checkExplanationPlay(null);
        checkInputDisabled([], false);
        cy.checkNumberOfAttemptsProgression({
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

        // error displayed in question bar
        cy.checkStepStatus(id, false);
        checkInputDisabled(selection, true);
        cy.checkNumberOfAttemptsProgression({
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

        // success displayed in question bar
        cy.checkStepStatus(id, true);
        checkInputDisabled(selection, true);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(QUESTION_APP_SETTINGS[1].data.questionId)
          )
        ).click();
        cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
        checkCorrection(selection);
        checkInputDisabled(selection, true);
        cy.checkNumberOfAttemptsProgression({
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
        checkInputDisabled(selection, true);
        cy.checkNumberOfAttemptsProgression({
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
            appSettings: getAppSetting(APP_SETTINGS, NUMBER_OF_ATTEMPTS),
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

        // error displayed in question bar
        cy.checkStepStatus(id, false);
        checkInputDisabled(selection, false);
        cy.checkNumberOfAttemptsProgression({
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

        // success displayed in question bar
        cy.checkStepStatus(id, true);
        checkInputDisabled(selection, true);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(QUESTION_APP_SETTINGS[1].data.questionId)
          )
        ).click();
        cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
        checkCorrection(selection);
        checkInputDisabled(selection, true);
        cy.checkNumberOfAttemptsProgression({
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
            appSettings: getAppSetting(APP_SETTINGS, NUMBER_OF_ATTEMPTS),
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
        checkInputDisabled(selection, false);
        cy.checkNumberOfAttemptsProgression({
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });
      });
    });
  });
});
