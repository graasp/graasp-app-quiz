import { v4 as uuidv4 } from 'uuid';

import { AppData, AppSetting, Member } from '@graasp/sdk';

import {
  APP_SETTING_NAMES,
  AppSettingName,
  DEFAULT_APP_DATA_VALUES,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../config/constants';
import {
  AppDataQuestion,
  FillTheBlanksAppDataData,
  MultipleChoiceAppDataData,
  QuestionAppDataData,
  QuestionData,
  QuestionDataAppSetting,
  QuestionListType,
  SliderAppDataData,
  TextAppDataData,
} from '../types/types';

export const generateId = (): string => {
  return uuidv4();
};

export const getQuestionById = (data: QuestionDataAppSetting[], id: string) => {
  return data.find((d) => d.data.questionId === id);
};

// Define specific setting type depending on the app setting name.
type SettingReturnTypeMap = {
  [key in AppSettingName]: key extends typeof APP_SETTING_NAMES.QUESTION
    ? QuestionDataAppSetting[]
    : key extends typeof APP_SETTING_NAMES.QUESTION_LIST
    ? QuestionListType[]
    : AppSetting[];
};

// Define the return type a specific if exists, else return generic appSetting.
export type GettingSettingsReturnType<T extends AppSettingName> =
  T extends keyof SettingReturnTypeMap ? SettingReturnTypeMap[T] : AppSetting[];

export const getSettingsByName = <T extends AppSettingName>(
  settings: AppSetting[] = [],
  name: T
): GettingSettingsReturnType<T> => {
  return settings?.filter(
    (d) => d.name === name
  ) as GettingSettingsReturnType<T>;
};

export const isDifferent = (obj1: object, obj2: object): boolean => {
  return JSON.stringify(obj1) !== JSON.stringify(obj2);
};

export const computeCorrectness = (
  question: QuestionData,
  data?: QuestionAppDataData
) => {
  switch (question?.type) {
    // cannot use switch because we need to check both types
    case QuestionType.SLIDER: {
      const d = data as SliderAppDataData | undefined;
      return d?.value === question.value;
    }

    case QuestionType.MULTIPLE_CHOICES: {
      const d = data as MultipleChoiceAppDataData | undefined;
      if (!d?.choices) {
        return false;
      }
      return question.choices.every(({ value, isCorrect }) =>
        isCorrect ? d.choices.includes(value) : !d.choices.includes(value)
      );
    }

    case QuestionType.TEXT_INPUT: {
      // allow empty correct response
      if (!question.text) {
        return true;
      }
      const d = data as TextAppDataData | undefined;
      return (
        d?.text?.toLowerCase().trim() === question.text.toLowerCase().trim()
      );
    }

    case QuestionType.FILL_BLANKS: {
      const d = data as FillTheBlanksAppDataData;
      return d?.text === question.text;
    }
    default:
      return false;
  }
};

export const getAppDataByQuestionIdForMemberId = (
  appData?: AppDataQuestion[],
  question?: QuestionDataAppSetting, // TODO: question can be null ?
  memberId?: Member['id']
): Partial<AppData> | undefined => {
  if (!question) {
    return undefined;
  }

  const qId = question.data.questionId;

  // TODO: check for a more elegant way to do that
  // The default value is used to display the question
  // to the user when it hasn't answered yet...
  const defaultValue = {
    data: {
      questionId: qId,
      ...DEFAULT_APP_DATA_VALUES[question.data.type],
    },
  };

  if (!memberId) {
    return defaultValue;
  }

  return (
    appData?.find(
      ({ data, creator }) =>
        data?.questionId === qId && creator?.id === memberId
    ) ?? defaultValue
  );
};

export const getQuestionNameFromId = (
  appSettings: QuestionDataAppSetting[],
  qId: string
) => {
  return (
    appSettings?.find((setting) => setting.data.questionId === qId)?.data
      .question ?? ''
  );
};

export const getAllAppDataByQuestionId = (
  appData: AppData[] | undefined,
  qId: string
) => {
  return appData?.filter(({ data }) => data?.questionId === qId) ?? [];
};

export const getAllAppDataByUserId = (
  appData: AppData[] | undefined,
  uId: string
) => {
  return appData?.filter((entry) => entry.member.id === uId) ?? [];
};

export const areTagsMatching = (text: string) => {
  let acc = 0;
  for (const element of text) {
    if (element === '<') {
      acc += 1;
    } else if (element === '>') {
      acc -= 1;
    }

    if (acc < 0 || acc > 1) {
      return false;
    }
  }

  return acc === 0;
};

export const validateQuestionData = (data: QuestionData) => {
  if (!data?.question) {
    throw FAILURE_MESSAGES.EMPTY_QUESTION;
  }

  switch (data.type) {
    case QuestionType.SLIDER:
      if (!Number.isInteger(data?.min) || !Number.isInteger(data?.max)) {
        throw FAILURE_MESSAGES.SLIDER_UNDEFINED_MIN_MAX;
      }
      if (data?.min >= data?.max) {
        throw FAILURE_MESSAGES.SLIDER_MIN_SMALLER_THAN_MAX;
      }
      break;
    case QuestionType.MULTIPLE_CHOICES:
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
    case QuestionType.FILL_BLANKS:
      if (!data?.text?.length) {
        throw FAILURE_MESSAGES.FILL_BLANKS_EMPTY_TEXT;
      }
      // matching tags
      if (!areTagsMatching(data.text)) {
        throw FAILURE_MESSAGES.FILL_BLANKS_UNMATCHING_TAGS;
      }

      break;
    // enable following lines to prevent empty correct answer
    // case QuestionType.TEXT_INPUT:
    //   if (!data?.text?.length) {
    //     throw FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY;
    //   }
    //   break;
    default:
      return true;
  }
};
