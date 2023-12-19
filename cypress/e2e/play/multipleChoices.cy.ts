import { MultipleChoicesAppSettingData } from '../../../src/components/types/types';
import {
  APP_DATA_TYPES,
  APP_SETTING_NAMES,
  QuestionType,
} from '../../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_SUBMIT_BUTTON_CY,
  buildMultipleChoiceExplanationPlayCy,
  buildMultipleChoicesButtonCy,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import {
  APP_SETTINGS,
  QUESTION_APP_SETTINGS,
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
    // throw new Error('oierjf');
  });
};

// verify all choices styles
const checkCorrection = (selection: number[]) => {
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
        expect($el.attr('class').toLowerCase()).to.contain(correction);
      }
    );
    // todo: enable back if explanations are shown only under some conditions
    // if (wasSelected && !isCorrect) {
    cy.get(dataCyWrapper(buildMultipleChoiceExplanationPlayCy(idx))).should(
      'contain',
      explanation
    );
    // }
    // else if (!wasSelected) {
    //   cy.get(dataCyWrapper(buildMultipleChoiceExplanationPlayCy(idx))).should(
    //     'not.exist'
    //   );
    // }
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
      choices.forEach((_data, idx) => {
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
      const selection = choices.reduce(
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
        dataCyWrapper(
          buildQuestionStepCy(QUESTION_APP_SETTINGS[1].data.questionId)
        )
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
        choices: choices.slice(2),
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
      // TODO: check the choice is good shape
      const selection = appData.data.choices.map((choice) =>
        choices.findIndex(({ value }) => value === choice.value)
      );
      checkCorrection(selection);
    });
  });
});
