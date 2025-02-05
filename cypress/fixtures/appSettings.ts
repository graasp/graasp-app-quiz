import { AppSetting } from '@graasp/sdk';

import { QuestionDataAppSetting } from '../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../src/config/constants';
import { datesFactory } from '../../src/data/factories';
import { mockItem } from '../../src/data/items';

export const setAttemptsOnAppSettings = (
  appSettings: AppSetting[],
  numberOfAttempts = 1
) =>
  appSettings.map((s) => ({
    ...s,
    data: {
      ...s.data,
      numberOfAttempts,
    },
  }));

export const MULTIPLE_CHOICES_APP_SETTING: QuestionDataAppSetting = {
  id: 'multiple-choice-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.MULTIPLE_CHOICES,
    questionId: 'multiple-choice-id1',
    question: 'My multiple choice question',
    choices: [
      {
        value: 'choice 1',
        isCorrect: false,
        explanation: 'reason 1',
      },
      {
        value: 'choice 2',
        isCorrect: true,
        explanation: 'reason 2',
      },
      {
        value: 'choice 3',
        isCorrect: true,
        explanation: 'reason 3',
      },
      {
        value: 'choice 4',
        isCorrect: false,
        explanation: 'reason 4',
      },
    ],
    explanation: 'my explanation for multiple choice',
    hints: 'my hints for multiple choice',
  },
};

export const TEXT_INPUT_APP_SETTING: QuestionDataAppSetting = {
  id: 'text-input-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.TEXT_INPUT,
    questionId: 'text-input-id1',
    question: 'My text input question',
    text: 'my text input',
    explanation: 'my explanation for text input',
    hints: 'my hints for text input',
  },
};

export const SLIDER_APP_SETTING: QuestionDataAppSetting = {
  id: 'slider-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.SLIDER,
    questionId: 'slider-id1',
    question: 'My slider question',
    min: 10,
    max: 110,
    value: 30,
    explanation: 'my explanation for slider',
    hints: 'my hints for slider',
  },
};

export const FILL_BLANKS_SETTING: QuestionDataAppSetting = {
  id: 'fill-blanks-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.FILL_BLANKS,
    questionId: 'fill-blanks-id1',
    question: 'My fill in the blanks question',
    text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
    explanation: 'my explanation for fill in the blanks',
    hints: 'my hints for fill in the blanks',
  },
};

export const FILL_BLANKS_WITH_BREAK_LINES_SETTING: QuestionDataAppSetting = {
  id: 'fill-blanks-with-break-lines-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.FILL_BLANKS,
    questionId: 'fill-blanks-with-break-lines-id1',
    question: 'My fill in the blanks with break lines',
    text: 'Lorem <ipsum> dolor sit amet, consectetur \n\nadipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
    explanation: 'my explanation for fill in the blanks',
    hints: 'my hints for fill in the blanks',
  },
};

export const QUESTION_APP_SETTINGS = [
  MULTIPLE_CHOICES_APP_SETTING,
  TEXT_INPUT_APP_SETTING,
  SLIDER_APP_SETTING,
  FILL_BLANKS_SETTING,
  FILL_BLANKS_WITH_BREAK_LINES_SETTING,
];

export const APP_SETTINGS: AppSetting[] = [
  ...QUESTION_APP_SETTINGS,
  {
    id: 'order-list-id',
    name: APP_SETTING_NAMES.QUESTION_LIST,
    item: mockItem,
    ...datesFactory,
    data: {
      list: [
        MULTIPLE_CHOICES_APP_SETTING.data.questionId,
        TEXT_INPUT_APP_SETTING.data.questionId,
        SLIDER_APP_SETTING.data.questionId,
        FILL_BLANKS_SETTING.data.questionId,
        FILL_BLANKS_WITH_BREAK_LINES_SETTING.data.questionId,
      ],
    },
  },
];

export const CAPITAL_FRANCE_SETTING = {
  id: 'id4',
  item: mockItem,
  ...datesFactory,
  data: {
    questionId: 'id41',
    question: 'What is the capital of France?',
    type: QuestionType.MULTIPLE_CHOICES,
    choices: [
      {
        value: 'London',
        isCorrect: false,
        explanation: 'London is the capital of England',
      },
      {
        value: 'Paris',
        isCorrect: true,
        explanation: 'Paris is the capital of France',
      },
      {
        value: 'New York',
        isCorrect: false,
        explanation: 'New York is in the US',
      },
      {
        value: 'Tokyo',
        isCorrect: false,
        explanation: 'Tokyo is the capital of Japan',
      },
    ],
    explanation: 'Paris is the capital of France.',
    hints: 'Think about the iconic Eiffel Tower.',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const HAPPINESS_LEVEL_SETTING = {
  id: 'id5',
  item: mockItem,
  ...datesFactory,
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
  item: mockItem,
  ...datesFactory,
  data: {
    questionId: 'id61',
    question: 'What is a baby cat called?',
    hints: 'It is like "kitchen"',
    type: QuestionType.TEXT_INPUT,
    text: 'kitten',
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const FILL_BLANKS_SETTING_2 = {
  id: 'id7',
  item: mockItem,
  ...datesFactory,
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
  item: mockItem,
  ...datesFactory,
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
  item: mockItem,
  ...datesFactory,
  data: {
    questionId: 'id101',
    question: "What is the name of earth's natural satellite",
    type: QuestionType.MULTIPLE_CHOICES,
    choices: [
      { value: 'Moon', isCorrect: true, explanation: 'reason sat 1' },
      { value: 'Jupiter', isCorrect: false, explanation: 'reason sat 2' },
      { value: 'Mars', isCorrect: false, explanation: 'reason sat 3' },
    ],
  },
  name: APP_SETTING_NAMES.QUESTION,
};

export const ATOMIC_NUMBER_HE = {
  id: 'id11',
  item: mockItem,
  ...datesFactory,
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
export const APP_SETTINGS_FEW_QUESTIONS: AppSetting[] = [
  CAPITAL_FRANCE_SETTING,
  HAPPINESS_LEVEL_SETTING,
  BABY_CAT_SETTING,
  FILL_BLANKS_SETTING_2,
  {
    id: 'question-list',
    item: mockItem,
    ...datesFactory,
    data: {
      list: ['id71', 'id51', 'id61', 'id41'],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
  },
];

export const APP_SETTINGS_LOT_QUESTIONS: AppSetting[] = [
  CAPITAL_FRANCE_SETTING,
  HAPPINESS_LEVEL_SETTING,
  BABY_CAT_SETTING,
  FILL_BLANKS_SETTING_2,
  FILL_BLANKS_SETTINGS_3,
  NAME_EARTH_SATELLITE,
  ATOMIC_NUMBER_HE,
  {
    id: 'question-list',
    item: mockItem,
    ...datesFactory,
    data: {
      list: ['id71', 'id51', 'id61', 'id41', 'id91', 'id101', 'id111'],
    },
    name: APP_SETTING_NAMES.QUESTION_LIST,
  },
];
