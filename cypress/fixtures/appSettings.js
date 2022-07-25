import { APP_SETTING_NAMES, QUESTION_TYPES } from '../../src/config/constants';

export const MULTIPLE_CHOICES_APP_SETTING = {
  id: 'multiple-choice-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.MULTIPLE_CHOICES,
    question: 'My multiple choice question',
    choices: [
      {
        choice: 'choice 1',
        isCorrect: false,
      },
      {
        choice: 'choice 2',
        isCorrect: true,
      },
      {
        choice: 'choice 3',
        isCorrect: true,
      },
      {
        choice: 'choice 4',
        isCorrect: false,
      },
    ],
  },
};

export const TEXT_INPUT_APP_SETTING = {
  id: 'text-input-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.TEXT_INPUT,
    question: 'My text input question',
    text: 'my text input',
  },
};

export const SLIDER_APP_SETTING = {
  id: 'slider-id',
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.SLIDER,
    question: 'My text input question',
    min: 10,
    max: 110,
    value: 30,
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