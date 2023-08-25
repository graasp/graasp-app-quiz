import {
  APP_DATA_TYPES,
  APP_SETTING_NAMES,
  QuestionType,
} from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildMultipleChoicesButtonCy,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const { data } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.MULTIPLE_CHOICES
);

const id = data.questionId;

// click on choices -> become selected
const clickSelection = (selection) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(2000);
  selection.forEach((idx) => {
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, false))).click();
    cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, true))).should(
      'be.visible'
    );
    // throw new Error('oierjf');
  });
};

// verify all choices styles
const checkCorrection = (selection) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1500);
  data.choices.forEach(({ isCorrect }, idx) => {
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
        expect($el.attr('class').toLowerCase()).to.contain(correction);
      }
    );
  });
  cy.checkExplanationPlay(data.explanation);
};

describe('Play Multiple Choices', () => {
  describe('Empty data', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
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
      data.choices.forEach((_data, idx) => {
        cy.get(dataCyWrapper(buildMultipleChoicesButtonCy(idx, false))).should(
          'be.visible'
        );
      });
      cy.checkExplanationPlay(null);
    });

    it('Incorrect app data', () => {
      const selection = [0, 2];
      clickSelection(selection);

      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

      // verify all choices styles
      checkCorrection(selection);

      // error displayed in question bar
      cy.checkStepStatus(id, false);
    });

    it('Correct app data', () => {
      // click on choices -> become selected
      const selection = data.choices.reduce(
        (arr, { isCorrect }, idx) => (isCorrect ? [...arr, idx] : arr),
        []
      );

      clickSelection(selection);

      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

      checkCorrection(selection);

      // success displayed in question bar
      cy.checkStepStatus(id, true);

      // go to another question and comeback, data should have been saved
      cy.get(
        dataCyWrapper(buildQuestionStepCy(APP_SETTINGS[1].data.questionId))
      ).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      checkCorrection(selection);
    });
  });

  describe('Display saved settings', () => {
    const appData = {
      id: 'app-data-1',
      type: APP_DATA_TYPES.RESPONSE,
      data: {
        questionId: id,
        choices: data.choices.slice(2),
      },
    };
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
          appData: [appData],
        },
      });
      cy.visit('/');
    });

    it('Show saved question', () => {
      const selection = appData.data.choices.map((text) =>
        data.choices.findIndex(({ value }) => value === text)
      );
      checkCorrection(selection);
    });
  });
});
