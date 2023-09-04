import { APP_SETTING_NAMES, QuestionType } from '../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_TEXT_INPUT_CY,
  QUESTION_BAR_NEXT_CY,
  dataCyWrapper,
} from '../../src/config/selectors';

describe('Legacy', () => {
  it('Questions without questionId are compatible', () => {
    const MULTIPLE_CHOICES_APP_SETTING = {
      id: 'multiple-choice-id',
      name: APP_SETTING_NAMES.QUESTION,
      data: {
        type: QuestionType.MULTIPLE_CHOICES,
        // does not have a question id
        question: 'My multiple choice question',
        choices: [
          {
            value: 'choice 1',
            isCorrect: false,
          },
          {
            value: 'choice 2',
            isCorrect: true,
          },
          {
            value: 'choice 3',
            isCorrect: true,
          },
          {
            value: 'choice 4',
            isCorrect: false,
          },
        ],
        explanation: 'my explanation for multiple choice',
      },
    };

    const TEXT_INPUT_APP_SETTING = {
      id: 'text-input-id',
      name: APP_SETTING_NAMES.QUESTION,
      data: {
        type: QuestionType.TEXT_INPUT,
        // does not have a question id
        question: 'My text input question',
        text: 'my text input',
        explanation: 'my explanation for text input',
      },
    };

    const ORDER_LIST = {
      id: 'order-list',
      name: APP_SETTING_NAMES.QUESTION_LIST,
      data: {
        // refer to real question id
        list: [MULTIPLE_CHOICES_APP_SETTING.id, TEXT_INPUT_APP_SETTING.id],
      },
    };

    const item = { id: 'mock-item-id' };
    const member = { id: 'mock-member-id-1', name: 'liam' };
    const appData = [
      {
        item,
        member,
        creator: member,
        createdAt: new Date('2022-07-22T12:35:50.195Z'),
        updatedAt: new Date('2022-07-22T12:36:51.741Z'),
        data: {
          // refer to real question id
          questionId: MULTIPLE_CHOICES_APP_SETTING.id,
          choices: ['Paris'],
        },
        id: '2',
      },
      {
        item,
        member,
        creator: member,
        createdAt: new Date('2022-07-22T12:35:50.195Z'),
        updatedAt: new Date('2022-07-22T12:36:51.741Z'),
        data: {
          // refer to real question id
          questionId: TEXT_INPUT_APP_SETTING.id,
          text: '90',
        },
        id: '3',
      },
    ];
    cy.setUpApi({
      database: {
        appSettings: [
          MULTIPLE_CHOICES_APP_SETTING,
          TEXT_INPUT_APP_SETTING,
          ORDER_LIST,
        ],
        appData,
      },
    });
    cy.visit('/');

    cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
      'contain',
      MULTIPLE_CHOICES_APP_SETTING.data.question
    );
    // go to next and check text input
    cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
    cy.get(`${dataCyWrapper(PLAY_VIEW_QUESTION_TITLE_CY)}`).should(
      'contain',
      TEXT_INPUT_APP_SETTING.data.question
    );
    cy.get(`${dataCyWrapper(PLAY_VIEW_TEXT_INPUT_CY)} input`).should(
      'have.value',
      appData[1].data.text
    );
  });
});
