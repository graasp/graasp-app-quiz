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
export const QUESTION_STEP_CLASSNAME = 'questionStep';
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
export const buildTableByQuestionUserHeaderCy = (qId) =>
  `tableByQuestionUserHeader-${qId}`;
export const buildTableByQuestionAnswerHeaderCy = (qId) =>
  `tableByQuestionAnswerHeader-${qId}`;
export const buildTableByQuestionDateHeaderCy = (qId) =>
  `tableByQuestionDateHeader-${qId}`;
export const buildTableByQuestionCorrectHeaderCy = (qId) =>
  `tableByQuestionCorrectHeader-${qId}`;
export const TABLE_BY_QUESTION_USER_ID_HEADER_CY = 'tableByQuestionUerIdHeader';
export const TABLE_BY_QUESTION_ANSWER_DATA_CY = 'tableByQuestionAnswerData';
export const TABLE_BY_QUESTION_DATE_DATA_CY = 'tableByQuestionDateData';
export const TABLE_BY_QUESTION_CORRECT_ICON_CY = 'tableByQuestionCorrectIcon';
export const TABLE_BY_QUESTION_ENTRY_CY = 'tableByQuestionEntry';
export const buildAutoScrollableMenuLinkCy = (label, isHighlighted) =>
  `autoScrollableMenuLink-${label}${isHighlighted ? '-active' : ''}`;
export const AUTO_SCROLLABLE_MENU_LINK_LIST_CY = 'autoScrollableMenuLinkList';
export const RESULT_TABLES_TAB_CONTAINERS_CY = 'resultTablesTabContainers';
export const RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY =
  'resultTablesResultByQuestionButton';
export const RESULT_TABLES_RESULT_BY_USER_BUTTON_CY =
  'resultTablesResultByUserButton';
export const TABLE_BY_USER_CONTAINER_CY = 'tableByUserContainer';
export const buildTableByUserCy = (uId) => `tableByUser-${uId}`;
export const buildTableByUserQuestionHeaderCy = (uId) =>
  `tableByUserQuestionHeader-${uId}`;
export const buildTableByUserAnswerHeaderCy = (uId) =>
  `tableByUserAnswerHeader-${uId}`;
export const buildTableByUserDateHeaderCy = (uId) =>
  `tableByUserDateHeader-${uId}`;
export const buildTableByUserCorrectHeaderCy = (uId) =>
  `tableByUserCorrectHeader-${uId}`;
export const buildTableByUserTableBodyCy = (uId) =>
  `tableByUserTableBody-${uId}`;
export const TABLE_BY_USER_ENTRY_CY = 'tableByUserEntry';
export const TABLE_BY_USER_QUESTION_NAME_HEADER_CY =
  'tableByUserQuestionNameHeader';
export const TABLE_BY_USER_ANSWER_DATA_CY = 'tableByUserAnswerData';
export const TABLE_BY_USER_DATE_DATA_CY = 'tableByUserDateData';
export const TABLE_BY_USER_CORRECT_ICON_CY = 'tableByUserCorrectIcon';
export const NAVIGATION_ANALYTICS_BUTTON_CY = 'navigationAnalyticsButton';
export const ANALYTICS_CONTAINER_CY = 'analyticsContainer';
export const ANALYTICS_GENERAL_TAB_MENU_CY = 'analyticsGeneralTabMenu';
export const buildAnalyticsDetailedQuestionTabMenuCy = (qTitle) =>
  `analyticsDetailedQuestionTabMenu-${qTitle}`;
export const ANALYTICS_GENERAL_QUIZ_PERFORMANCE_CY =
  'analyticsGeneralQuizPerformance';
export const ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY =
  'analyticsGeneralCorrectResponsePerUser';
export const ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY =
  'analyticsGeneralCorrectResponsePercentage';
export const buildAnalyticsDetailedChartCy = (label) =>
  `analyticsDetailedChart-${label}`;
