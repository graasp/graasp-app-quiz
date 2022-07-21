import { APP_SETTING_NAMES, QUESTION_TYPES } from '../config/constants';

const buildDatabase = (appContext) => ({
  appSettings: [
    {
      id: 'question-list',
      data: {
        list: ['id6', 'id5', 'id4'],
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
        answer: 'kitten',
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
