import { Context } from '@graasp/sdk';

import { TextAppDataData } from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  PLAY_VIEW_TEXT_INPUT_CY,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { mockAppDataFactory } from '../../../src/data/factories';
import { mockItem } from '../../../src/data/items';
import { mockCurrentMember } from '../../../src/data/members';
import { APP_SETTINGS, QUESTION_APP_SETTINGS } from '../../fixtures/appSettings';

const { data } = QUESTION_APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION && data.type === QuestionType.TEXT_INPUT
);

const id = data.questionId;

const { text } = data as TextAppDataData;

const checkAnswer = (isCorrect: boolean) => {
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
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(text);

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
      cy.get(
        dataCyWrapper(
          buildQuestionStepCy(QUESTION_APP_SETTINGS[0].data.questionId)
        )
      ).click();
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
      checkAnswer(false);

      // error displayed in question bar
      cy.checkStepStatus(id, false);

      cy.checkExplanationPlay(data.explanation);
    });

    it('Correct response but with unmatched case', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(
        `${text.toUpperCase()}`
      );
      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
      checkAnswer(true);
    });

    it('Correct response but with trailing space', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(
        `${data.text} `
      );
      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
      checkAnswer(true);
    });

    it('Correct response but with trailing newline', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(
        `${data.text}\n`
      );
      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
      checkAnswer(true);
    });

    it('Correct response but with starting space', () => {
      cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).type(
        ` ${data.text}`
      );
      cy.get(dataCyWrapper(PLAY_VIEW_SUBMIT_BUTTON_CY)).click();
      checkAnswer(true);
    });
  });

  describe('Display saved settings', () => {
    const appData = mockAppDataFactory({
      id: 'app-data-id',
      item: mockItem,
      creator: mockCurrentMember,
      data: {
        questionId: id,
        text: 'my answer',
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
