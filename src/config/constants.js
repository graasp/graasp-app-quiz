export const DEFAULT_TEXT = '';
export const DEFAULT_CHOICE = { choice: '', isCorrect: false };
export const DEFAULT_CHOICES = [
  { choice: '', isCorrect: false },
  { choice: '', isCorrect: false },
];
export const APP_SETTING_NAMES = {
  QUESTION: 'question',
  RESPONSE: 'response',
  QUESTION_LIST: 'questionList',
};
export const QUESTION_TYPES = {
  MULTIPLE_CHOICES: 'Multiple_Choices',
  TEXT_INPUT: 'Text_Input',
  SLIDER: 'Slider',
};

export const SLIDER_DEFAULT_MAX_VALUE = 100;
export const SLIDER_DEFAULT_MIN_VALUE = 0;
export const DEFAULT_QUESTION_TYPE = QUESTION_TYPES.MULTIPLE_CHOICES;

export const DEFAULT_QUESTION = {
  name: APP_SETTING_NAMES.QUESTION,
  data: {
    type: QUESTION_TYPES.MULTIPLE_CHOICES,
    choices: [
      { choice: '', isCorrect: true },
      { choice: '', isCorrect: false },
    ],
  },
};

export const VIEWS = {
  BUILDER: 'builder',
  PLAYER: 'player',
};

export const FAILURE_MESSAGES = {
  EMPTY_QUESTION: 'Question title cannot be empty',
  SLIDER_MIN_SMALLER_THAN_MAX:
    'The minimum value should be less than the maximum value',
  MULTIPLE_CHOICES_ANSWER_COUNT: 'You must provide at least 2 possible answers',
  MULTIPLE_CHOICES_CORRECT_ANSWER: 'You must set at least one correct answer',
  MULTIPLE_CHOICES_EMPTY_CHOICE: 'An answer cannot be empty',
  TEXT_INPUT_NOT_EMPTY: 'Answer cannot be empty',
};
