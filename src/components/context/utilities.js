import { QUESTION_TYPES } from '../../config/constants';

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
          ? data.choices.contains(choice)
          : !data.choices.contains(choice)
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
