import { LocalContext } from '@graasp/apps-query-client';
import { Context, PermissionLevel } from '@graasp/sdk';

import { API_HOST, APP_SETTING_NAMES, QuestionType } from '../config/constants';
import { appDataChloe } from './appDataChloe';
import { appDataEmily } from './appDataEmily';
import { appDataJames } from './appDataJames';
import { appDataJessica } from './appDataJessica';
import { appDataLuca } from './appDataLuca';
import { appDataMicheal } from './appDataMicheal';
import { appDataOlivia } from './appDataOlivia';
import { appDataSarah } from './appDataSarah';
import { appDataWilliam } from './appDataWilliam';
import { appDataXavier } from './appDataXavier';
import { mockAppSettingFactory } from './factories';
import { mockItem } from './items';
import { mockCurrentMember } from './members';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Builder,
  itemId: mockItem.id,
  memberId: mockCurrentMember.id,
};

export const mockAppData = [
  ...appDataJames,
  ...appDataSarah,
  ...appDataEmily,
  ...appDataMicheal,
  ...appDataJessica,
  ...appDataWilliam,
  ...appDataOlivia,
  ...appDataChloe,
  ...appDataXavier,
  ...appDataLuca,
];

export const mockAppSetting = [
  mockAppSettingFactory({
    id: 'question-list',
    data: {
      list: [
        'id11',
        'id21',
        'id31',
        'id41',
        'id51',
        'id61',
        'id71',
        'id81',
        'id91',
        'id101',
      ],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id1',
    data: {
      questionId: 'id11',
      question: 'What is the capital of Australia?',
      type: QuestionType.MULTIPLE_CHOICES,
      choices: [
        { value: 'Sydney', isCorrect: false, explanation: '' },
        { value: 'Melbourne', isCorrect: false, explanation: '' },
        { value: 'Canberra', isCorrect: true, explanation: '' },
        { value: 'Brisbane', isCorrect: false, explanation: '' },
      ],
      explanation: 'Canberra is the capital of Australia.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id2',
    data: {
      questionId: 'id21',
      question: 'What is the symbol for potassium on the periodic table?',
      type: QuestionType.MULTIPLE_CHOICES,
      choices: [
        {
          value: 'P',
          isCorrect: false,
          explanation: 'P is the symbol for Phosphorus',
        },
        {
          value: 'K',
          isCorrect: true,
          explanation: 'K is the symbol for Potassium',
        },
        {
          value: 'N',
          isCorrect: false,
          explanation: 'N is the symbol for Nitrogen',
        },
        {
          value: 'O',
          isCorrect: false,
          explanation: 'O is the symbol for Oxygen',
        },
      ],
      explanation: 'The symbol for potassium on the periodic table is K.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id3',
    data: {
      questionId: 'id31',
      question: 'How many elements are in the periodic table?',
      type: QuestionType.SLIDER,
      min: 50,
      max: 120,
      value: 118,
      explanation: 'As of 2023, there are 118 elements in the periodic table.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id4',
    data: {
      questionId: 'id41',
      question: 'What is the smallest country in the world?',
      type: QuestionType.TEXT_INPUT,
      text: 'Vatican City',
      explanation: 'Vatican City is the smallest country in the world.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id5',
    data: {
      questionId: 'id51',
      question: 'Fill In The Blanks 1',
      type: QuestionType.FILL_BLANKS,
      text: 'Roses are <red>, violets are <blue>, sugar is <sweet>.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id6',
    data: {
      questionId: 'id61',
      question: 'What is the largest planet in our solar system?',
      type: QuestionType.MULTIPLE_CHOICES,
      choices: [
        { value: 'Jupiter', isCorrect: true, explanation: '' },
        {
          value: 'Saturn',
          isCorrect: false,
          explanation: 'Saturn is not the largest planet in our solar system',
        },
        {
          value: 'Mars',
          isCorrect: false,
          explanation: 'Mars is not the largest planet in our solar system',
        },
        {
          value: 'Venus',
          isCorrect: false,
          explanation: 'Venus is not the largest planet in our solar system',
        },
      ],
      explanation: 'Jupiter is the largest planet in our solar system.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id7',
    data: {
      questionId: 'id71',
      question: 'How many sides does a hexagon have?',
      type: QuestionType.MULTIPLE_CHOICES,
      choices: [
        {
          value: '4',
          isCorrect: false,
          explanation: 'A quadrilateral has 4 sides',
        },
        {
          value: '5',
          isCorrect: false,
          explanation: 'A pentagon has 5 sides',
        },
        { value: '6', isCorrect: true, explanation: 'A hexagon has 6 sides' },
        {
          value: '7',
          isCorrect: false,
          explanation: 'A heptagon has 7 sides',
        },
      ],
      explanation: 'A hexagon has 6 sides.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id8',
    data: {
      questionId: 'id81',
      question: 'What is the atomic number of oxygen?',
      type: QuestionType.SLIDER,
      min: 1,
      max: 100,
      value: 8,
      explanation: 'The atomic number of oxygen is 8.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id9',
    data: {
      questionId: 'id91',
      question: 'Name one natural satellite of the Earth.',
      type: QuestionType.TEXT_INPUT,
      text: 'Moon',
      explanation: 'The Moon is a natural satellite of the Earth.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),

  mockAppSettingFactory({
    id: 'id10',
    data: {
      questionId: 'id101',
      question: 'Fill In The Blanks 2',
      type: QuestionType.FILL_BLANKS,
      text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
    },
    name: APP_SETTING_NAMES.QUESTION,
    item: mockItem,
  }),
];
