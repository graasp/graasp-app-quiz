import { List } from 'immutable';

import { convertJs } from '@graasp/sdk';
import { AppDataRecord, AppSettingRecord } from '@graasp/sdk/frontend';

import {v4 as uuidv4} from 'uuid';

import {
  DEFAULT_APP_DATA_VALUES,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../config/constants';
import {
  AppDataDataRecord,
  AppDataQuestionRecord,
  FillTheBlanksAppDataDataRecord,
  MultipleChoiceAppDataDataRecord,
  QuestionDataAppSettingRecord,
  QuestionDataRecord,
  SliderAppDataDataRecord,
  TextAppDataDataRecord,
} from '../types/types';

export const generateId = (): string => {
  return uuidv4();
}

export const getQuestionById = (
  data: List<QuestionDataAppSettingRecord>,
  id: string
) => {
  return data.find((d) => d.data.questionId === id);
};

export const getSettingsByName = (
  data: List<AppSettingRecord> = List(),
  name: string
) => {
  return data?.filter((d) => d.name === name);
};

export const isDifferent = (obj1: object, obj2: object): boolean => {
  return JSON.stringify(obj1) !== JSON.stringify(obj2);
};

export const computeCorrectness = (
  question: QuestionDataRecord,
  data?: AppDataDataRecord
) => {
  switch (question?.type) {
    // cannot use switch because we need to check both types
    case QuestionType.SLIDER: {
      const d = data as SliderAppDataDataRecord;
      return d?.value === question.value;
    }

    case QuestionType.MULTIPLE_CHOICES: {
      const d = data as MultipleChoiceAppDataDataRecord;
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
      const d = data as TextAppDataDataRecord;
      return (
        d?.text?.toLowerCase().trim() === question.text.toLowerCase().trim()
      );
    }

    case QuestionType.FILL_BLANKS: {
      const d = data as FillTheBlanksAppDataDataRecord;
      return d?.text === question.text;
    }
    default:
      return false;
  }
};

export const getAppDataByQuestionId = (
  appData: List<AppDataQuestionRecord> = List(),
  question: QuestionDataAppSettingRecord
) => {
  const qId = question.id;
  return (
    appData?.find(({ data }) => data?.questionId === qId) ??
    convertJs({
      data: {
        questionId: qId,
        ...DEFAULT_APP_DATA_VALUES[question.data.type],
      },
    })
  );
};

export const getQuestionNameFromId = (
  appSettings: List<AppSettingRecord>,
  qId: string
) => {
  return (
    appSettings?.find((setting) => setting.id === qId)?.data?.question ?? ''
  );
};

export const getAllAppDataByQuestionId = (
  appData: List<AppDataRecord>,
  qId: string
) => {
  return appData?.filter(({ data }) => data?.questionId === qId) ?? [];
};

export const getAllAppDataByUserId = (
  appData: List<AppDataRecord>,
  uId: string
) => {
  return appData?.filter((entry) => entry.member.id === uId) ?? [];
};

export const areTagsMatching = (text: string) => {
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

export const validateQuestionData = (data: QuestionDataRecord) => {
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
      if (data?.choices?.size < 2) {
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
