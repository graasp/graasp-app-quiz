import { APP_SETTING_NAMES, QUESTION_TYPES } from '../config/constants';

const buildDatabase = (appContext) => ({
  appData: [
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-1',
      creator: 'mock-member-id-1',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id4',
        choices: ['London'],
      },
      id: '2',
    },
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-1',
      creator: 'mock-member-id-1',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id6',
        text: '90',
      },
      id: '3',
    },
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-1',
      creator: 'mock-member-id-1',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id7',
        text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '4',
    },
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-2',
      creator: 'mock-member-id-2',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id5',
        value: 60,
      },
      id: '5',
    },
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-2',
      creator: 'mock-member-id-2',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id4',
        choices: ['Tokyo', 'London'],
      },
      id: '6',
    },
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id-3',
      creator: 'mock-member-id-3',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id7',
        text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
      },
      id: '7',
    },
  ],
  appSettings: [
    {
      id: 'question-list',
      data: {
        list: ['id7', 'id5', 'id6', 'id4'],
      },
      name: APP_SETTING_NAMES.QUESTION_LIST,
    },
    {
      id: 'id4',
      data: {
        question: 'What is the capital of France?',
        type: QUESTION_TYPES.MULTIPLE_CHOICES,
        choices: [
          { value: 'London', isCorrect: false },
          { value: 'Paris', isCorrect: true },
          { value: 'New York', isCorrect: false },
          { value: 'Tokyo', isCorrect: false },
        ],
        explanation: 'Paris is the capital of France.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id5',
      data: {
        question: 'How happy are you?',
        type: QUESTION_TYPES.SLIDER,
        min: 10,
        max: 90,
        value: 20,
        explanation: 'Go to sleep.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id6',
      data: {
        question: 'What is a baby cat called?',
        type: QUESTION_TYPES.TEXT_INPUT,
        text: 'kitten',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id7',
      data: {
        question: 'Fill In The Blanks',

        type: QUESTION_TYPES.FILL_BLANKS,
        text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
  ],
  members: [
    {
      id: appContext.memberId,
      name: 'mock-member',
    },
  ],
});

export default buildDatabase;
