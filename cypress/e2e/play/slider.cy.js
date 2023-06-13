import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SLIDER_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const { data, id } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.SLIDER
);

const checkCorrection = (responseData) => {
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

describe('Slider', () => {
  describe('empty data', () => {
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

      cy.get(dataCyWrapper(PLAY_VIEW_SLIDER_CY))
        .should('contain', data.min)
        .should('contain', data.max);
      // correct value should not be displayed
      cy.get(`${dataCyWrapper(PLAY_VIEW_SLIDER_CY)} input`).should(
        'not.have.value',
        data.value
      );
      cy.checkExplanationPlay(null);
    });

    it('Incorrect app data', () => {
      // difficult to move slider, so we don't do it

      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();

      // verify all choices styles
      checkCorrection({ value: 60 });

      // error display in question bar
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);
      cy.get(`${dataCyWrapper(buildQuestionStepCy(id))} svg`).then(($el) => {
        expect($el.attr('class').toLowerCase()).to.contain('error');
      });

      // go to another question and comeback, data should have been saved
      cy.get(dataCyWrapper(buildQuestionStepCy(APP_SETTINGS[0].id))).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      checkCorrection({ value: 60 });

      // error displayed in question bar
      cy.checkStepStatus(id, false);
    });
  });
  describe('Display saved app data', () => {
    const appData = {
      id: 'app-data-id',
      data: {
        questionId: id,
        value: 30,
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
      checkCorrection(appData.data);
    });
  });
});
