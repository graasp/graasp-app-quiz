export const APP_SETTING_NAMES = {
  QUESTION: 'question',
  QUESTION_LIST: 'questionList',
};

export const APP_DATA_TYPES = {
  RESPONSE: 'response',
};

export const QUESTION_TYPES = {
  MULTIPLE_CHOICES: 'multipleChoices',
  TEXT_INPUT: 'textInput',
  SLIDER: 'slider',
  FILL_IN_THE_BLANKS: 'fillInTheBlanks',
};

export const QUESTION_TYPES_TO_NAME = {
  [QUESTION_TYPES.MULTIPLE_CHOICES]: 'Multiple Choices',
  [QUESTION_TYPES.TEXT_INPUT]: 'Text Input',
  [QUESTION_TYPES.SLIDER]: 'Slider',
  [QUESTION_TYPES.FILL_IN_THE_BLANKS]: 'Fill In The Blanks',
};

export const DEFAULT_CHOICE = { value: '', isCorrect: false };

export const SLIDER_DEFAULT_MAX_VALUE = 100;
export const SLIDER_DEFAULT_MIN_VALUE = 0;

export const DEFAULT_QUESTION_VALUES = {
  [QUESTION_TYPES.MULTIPLE_CHOICES]: {
    type: QUESTION_TYPES.MULTIPLE_CHOICES,
    choices: [
      { value: '', isCorrect: true },
      { value: '', isCorrect: false },
    ],
  },
  [QUESTION_TYPES.SLIDER]: {
    type: QUESTION_TYPES.SLIDER,
    min: SLIDER_DEFAULT_MIN_VALUE,
    max: SLIDER_DEFAULT_MAX_VALUE,
    value: (SLIDER_DEFAULT_MAX_VALUE - SLIDER_DEFAULT_MIN_VALUE) / 2,
  },
  [QUESTION_TYPES.TEXT_INPUT]: {
    type: QUESTION_TYPES.TEXT_INPUT,
    text: '',
  },
};

export const DEFAULT_QUESTION_TYPE = QUESTION_TYPES.MULTIPLE_CHOICES;

export const DEFAULT_QUESTION = {
  name: APP_SETTING_NAMES.QUESTION,
  data: DEFAULT_QUESTION_VALUES[DEFAULT_QUESTION_TYPE],
};

export const FAILURE_MESSAGES = {
  EMPTY_QUESTION: 'EMPTY_QUESTION',
  SLIDER_MIN_SMALLER_THAN_MAX: 'SLIDER_MIN_SMALLER_THAN_MAX',
  SLIDER_UNDEFINED_MIN_MAX: 'SLIDER_UNDEFINED_MIN_MAX',
  MULTIPLE_CHOICES_ANSWER_COUNT: 'MULTIPLE_CHOICES_ANSWER_COUNT',
  MULTIPLE_CHOICES_CORRECT_ANSWER: 'MULTIPLE_CHOICES_CORRECT_ANSWER',
  MULTIPLE_CHOICES_EMPTY_CHOICE: 'MULTIPLE_CHOICES_EMPTY_CHOICE',
  TEXT_INPUT_NOT_EMPTY: 'TEXT_INPUT_NOT_EMPTY',
};

// todo: use from graasp constants
export const PERMISSION_LEVELS = {
  WRITE: 'write',
  READ: 'read',
  ADMIN: 'admin',
};

export const DEFAULT_LANG = 'en';

export const ENABLE_MOCK_API = process.env.REACT_APP_ENABLE_MOCK_API === 'true';
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const REACT_APP_GRAASP_APP_ID = process.env.REACT_APP_GRAASP_APP_ID;

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
};
