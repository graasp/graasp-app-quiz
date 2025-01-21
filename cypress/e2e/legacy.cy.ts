import { AppSetting, Context, PermissionLevel } from '@graasp/sdk';

import { APP_SETTING_NAMES, QuestionType } from '../../src/config/constants';
import {
  CREATE_QUESTION_TITLE_CY,
  dataCyWrapper,
} from '../../src/config/selectors';
import { datesFactory, mockAppDataFactory } from '../../src/data/factories';
import { mockItem } from '../../src/data/items';
import { mockCurrentMember } from '../../src/data/members';

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
const textAppData = mockAppDataFactory({
  item: mockItem,
  creator: mockCurrentMember,
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
    creator: mockCurrentMember,
    data: {
      // refer to real question id
      questionId: MULTIPLE_CHOICES_APP_SETTING.id,
      choices: ['Paris'],
    },
    id: '2',
  }),
  textAppData,
];

describe('Legacy', () => {
  it('Questions without questionId are compatible', () => {
    cy.setUpApi({
      database: {
        appSettings: [
          MULTIPLE_CHOICES_APP_SETTING,
          TEXT_INPUT_APP_SETTING,
          ORDER_LIST,
        ],
        appData,
      },
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');

    cy.get(`${dataCyWrapper(CREATE_QUESTION_TITLE_CY)} input`).should(
      'have.value',
      MULTIPLE_CHOICES_APP_SETTING.data.question
    );
  });

  it('Show error banner if missing questionId for readers', () => {
    cy.setUpApi({
      database: {
        appSettings: [
          MULTIPLE_CHOICES_APP_SETTING,
          TEXT_INPUT_APP_SETTING,
          ORDER_LIST,
        ],
        appData,
      },
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');

    cy.get(`[role="alert"]`).should('be.visible');
  });
});
