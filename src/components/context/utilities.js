import { FAILURE_MESSAGES, QUESTION_TYPES } from '../../config/constants';

export const getDataWithId = (data, id) => {
  return data?.filter((d) => d.id === id)?.first();
};

export const getSettingsByName = (data, name) => {
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

      return correctData.choices.every(({ value, isCorrect }) =>
        isCorrect ? data.choices.includes(value) : !data.choices.includes(value)
      );
    }
    case QUESTION_TYPES.TEXT_INPUT: {
      // allow empty correct response
      if (!correctData.text) {
        return true;
      }
      return (
        data?.text?.toLowerCase().trim() ===
        correctData.text.toLowerCase().trim()
      );
    }
    case QUESTION_TYPES.FILL_BLANKS: {
      return data?.text === correctData.text;
    }
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

export const getAllAppDataByQuestionId = (appData, qId) => {
  return appData?.filter(({ data }) => data?.questionId === qId) ?? [];
};

export const areTagsMatching = (text) => {
  let acc = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '<') {
      acc += 1;
    } else if (text[i] === '>') {
      acc -= 1;
    }

    if (acc < 0 || acc > 1) {
      return false;
    }
  }

  return acc === 0;
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
      if (data?.choices?.some(({ value }) => !value)) {
        throw FAILURE_MESSAGES.MULTIPLE_CHOICES_EMPTY_CHOICE;
      }

      break;
    case QUESTION_TYPES.FILL_BLANKS:
      if (!data?.text?.length) {
        throw FAILURE_MESSAGES.FILL_BLANKS_EMPTY_TEXT;
      }
      // matching tags
      if (!areTagsMatching(data.text)) {
        throw FAILURE_MESSAGES.FILL_BLANKS_UNMATCHING_TAGS;
      }

      break;
    // enable following lines to prevent empty correct answer
    // case QUESTION_TYPES.TEXT_INPUT:
    //   if (!data?.text?.length) {
    //     throw FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY;
    //   }
    //   break;
    default:
      return true;
  }
};
