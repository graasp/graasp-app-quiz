export const dataCyWrapper = (selector) => `[data-cy="${selector}"]`;
export const ADD_NEW_QUESTION_TITLE_CY = 'addNewQuestionTitle';
export const CREATE_QUESTION_TITLE_CY = 'createQuestionTitle';
export const CREATE_QUESTION_SELECT_TYPE_CY = 'createQuestionSelectType';
export const QUESTION_BAR_CY = 'questionBar';
export const QUESTION_BAR_NEXT_CY = 'questionBarNext';
export const QUESTION_BAR_PREV_CY = 'questionBarPrev';
export const buildQuestionStepCy = (id) => `questionStep-${id}`;
export const buildMultipleChoiceAnswerCy = (idx) =>
  `multipleChoiceAnswer-${idx}`;
export const MULTIPLE_CHOICES_ANSWER_CORRECTNESS_CLASSNAME =
  'multipleChoicesAnswerCorrectness';
export const buildMultipleChoiceDeleteAnswerButtonCy = (idx) =>
  `multipleChoiceDeleteAnswerButton-${idx}`;
export const CREATE_VIEW_SAVE_BUTTON_CY = 'createViewSaveButton';
export const QUESTION_BAR_ADD_NEW_BUTTON_CLASSNAME = 'questionBarAddNewButton';
export const MULTIPLE_CHOICES_ADD_ANSWER_BUTTON_CY =
  'multipleChoicesAddAnswerButton';
export const CREATE_VIEW_ERROR_ALERT_CY = 'createViewErrorAlert';
export const buildQuestionTypeOption = (id) => `buildQuestionTypeOption-${id}`;
export const TEXT_INPUT_FIELD_CY = 'textInputField';
export const SLIDER_MIN_FIELD_CY = 'sliderMinField';
export const SLIDER_MAX_FIELD_CY = 'sliderMaxField';
export const SLIDER_CY = 'slider';
export const CREATE_VIEW_DELETE_BUTTON_CY = 'createViewDeleteButton';