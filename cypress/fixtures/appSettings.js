import { APP_SETTING_NAMES, QuestionType } from '../../src/config/constants';

export const MULTIPLE_CHOICES_APP_SETTING = {
  id: 'multiple-choice-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QuestionType.MULTIPLE_CHOICES,
    questionId: 'multiple-choice-id1',
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

export const TEXT_INPUT_APP_SETTING = {
  id: 'text-input-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QuestionType.TEXT_INPUT,
    questionId: 'text-input-id1',
    question: 'My text input question',
    text: 'my text input',
    explanation: 'my explanation for text input',
  },
};

export const SLIDER_APP_SETTING = {
  id: 'slider-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QuestionType.SLIDER,
    questionId: 'slider-id1',
    question: 'My slider question',
    min: 10,
    max: 110,
    value: 30,
    explanation: 'my explanation for slider',
  },
};

export const FILL_BLANKS_SETTING = {
  id: 'fill-blanks-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QuestionType.FILL_BLANKS,
    questionId: 'fill-blanks-id1',
    question: 'My fill in the blanks question',
    text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
    explanation: 'my explanation for fill in the blanks',
  },
};

export const APP_SETTINGS = [
  MULTIPLE_CHOICES_APP_SETTING,
  TEXT_INPUT_APP_SETTING,
  SLIDER_APP_SETTING,
  FILL_BLANKS_SETTING,
  {
    id: 'order-list-id',
    name: APP_SETTING_NAMES.QUESTION_LIST,
    data: {
      list: [
        MULTIPLE_CHOICES_APP_SETTING.data.questionId,
        TEXT_INPUT_APP_SETTING.data.questionId,
        SLIDER_APP_SETTING.data.questionId,
        FILL_BLANKS_SETTING.data.questionId,
      ],
    },
  },
];

export const CAPITAL_FRANCE_SETTING = {
  id: 'id4',
  data: {
    questionId: 'id41',
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
};

export const HAPPINESS_LEVEL_SETTING = {
  id: 'id5',
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
};

export const BABY_CAT_SETTING = {
  id: 'id6',
  data: {
    questionId: 'id61',
    question: 'What is a baby cat called?',
    type: QuestionType.TEXT_INPUT,
    text: 'kitten',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const FILL_BLANKS_SETTING_2 = {
  id: 'id7',
  data: {
    questionId: 'id71',
    question: 'Fill In The Blanks',

    type: QuestionType.FILL_BLANKS,
    text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const FILL_BLANKS_SETTINGS_3 = {
  id: 'id9',
  data: {
    questionId: 'id91',
    question: 'Find equation',
    type: QuestionType.FILL_BLANKS,
    text: '<1> + <1> = <2>',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const NAME_EARTH_SATELLITE = {
  id: 'id10',
  data: {
    questionId: 'id101',
    question: "What is the name of earth's natural satellite",
    type: QuestionType.MULTIPLE_CHOICES,
    choices: [
      { value: 'Moon', isCorrect: true },
      { value: 'Jupiter', isCorrect: false },
      { value: 'Mars', isCorrect: false },
    ],
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const ATOMIC_NUMBER_HE = {
  id: 'id11',
  data: {
    questionId: 'id111',
    question: 'What is the atomic number of Helium',
    type: QuestionType.SLIDER,
    min: 1,
    max: 21,
    value: 2,
  },
  name: APP_SETTING_NAMES.QUESTION,
};

/**
 * App settings used to test that question along with the responses are displayed properly in the Result Table By Question
 */
export const APP_SETTINGS_FEW_QUESTIONS = [
  CAPITAL_FRANCE_SETTING,
  HAPPINESS_LEVEL_SETTING,
  BABY_CAT_SETTING,
  FILL_BLANKS_SETTING_2,
  {
    id: 'question-list',
    data: {
      list: ['id71', 'id51', 'id61', 'id41'],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
  },
];

export const APP_SETTINGS_LOT_QUESTIONS = [
  CAPITAL_FRANCE_SETTING,
  HAPPINESS_LEVEL_SETTING,
  BABY_CAT_SETTING,
  FILL_BLANKS_SETTING_2,
  FILL_BLANKS_SETTINGS_3,
  NAME_EARTH_SATELLITE,
  ATOMIC_NUMBER_HE,

  {
    id: 'question-list',
    data: {
      list: ['id71', 'id51', 'id61', 'id41', 'id91', 'id101', 'id111'],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
  },
];
