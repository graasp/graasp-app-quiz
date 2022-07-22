import { APP_SETTING_NAMES, QUESTION_TYPES } from '../config/constants';

const buildDatabase = (appContext) => ({
  appData: [
    {
      itemId: 'mock-item-id',
      memberId: 'mock-member-id',
      creator: 'mock-member-id',
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
      memberId: 'mock-member-id',
      creator: 'mock-member-id',
      createdAt: '2022-07-22T12:35:50.195Z',
      updatedAt: '2022-07-22T12:36:51.741Z',
      data: {
        questionId: 'id6',
        text: '90',
      },
      id: '3',
    },
  ],
  appSettings: [
    {
      id: 'question-list',
      data: {
        list: ['id5', 'id6', 'id4'],
      },
      name: APP_SETTING_NAMES.QUESTION_LIST,
    },
    {
      id: 'id4',
      data: {
        question: 'What is the capital of France?',
        type: QUESTION_TYPES.MULTIPLE_CHOICES,
        choices: [
          { choice: 'London', isCorrect: false },
          { choice: 'Paris', isCorrect: true },
          { choice: 'New York', isCorrect: false },
          { choice: 'Tokyo', isCorrect: false },
        ],
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
  ],
  members: [
    {
      id: appContext.memberId,
      name: 'mock-member',
    },
  ],
});

export default buildDatabase;
