import {
  APP_SETTING_NAMES,
  QUESTION_TYPES,
} from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  PLAY_VIEW_TEXT_INPUT_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const { data, id } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QUESTION_TYPES.TEXT_INPUT
);

const checkAnswer = (isCorrect) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);
  cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} div`).then(($el) => {
    expect($el.attr('class').toLowerCase()).to.contain(
      isCorrect ? 'success' : 'error'
    );
  });
};

describe('Play Text Input', () => {
  describe('Empty app data', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
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
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(data.text);

      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} div`).then(($el) => {
        expect($el.attr('class').toLowerCase()).to.contain('success');
      });

      // success displayed in question bar
      cy.checkStepStatus(id, true);

      cy.checkExplanationPlay(data.explanation);
    });

    it('Incorrect app data', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(
        'incorrect answer'
      );
      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
      checkAnswer(false);

      // go to another question and comeback, data should have been saved
      cy.get(dataCyWrapper(buildQuestionStepCy(APP_SETTINGS[0].id))).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      checkAnswer(false);

      // error displayed in question bar
      cy.checkStepStatus(id, false);

      cy.checkExplanationPlay(data.explanation);
    });
  });

  describe('Display saved settings', () => {
    const appData = {
      id: 'app-data-id',
      data: {
        questionId: id,
        text: 'my answer',
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

      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
    });

    it('Show saved question', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).should(
        'have.value',
        appData.data.text
      );

      cy.checkExplanationPlay(data.explanation);
    });
  });
});
