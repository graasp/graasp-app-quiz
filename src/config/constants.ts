import { convertJs } from '@graasp/sdk';

export const APP_SETTING_NAMES = {
  QUESTION: 'question',
  QUESTION_LIST: 'questionList',
};

export const APP_DATA_TYPES = {
  RESPONSE: 'response',
};

export enum QuestionType {
  MULTIPLE_CHOICES = 'multipleChoices',
  TEXT_INPUT = 'textInput',
  SLIDER = 'slider',
  FILL_BLANKS = 'fillBlanks',
}

export const QuestionType_TO_NAME = {
  [QuestionType.MULTIPLE_CHOICES]: 'Multiple Choices',
  [QuestionType.TEXT_INPUT]: 'Text Input',
  [QuestionType.SLIDER]: 'Slider',
  [QuestionType.FILL_BLANKS]: 'Fill In The Blanks',
};

export const DEFAULT_CHOICE = convertJs({ value: '', isCorrect: false });

export const SLIDER_DEFAULT_MAX_VALUE = 100;
export const SLIDER_DEFAULT_MIN_VALUE = 0;

export const DEFAULT_QUESTION_VALUES = {
  [QuestionType.MULTIPLE_CHOICES]: convertJs({
    question: '',
    explanation: '',
    type: QuestionType.MULTIPLE_CHOICES,
    choices: [
      { value: '', isCorrect: true },
      { value: '', isCorrect: false },
    ],
  }),
  [QuestionType.SLIDER]: convertJs({
    question: '',
    explanation: '',
    type: QuestionType.SLIDER,
    min: SLIDER_DEFAULT_MIN_VALUE,
    max: SLIDER_DEFAULT_MAX_VALUE,
    value: (SLIDER_DEFAULT_MAX_VALUE - SLIDER_DEFAULT_MIN_VALUE) / 2,
  }),
  [QuestionType.TEXT_INPUT]: convertJs({
    question: '',
    explanation: '',
    type: QuestionType.TEXT_INPUT,
    text: '',
  }),
  [QuestionType.FILL_BLANKS]: convertJs({
    question: '',
    explanation: '',
    type: QuestionType.FILL_BLANKS,
    text: '',
  }),
};

export const DEFAULT_APP_DATA_VALUES = {
  [QuestionType.MULTIPLE_CHOICES]: {
    choices: [],
  },
  [QuestionType.SLIDER]: {
    value: null,
  },
  [QuestionType.TEXT_INPUT]: {
    text: null,
  },
  [QuestionType.FILL_BLANKS]: {
    text: null,
  },
};

export const DEFAULT_QUESTION_TYPE = QuestionType.MULTIPLE_CHOICES;

export const DEFAULT_QUESTION = convertJs({
  name: APP_SETTING_NAMES.QUESTION,
  data: DEFAULT_QUESTION_VALUES[DEFAULT_QUESTION_TYPE].toJS(),
});

export const FAILURE_MESSAGES = {
  EMPTY_QUESTION: 'EMPTY_QUESTION',
  SLIDER_MIN_SMALLER_THAN_MAX: 'SLIDER_MIN_SMALLER_THAN_MAX',
  SLIDER_UNDEFINED_MIN_MAX: 'SLIDER_UNDEFINED_MIN_MAX',
  MULTIPLE_CHOICES_ANSWER_COUNT: 'MULTIPLE_CHOICES_ANSWER_COUNT',
  MULTIPLE_CHOICES_CORRECT_ANSWER: 'MULTIPLE_CHOICES_CORRECT_ANSWER',
  MULTIPLE_CHOICES_EMPTY_CHOICE: 'MULTIPLE_CHOICES_EMPTY_CHOICE',
  TEXT_INPUT_NOT_EMPTY: 'TEXT_INPUT_NOT_EMPTY',
  FILL_BLANKS_EMPTY_TEXT: 'FILL_BLANKS_EMPTY_TEXT',
  FILL_BLANKS_UNMATCHING_TAGS: 'FILL_BLANKS_UNMATCHING_TAGS',
};

export const DEFAULT_LANG = 'en';

export const ENABLE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const REACT_APP_GRAASP_APP_KEY = process.env.REACT_APP_GRAASP_APP_KEY;

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};

export const FILL_BLANKS_TYPE = {
  WORD: 'word',
  BLANK: 'blank',
};

export const FILL_BLANKS_PLACEHOLDER_TEXT =
  'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. Phasellus aliquam, arcu vel <hendrerit> hendrerit, dui nulla <vulputate> sem, ut porta justo ipsum commodo dui. ';

export const AUTO_SCROLLABLE_HOVER_COLOR = '#878383';

export const CHART_SECONDARY_COLOR = '#d95557';
