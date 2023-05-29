import { APP_SETTING_NAMES, QUESTION_TYPES } from '../config/constants';

export const db2_secondHalfQuestionsList = ['id6', 'id7', 'id8', 'id9', 'id10'];
export const db2_secondHalfAppSettings = {
  appSettings: [
    {
      id: 'id6',
      data: {
        question: 'What is the largest planet in our solar system?',
        type: QUESTION_TYPES.MULTIPLE_CHOICES,
        choices: [
          { value: 'Jupiter', isCorrect: true },
          { value: 'Saturn', isCorrect: false },
          { value: 'Mars', isCorrect: false },
          { value: 'Venus', isCorrect: false },
        ],
        explanation: 'Jupiter is the largest planet in our solar system.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id7',
      data: {
        question: 'How many sides does a hexagon have?',
        type: QUESTION_TYPES.MULTIPLE_CHOICES,
        choices: [
          { value: '4', isCorrect: false },
          { value: '5', isCorrect: false },
          { value: '6', isCorrect: true },
          { value: '7', isCorrect: false },
        ],
        explanation: 'A hexagon has 6 sides.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id8',
      data: {
        question: 'What is the atomic number of oxygen?',
        type: QUESTION_TYPES.SLIDER,
        min: 1,
        max: 100,
        value: 8,
        explanation: 'The atomic number of oxygen is 8.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id9',
      data: {
        question: 'Name one natural satellite of the Earth.',
        type: QUESTION_TYPES.TEXT_INPUT,
        text: 'Moon',
        explanation: 'The Moon is a natural satellite of the Earth.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id10',
      data: {
        question: 'Fill In The Blanks 2',

        type: QUESTION_TYPES.FILL_BLANKS,
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
  ],
};
