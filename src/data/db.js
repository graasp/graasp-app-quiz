import { APP_SETTING_NAMES, QuestionType } from '../config/constants';

export const item = { id: 'mock-item-id' };
const member = { id: 'mock-member-id-1' };
const buildDatabase = (appContext) => ({
  appData: [
    {
      item,
      member,
      creator: member,
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id4',
        choices: ['Paris'],
      },
      id: '2',
    },
    {
      item,
      member,
      creator: member,
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id6',
        text: '90',
      },
      id: '3',
    },
    {
      item,
      member,
      creator: member,
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id7',
        text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '4',
    },
    {
      item,
      member: { id: 'mock-member-id-2' },
      creator: { id: 'mock-member-id-2' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id5',
        value: 60,
      },
      id: '5',
    },
    {
      item,
      member: { id: 'mock-member-id-2' },
      creator: { id: 'mock-member-id-2' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id4',
        choices: ['Tokyo', 'London'],
      },
      id: '6',
    },
    {
      item,
      member: { id: 'mock-member-id-2' },
      creator: { id: 'mock-member-id-2' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id6',
        text: 'kitten',
      },
      id: '7',
    },
    {
      item,
      member: { id: 'mock-member-id-2' },
      creator: { id: 'mock-member-id-2' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id7',
        text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '8',
    },
    {
      item,
      member: { id: 'mock-member-id-3' },
      creator: { id: 'mock-member-id-3' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id7',
        text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
      },
      id: '9',
    },
    {
      item,
      member: { id: 'mock-member-id-3' },
      creator: { id: 'mock-member-id-3' },
      createdAt: new Date('2022-07-22T12:35:50.195Z'),
      updatedAt: new Date('2022-07-22T12:35:50.195Z'),
      data: {
        questionId: 'id6',
        text: 'bird',
      },
      id: '10',
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
        questionId: 'id4',
        question: 'What is the capital of France?',
        type: QuestionType.MULTIPLE_CHOICES,
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
        questionId: 'id5',
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
      data: {
        questionId: 'id6',
        question: 'What is a baby cat called?',
        type: QuestionType.TEXT_INPUT,
        text: 'kitten',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id7',
      data: {
        questionId: 'id7',
        question: 'Fill In The Blanks',

        type: QuestionType.FILL_BLANKS,
        text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
  ],
  members: [
    {
      id: appContext.memberId,
      name: 'George',
    },
    {
      id: 'mock-member-id-1',
      name: 'James',
    },
    {
      id: 'mock-member-id-2',
      name: 'Sarah',
    },
    {
      id: 'mock-member-id-3',
      name: 'Emily',
    },
  ],
});

export default buildDatabase;
