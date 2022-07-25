import { FAILURE_MESSAGES, QUESTION_TYPES } from '../../config/constants';

export const getDataWithId = (data, id) => {
  return data?.filter((d) => d.id === id)?.first();
};

export const getSettingByName = (data, name) => {
  return data?.filter((d) => d.name === name);
};

export const isDifferent = (obj1, obj2) => {
  return JSON.stringify(obj1) !== JSON.stringify(obj2);
};

export const computeCorrectness = (data, correctData) => {
  switch (correctData.type) {
    case QUESTION_TYPES.SLIDER:
      return data?.value === correctData.value;
    case QUESTION_TYPES.MULTIPLE_CHOICES: {
      if (!data?.choices) {
        return false;
      }

      return correctData.choices.every(({ choice, isCorrect }) =>
        isCorrect
          ? data.choices.includes(choice)
          : !data.choices.includes(choice)
      );
    }
    case QUESTION_TYPES.TEXT_INPUT:
      return data?.text?.toLowerCase() === correctData.text.toLowerCase();
    default:
      return false;
  }
};

export const getAppDataByQuestionId = (appData, qId) => {
  return (
    appData?.find(({ data }) => data?.questionId === qId) ?? {
      data: {
        questionId: qId,
      },
    }
  );
};

export const validateQuestionData = (data) => {
  if (!data?.question) {
    throw FAILURE_MESSAGES.EMPTY_QUESTION;
  }

  switch (data.type) {
    case QUESTION_TYPES.SLIDER:
      if (!Number.isInteger(data?.min) || !Number.isInteger(data?.max)) {
        throw FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX;
      }
      if (data?.min >= data?.max) {
        throw FAILURE_MESSAGES.SLIDER_MIN_SMALLER_THAN_MAX;
      }
      break;
    case QUESTION_TYPES.MULTIPLE_CHOICES:
      if (data?.choices?.length < 2) {
        throw FAILURE_MESSAGES.MULTIPLE_CHOICES_ANSWER_COUNT;
      }
      if (!data?.choices?.some(({ isCorrect }) => isCorrect)) {
        throw FAILURE_MESSAGES.MULTIPLE_CHOICES_CORRECT_ANSWER;
      }
      if (data?.choices?.some(({ choice }) => !choice)) {
        throw FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE;
      }

      break;
    case QUESTION_TYPES.TEXT_INPUT:
      if (!data?.text?.length) {
        throw FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY;
      }
      break;
    default:
      return true;
  }
};
