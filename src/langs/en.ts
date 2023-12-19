import { FAILURE_MESSAGES } from '../config/constants';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  translations: {
    'Answer Type': 'Answer Type',
    'Multiple Choices': 'Multiple Choices',
    'Text Input': 'Text Input',
    Slider: 'Slider',
    Question: 'Question',
    'Enter Question': 'Enter Question',
    Previous: 'Previous',
    Delete: 'Delete',
    Save: 'Save',
    Prev: 'Prev',
    Next: 'Next',
    Submit: 'Submit',
    'Type your answer': 'Type your answer',
    'Correct Answer': 'Correct Answer: {{answer}}',
    Answer: 'Answer',
    'Answer nb': 'Answer: {{nb}}',
    'Add new question': 'Add new question',
    Answers: 'Answers',
    'Add Answer': 'Add Answer',
    Maximum: 'Maximum',
    Minimum: 'Minimum',
    'Slide the cursor to the correct value':
      'Slide the cursor to the correct value',
    'Add a new question': 'Add a new question',
    [FAILURE_MESSAGES.EMPTY_QUESTION]: 'Question title cannot be empty',
    [FAILURE_MESSAGES.SLIDER_MIN_SMALLER_THAN_MAX]:
      'The minimum value should be less than the maximum value',
    [FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX]:
      'Minimum and maximum values should be defined',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_ANSWER_COUNT]:
      'You must provide at least 2 possible answers',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER]:
      'You must set at least one correct answer',
    [FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE]:
      'An answer cannot be empty',
    [FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY]: 'Answer cannot be empty',
    [FAILURE_MESSAGES.FILL_BLANKS_EMPTY_TEXT]: 'The text cannot be empty',
    [FAILURE_MESSAGES.FILL_BLANKS_UNMATCHING_TAGS]:
      'The text has unmatching "<" and ">"',
    'Create Quiz': 'Create Quiz',
    Results: 'Results',
    User: 'User',
    Date: 'Date',
    Correct: 'Correct',
    'Not yet answered': 'Not yet answered',
    'sorted descending': 'sorted descending',
    'sorted ascending': 'sorted ascending',
    "There isn't any question to display":
      "There isn't any question to display",
    'Results by question': 'Results by question',
    'Results by user': 'Results by user',
    'No users answered the quiz yet': 'No users answered the quiz yet',
    Analytics: 'Analytics',
    'Quiz performance': 'Quiz performance',
    'Users performance': 'Users performance',
    'Quiz correct response percentage': 'Quiz correct response percentage',
    'Correct responses': 'Correct responses',
    'Incorrect responses': 'Incorrect responses',
    'Number of correct/incorrect responses per question':
      'Number of correct/incorrect responses per question',
    'Number of correct responses': 'Number of correct responses',
    'Percentage correct responses': 'Percentage correct responses',
    'Number of incorrect responses': 'Number of incorrect responses',
    'Percentage incorrect responses': 'Percentage incorrect responses',
    'Number of correct responses per user':
      'Number of correct responses per user',
    General: 'General',
    'Question answer frequency': 'Question answer frequency',
    'Answers distribution': 'Answers distribution',
    'Number of answers': 'Number of answers',
    'Number of time selected': 'Number of time selected',
    'Percentage number of time selected': 'Percentage number of time selected',
    'Error, question type unknown': 'Error, question type unknown',
    'Error, chart type unknown': 'Error, chart type unknown',
    blank: 'blank',
  },
};