import { APP_SETTING_NAMES, QUESTION_TYPES } from '../../src/config/constants';

export const MULTIPLE_CHOICES_APP_SETTING = {
  id: 'multiple-choice-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.MULTIPLE_CHOICES,
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
    type: QUESTION_TYPES.TEXT_INPUT,
    question: 'My text input question',
    text: 'my text input',
    explanation: 'my explanation for text input',
  },
};

export const SLIDER_APP_SETTING = {
  id: 'slider-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.SLIDER,
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
    type: QUESTION_TYPES.FILL_BLANKS,
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
        MULTIPLE_CHOICES_APP_SETTING.id,
        TEXT_INPUT_APP_SETTING.id,
        SLIDER_APP_SETTING.id,
        FILL_BLANKS_SETTING.id,
      ],
    },
  },
];

export const CAPITAL_FRANCE_SETTING = {
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
};

export const HAPPINESS_LEVEL_SETTING = {
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
};

export const BABY_CAT_SETTING = {
  id: 'id6',
  data: {
    question: 'What is a baby cat called?',
    type: QUESTION_TYPES.TEXT_INPUT,
    text: 'kitten',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const FILL_BLANKS_SETTING_2 = {
  id: 'id7',
  data: {
    question: 'Fill In The Blanks',

    type: QUESTION_TYPES.FILL_BLANKS,
    text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

/**
 * App settings used to test that question along with the responses are displayed properly in the Result Table By Question
 */
export const APP_SETTINGS_2 = [
  CAPITAL_FRANCE_SETTING,
  HAPPINESS_LEVEL_SETTING,
  BABY_CAT_SETTING,
  FILL_BLANKS_SETTING_2,
  {
    id: 'question-list',
    data: {
      list: ['id7', 'id5', 'id6', 'id4'],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
  },
];
