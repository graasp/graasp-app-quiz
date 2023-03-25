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
export const PLAY_VIEW_EMPTY_QUIZ_CY = 'playViewEmptyquiz';
export const PLAY_VIEW_QUESTION_TITLE_CY = 'playViewQuestionTitle';
export const buildMultipleChoicesButtonCy = (idx, isSelected) =>
  `multipleChoicesButton-${idx}-${isSelected}`;
export const PLAY_VIEW_SUBMIT_BUTTON_CY = 'playViewSubmitButton';
export const PLAY_VIEW_SLIDER_CY = 'playViewSlider';
export const PLAY_VIEW_TEXT_INPUT_CY = 'playViewTextInput';
export const EXPLANATION_CY = 'explanation';
export const EXPLANATION_PLAY_CY = 'explanationPlay';
export const buildFillBlanksAnswerId = (id) => `fillBlanksAnswer-${id}`;
export const buildBlankedTextWordCy = (id) => `fillBlankedTextWord-${id}`;
export const FILL_BLANKS_CORRECTION_CY = 'fillBlanksCorrection';
export const buildFillBlanksCorrectionAnswerCy = (id, correctness) =>
  `fillBlanksCorrectionAnswer-${id}-${correctness}`;
export const FILL_BLANKS_TEXT_FIELD_CY = 'fillBlanksTextField';
export const CREATE_VIEW_CONTAINER_CY = 'createViewContainer';
export const TABLE_BY_QUESTION_CONTAINER_CY = 'tableByQuestionContainer';
export const NAVIGATION_TAB_CONTAINER_CY = 'navigationTabContainer';
export const NAVIGATION_CREATE_QUIZ_BUTTON_CY = 'navigationCreateQuizButton';
export const NAVIGATION_RESULT_BUTTON_CY = 'navigationResultButton';
export const buildTableByQuestionCy = (qId) => `tableByQuestion-${qId}`;
export const buildTableByQuestionTableBodyCy = (qId) =>
  `tableByQuestionTableBody-${qId}`;
export const buildTableByQuestionUserHeader = (qId) =>
  `tableByQuestionUserHeader-${qId}`;
export const buildTableByQuestionAnswerHeader = (qId) =>
  `tableByQuestionAnswerHeader-${qId}`;
export const buildTableByQuestionDateHeader = (qId) =>
  `tableByQuestionDateHeader-${qId}`;
export const buildTableByQuestionCorrectHeader = (qId) =>
  `tableByQuestionCorrectHeader-${qId}`;
