import { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppDataVisibility,
  DiscriminatedItem,
  ItemType,
  MemberType,
  PermissionLevel,
} from '@graasp/sdk';

import {
  API_HOST,
  APP_DATA_TYPES,
  APP_SETTING_NAMES,
  QuestionType,
} from '../config/constants';

export const mockMember = {
  id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
  name: 'anna',
  email: 'bob@gmail.com',
  extra: {},
  type: MemberType.Individual,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockMembers = [
  mockMember,
  {
    id: 'mock-member-id-0',
    name: 'George',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-member-id-1',
    name: 'James',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-member-id-2',
    name: 'Sarah',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-member-id-3',
    name: 'Emily',
    email: '',
    extra: {},
    type: MemberType.Individual,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockItem = {
  id: '1234-1234-123456-8123-123456',
  type: ItemType.APP,
} as DiscriminatedItem;

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'builder',
  itemId: mockItem.id,
  memberId: mockMember.id,
};

const buildDatabase = (): Database => ({
  appData: [
    {
      item: mockItem,
      member: mockMember,
      creator: mockMember,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '2',
    },
    {
      item: mockItem,
      member: mockMember,
      creator: mockMember,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '3',
    },
    {
      item: mockItem,
      member: mockMember,
      creator: mockMember,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id71',
        text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '4',
    },
    {
      item: mockItem,
      member: mockMembers[3],
      creator: mockMembers[3],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id51',
        value: 60,
      },
      id: '5',
    },
    {
      item: mockItem,
      member: mockMembers[3],
      creator: mockMembers[3],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id41',
        choices: ['Tokyo', 'London'],
      },
      id: '6',
    },
    {
      item: mockItem,
      member: mockMembers[3],
      creator: mockMembers[3],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id61',
        text: 'kitten',
      },
      id: '7',
    },
    {
      item: mockItem,
      member: mockMembers[3],
      creator: mockMembers[3],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id71',
        text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '8',
    },
    {
      item: mockItem,
      member: mockMembers[4],
      creator: mockMembers[4],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id71',
        text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
      },
      id: '9',
    },
    {
      item: mockItem,
      member: mockMembers[4],
      creator: mockMembers[4],
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      type: APP_DATA_TYPES.RESPONSE,
      visibility: AppDataVisibility.Member,
      data: {
        questionId: 'id61',
        text: 'bird',
      },
      id: '10',
    },
  ],
  appSettings: [
    {
      id: 'question-list',
      item: mockItem,
      data: {
        list: ['id71', 'id51', 'id61', 'id41'],
      },
      name: APP_SETTING_NAMES.QUESTION_LIST,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
    },
    {
      id: 'id4',
      item: mockItem,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      data: {
        questionId: 'id41',
        question: 'What is the capital of France?',
        type: QuestionType.MULTIPLE_CHOICES,
        choices: [
          {
            value: 'London',
            isCorrect: false,
            explanation: 'London is the capital of England',
          },
          {
            value: 'Paris',
            isCorrect: true,
            explanation: 'Paris is the capital of France',
          },
          {
            value: 'New York',
            isCorrect: false,
            explanation: 'New York is not located in France',
          },
          {
            value: 'Tokyo',
            isCorrect: false,
            explanation: 'Tokyo is the capital of Japan',
          },
        ],
        explanation: 'Paris is the capital of France.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id5',
      item: mockItem,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      data: {
        questionId: 'id51',
        question: 'How happy are you?',
        type: QuestionType.SLIDER,
        min: 10,
        max: 90,
        value: 20,
        explanation: 'Go to sleep.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id6',
      item: mockItem,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      data: {
        questionId: 'id61',
        question: 'What is a baby cat called?',
        type: QuestionType.TEXT_INPUT,
        text: 'kitten',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id7',
      item: mockItem,
      createdAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      updatedAt: new Date('2022-07-22T12:35:50.195Z').toISOString(),
      data: {
        questionId: 'id71',
        question: 'Fill In The Blanks',

        type: QuestionType.FILL_BLANKS,
        text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
  ],
  members: mockMembers,
  appActions: [],
  items: [mockItem],
});

export default buildDatabase;
