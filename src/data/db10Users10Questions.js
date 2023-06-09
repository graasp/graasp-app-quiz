import { APP_SETTING_NAMES, QuestionType } from '../config/constants';
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

/**
 * This database contains 10 questions, with 10 mock users, help display more data, to better see tables and charts
 */
const buildDatabase = (appContext) => ({
  appData: [
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
  ],
  appSettings: [
    {
      id: 'question-list',
      data: {
        list: [
          'id1',
          'id2',
          'id3',
          'id4',
          'id5',
          'id6',
          'id7',
          'id8',
          'id9',
          'id10',
        ],
      },
      name: APP_SETTING_NAMES.QUESTION_LIST,
    },
    {
      id: 'id1',
      data: {
        question: 'What is the capital of Australia?',
        type: QuestionType.MULTIPLE_CHOICES,
        choices: [
          { value: 'Sydney', isCorrect: false },
          { value: 'Melbourne', isCorrect: false },
          { value: 'Canberra', isCorrect: true },
          { value: 'Brisbane', isCorrect: false },
        ],
        explanation: 'Canberra is the capital of Australia.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id2',
      data: {
        question: 'What is the symbol for potassium on the periodic table?',
        type: QuestionType.MULTIPLE_CHOICES,
        choices: [
          { value: 'P', isCorrect: false },
          { value: 'K', isCorrect: true },
          { value: 'N', isCorrect: false },
          { value: 'O', isCorrect: false },
        ],
        explanation: 'The symbol for potassium on the periodic table is K.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id3',
      data: {
        question: 'How many elements are in the periodic table?',
        type: QuestionType.SLIDER,
        min: 50,
        max: 120,
        value: 118,
        explanation:
          'As of 2023, there are 118 elements in the periodic table.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id4',
      data: {
        question: 'What is the smallest country in the world?',
        type: QuestionType.TEXT_INPUT,
        text: 'Vatican City',
        explanation: 'Vatican City is the smallest country in the world.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id5',
      data: {
        question: 'Fill In The Blanks 1',

        type: QuestionType.FILL_BLANKS,
        text: 'Roses are <red>, violets are <blue>, sugar is <sweet>.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id6',
      data: {
        question: 'What is the largest planet in our solar system?',
        type: QuestionType.MULTIPLE_CHOICES,
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
        type: QuestionType.MULTIPLE_CHOICES,
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
        type: QuestionType.SLIDER,
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
        type: QuestionType.TEXT_INPUT,
        text: 'Moon',
        explanation: 'The Moon is a natural satellite of the Earth.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
    {
      id: 'id10',
      data: {
        question: 'Fill In The Blanks 2',
        type: QuestionType.FILL_BLANKS,
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      name: APP_SETTING_NAMES.QUESTION,
    },
  ],
  members: [
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
    {
      id: 'mock-member-id-4',
      name: 'Michael',
    },
    {
      id: 'mock-member-id-5',
      name: 'Jessica',
    },
    {
      id: 'mock-member-id-6',
      name: 'William',
    },
    {
      id: 'mock-member-id-7',
      name: 'Olivia',
    },
    {
      id: 'mock-member-id-8',
      name: 'Chloé',
    },
    {
      id: 'mock-member-id-9',
      name: 'Xavier',
    },
    {
      id: 'mock-member-id-10',
      name: 'Luca',
    },
  ],
});

export default buildDatabase;
