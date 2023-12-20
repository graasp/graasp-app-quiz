import { AppSetting } from '@graasp/sdk';

import { APP_SETTING_NAMES, QuestionType } from '../../src/config/constants';
import {
  PLAY_VIEW_QUESTION_TITLE_CY,
  PLAY_VIEW_TEXT_INPUT_CY,
  QUESTION_BAR_NEXT_CY,
  dataCyWrapper,
} from '../../src/config/selectors';
import {
  datesFactory,
  mockAppDataFactory,
  mockMemberFactory,
} from '../../src/data/factories';
import { mockItem } from '../../src/data/items';

describe('Legacy', () => {
  it('Questions without questionId are compatible', () => {
    const MULTIPLE_CHOICES_APP_SETTING: AppSetting = {
      id: 'multiple-choice-id',
      name: APP_SETTING_NAMES.QUESTION,
      item: mockItem,
      ...datesFactory,
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

    const TEXT_INPUT_APP_SETTING: AppSetting = {
      id: 'text-input-id',
      name: APP_SETTING_NAMES.QUESTION,
      item: mockItem,
      ...datesFactory,
      data: {
        type: QuestionType.TEXT_INPUT,
        // does not have a question id
        question: 'My text input question',
        text: 'my text input',
        explanation: 'my explanation for text input',
      },
    };

    const ORDER_LIST: AppSetting = {
      id: 'order-list',
      name: APP_SETTING_NAMES.QUESTION_LIST,
      item: mockItem,
      ...datesFactory,
      data: {
        // refer to real question id
        list: [MULTIPLE_CHOICES_APP_SETTING.id, TEXT_INPUT_APP_SETTING.id],
      },
    };

    // current user
    const member = mockMemberFactory({ id: 'mock-member-id', name: 'liam' });
    const textAppData =  mockAppDataFactory({
      item: mockItem,
      member,
      creator: member,
      data: {
        // refer to real question id
        questionId: TEXT_INPUT_APP_SETTING.id,
        text: '90',
      },
      id: '3',
    });
    const appData = [
      mockAppDataFactory({
        item: mockItem,
        member,
        creator: member,
        data: {
          // refer to real question id
          questionId: MULTIPLE_CHOICES_APP_SETTING.id,
          choices: ['Paris'],
        },
        id: '2',
      }),
      textAppData,
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
      textAppData.data.text
    );
  });
});
