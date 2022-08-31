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

export const APP_SETTINGS = [
  MULTIPLE_CHOICES_APP_SETTING,
  TEXT_INPUT_APP_SETTING,
  SLIDER_APP_SETTING,
  {
    id: 'order-list-id',
    name: APP_SETTING_NAMES.QUESTION_LIST,
    data: {
      list: [
        MULTIPLE_CHOICES_APP_SETTING.id,
        TEXT_INPUT_APP_SETTING.id,
        SLIDER_APP_SETTING.id,
      ],
    },
  },
];
