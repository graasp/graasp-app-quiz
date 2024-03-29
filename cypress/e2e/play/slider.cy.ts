import { Context } from '@graasp/sdk';

import { QuestionStepStyleKeys } from '../../../src/components/navigation/questionNavigation/types';
import {
  AppSettingData,
  SliderAppDataData,
} from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SLIDER_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
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
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.SLIDER
);

const id = data.questionId;

const sliderAppSettingsData = APP_SETTINGS[2].data as AppSettingData;

const checkCorrection = (responseData: Pick<SliderAppDataData, 'value'>) => {
  // cannot check slider value because we cannot move it
  // cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)} input`).should('have.value', responseData.value)
  // display correct answer
  cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)}`).should('contain', data.value);

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)}`).then(($el) => {
    expect($el.attr('class').toLowerCase()).to.contain(
      data.value === responseData.value ? 'success' : 'error'
    );
  });
  cy.checkExplanationPlay(data.explanation);
};

/**
 * Checks that the slider and submit button are disabled or not.
 * It is useful to check that:
 *  - no more answers can be send if maximum of attempts are reached
 *  - no more answers can be send if the answer is correct
 *  - the user can send answers when the max number of attempts are reached
 * @param shouldBeDisabled Indicates if the inputs should be disabled or not.
 */
const checkInputDisabled = (shouldBeDisabled: boolean) => {
  const status = `${shouldBeDisabled ? '' : 'not.'}be.disabled`;
  const disabled = 'disabled';
  cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)}`).then(($el) => {
    if (shouldBeDisabled) {
      expect($el.attr('class').toLowerCase()).to.contain(disabled);
    } else {
      expect($el.attr('class').toLowerCase()).to.not.contain(disabled);
    }
  });
  cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).should(status);
};

describe('Slider', () => {
  describe('Only 1 attempt', () => {
    describe('empty data', () => {
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

        // Without this wait, the submit button is not clicked on correctly...
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
      });

      it('Start with empty data', () => {
        cy.get(dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)).should(
          'contain',
          data.question
        );

        cy.get(dataCyWrapper(PLAY_VIEW_SLIDER_CY))
          .should('contain', data.min)
          .should('contain', data.max);
        // correct value should not be displayed
        cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)} input`).should(
          'not.have.value',
          data.value
        );
        cy.checkHintsPlay(null);
        cy.checkExplanationPlay(null);
        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: 1,
          currentAttempts: 0,
        });
        checkInputDisabled(false);
      });

      it('Incorrect app data', () => {
        // difficult to move slider, so we don't do it

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

        // verify all choices styles
        checkCorrection({ value: 60 });
        cy.checkHintsPlay(null);

        // error display in question bar
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.checkQuizNavigationStatus(QuestionStepStyleKeys.INCORRECT);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[0].data.questionId)
          )
        ).click();
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(id, QuestionStepStyleKeys.INCORRECT)
          )
        ).click();
        checkCorrection({ value: 60 });
        cy.checkHintsPlay(null);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: 1,
          currentAttempts: 1,
          isCorrect: false,
        });

        checkInputDisabled(true);
      });
    });
    describe('Display saved app data', () => {
      const appData = mockAppDataFactory({
        id: 'app-data-id',
        item: mockItem,
        creator: mockCurrentMember,
        data: {
          questionId: id,
          value: 30,
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

        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      });

      it('Show saved question', () => {
        checkCorrection(appData.data);
        cy.checkHintsPlay(null);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: 1,
          currentAttempts: 1,
          isCorrect: true,
        });

        checkInputDisabled(true);
      });
    });
  });

  describe('3 attempts', () => {
    const NUMBER_OF_ATTEMPTS = 3;

    describe('empty data', () => {
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

        // Without this wait, the submit button is not clicked on correctly...
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
      });

      it('Incorrect app data', () => {
        // difficult to move slider, so we don't do it

        cy.checkHintsPlay(null);
        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
        cy.checkHintsPlay(sliderAppSettingsData.hints);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: false,
        });

        checkInputDisabled(false);

        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
        cy.checkHintsPlay(sliderAppSettingsData.hints);
        cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
        cy.checkHintsPlay(null);

        // verify all choices styles
        checkCorrection({ value: 60 });

        cy.checkQuizNavigationStatus(QuestionStepStyleKeys.INCORRECT);

        // go to another question and comeback, data should have been saved
        cy.get(
          dataCyWrapper(
            buildQuestionStepDefaultCy(QUESTION_APP_SETTINGS[0].data.questionId)
          )
        ).click();
        cy.get(
          dataCyWrapper(
            buildQuestionStepCy(id, QuestionStepStyleKeys.INCORRECT)
          )
        ).click();
        checkCorrection({ value: 60 });

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: NUMBER_OF_ATTEMPTS,
          isCorrect: false,
        });

        checkInputDisabled(true);
      });
    });

    describe('Display saved app data', () => {
      const appData = mockAppDataFactory({
        id: 'app-data-id',
        item: mockItem,
        creator: mockCurrentMember,
        data: {
          questionId: id,
          value: 30,
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

        cy.get(dataCyWrapper(buildQuestionStepDefaultCy(id))).click();
      });

      it('Show saved question', () => {
        checkCorrection(appData.data);
        cy.checkHintsPlay(null);

        cy.checkQuizNavigation({
          questionId: id,
          numberOfAttempts: NUMBER_OF_ATTEMPTS,
          currentAttempts: 1,
          isCorrect: true,
        });

        checkInputDisabled(true);
      });
    });
  });
});
