import {
  APP_DATA_TYPES,
  APP_SETTING_NAMES,
  FILL_BLANKS_TYPE,
  QuestionType,
} from '../../../src/config/constants';
import {
  FILL_BLANKS_CORRECTION_CY,
  PLAY_VIEW_QUESTION_TITLE_CY,
  buildBlankedTextWordCy,
  buildFillBlanksAnswerId,
  buildFillBlanksCorrectionAnswerCy,
  buildQuestionStepCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { splitSentence } from '../../../src/utils/fillInTheBlanks';
import { APP_SETTINGS } from '../../fixtures/appSettings';

const { data } = APP_SETTINGS.find(
  ({ name, data }) =>
    name === APP_SETTING_NAMES.QUESTION &&
    data.type === QuestionType.FILL_BLANKS
);

const id = data.questionId;

const { text } = data;
const { answers, words } = splitSentence(text);

// verify all answers styles
const checkCorrection = ({ answers: responseAnswers }) => {
  answers.forEach((answer, idx) => {
    cy.get(dataCyWrapper(FILL_BLANKS_CORRECTION_CY), { timeout: 5500 }).should(
      'contain',
      answer.text
    );

    if (responseAnswers.length > idx) {
      const isCorrect = answer.text === responseAnswers[idx].text;

      // correction list
      cy.get(
        dataCyWrapper(buildFillBlanksCorrectionAnswerCy(answer.id, isCorrect))
      ).should('be.visible');

      // blank
      cy.get(`[data-id="${answer.id}"]`)
        .should('contain', responseAnswers[idx].text)
        .should('have.attr', 'data-correctness', isCorrect ? 'true' : 'false');
    } else {
      // response answer doesn't exist because the initial sentence changed
      // so it's false by default
      cy.get(
        dataCyWrapper(buildFillBlanksCorrectionAnswerCy(answer.id, false))
      ).should('be.visible');

      // blank
      cy.get(`[data-id="${answer.id}"]`).should(
        'have.attr',
        'data-correctness',
        'false'
      );
    }

    cy.checkExplanationPlay(data.explanation);
  });
};

describe('Play Fill In The Blanks', () => {
  describe('Empty data', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: APP_SETTINGS,
        },
      });
      cy.visit('/');
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();
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
            'be.empty'
          );
        }
      });
      cy.checkExplanationPlay(null);
    });

    // todo: difficult to test drag and drop
  });

  describe('Display saved settings', () => {
    const buildAppData = (text) => ({
      id: 'app-data-1',
      type: APP_DATA_TYPES.RESPONSE,
      data: {
        questionId: data.questionId,
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
      });
      cy.visit('/');
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      checkCorrection(splitSentence(correctAppData.data.text));

      // success displayed in question bar
      cy.checkStepStatus(id, true);

      // delete one answer
      cy.get(`[data-id="${answers[0].id}"]`).click().should('contain', '');
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
      });
      cy.visit('/');
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      checkCorrection(splitSentence(partiallyCorrectAppData.data.text));

      // success displayed in question bar
      cy.checkStepStatus(id, false);
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
      });
      cy.visit('/');
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      checkCorrection(splitSentence(shorterAppData.data.text));

      // success displayed in question bar
      cy.checkStepStatus(id, false);
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
      });
      cy.visit('/');
      cy.get(dataCyWrapper(buildQuestionStepCy(id))).click();

      // we do not check correction: nothing matches
      // but we want to know that the app didn't crash

      // success displayed in question bar
      cy.checkStepStatus(id, false);
    });
  });
});
