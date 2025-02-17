import { Dictionary, groupBy, mapValues } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { Data } from '@graasp/apps-query-client';
import { AppData, AppSetting, Member } from '@graasp/sdk';

import {
  APP_SETTING_NAMES,
  AppSettingName,
  DEFAULT_APP_DATA_VALUES,
  FAILURE_MESSAGES,
  QuestionType,
} from '../../config/constants';
import { getDuplicatedKeys, hasDuplicatedKeys } from '../../utils/array';
import { ANSWER_REGEXP } from '../../utils/fillInTheBlanks';
import {
  AppDataWithDataId,
  FillTheBlanksAppDataData,
  MultipleChoiceAppDataData,
  QuestionAppDataData,
  QuestionData,
  QuestionDataAppSetting,
  QuestionListType,
  SliderAppDataData,
  TableByUserResponse,
  TextAppDataData,
} from '../types/types';

export const generateId = (): string => uuidv4();

export const getQuestionById = (data: QuestionDataAppSetting[], id: string) =>
  data.find((d) => d.data.questionId === id);

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
): GettingSettingsReturnType<T> =>
  settings?.filter((d) => d.name === name) as GettingSettingsReturnType<T>;

export const isDifferent = (obj1: object, obj2: object): boolean =>
  JSON.stringify(obj1) !== JSON.stringify(obj2);

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

      // comparing the answers instead of text avoid risk to
      // compare the same text with some spaces.
      const dataAnswers = d?.text?.match(ANSWER_REGEXP) || [];
      const questionAnswers = question.text.match(ANSWER_REGEXP) || [];

      return (
        dataAnswers.length === questionAnswers.length &&
        dataAnswers.every((value, idx) => value === questionAnswers[idx])
      );
    }
    default:
      return false;
  }
};

export const getAppDataByQuestionIdForMemberId = <T extends Data>(
  appData: AppData<T>[] | undefined,
  question: QuestionDataAppSetting,
  memberId?: Member['id']
): AppDataWithDataId<T> | AppDataWithDataId<QuestionAppDataData> => {
  const qId = question.data.questionId;

  // The default value is used to display the question
  // to the user when it hasn't answered yet...
  const defaultValue = {
    data: {
      questionId: qId,
      ...DEFAULT_APP_DATA_VALUES[question.data.type],
    } as QuestionAppDataData,
  };

  if (!memberId) {
    return defaultValue;
  }

  const allAppData = getAllAppDataByQuestionIdForMemberId(
    appData,
    question.data.questionId,
    memberId
  );

  return allAppData?.slice(-1)[0] ?? defaultValue;
};

export const getAllAppDataByQuestionIdForMemberId = <T extends Data>(
  appData: AppData<T>[] | undefined,
  questionId: string,
  memberId?: Member['id']
): AppData<T>[] =>
  appData
    ?.filter(
      ({ creator, data }) =>
        creator?.id === memberId && data.questionId === questionId
    )
    // ensure to have an ascending sorts of createdAt
    .sort(sortAppDataByDate) ?? [];

export const sortAppDataByDate = (a: AppData, b: AppData, asc = true) => {
  if (asc) {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

export const getLastDataByGroup = <T extends { createdAt: string }>(
  groupedResponses: Dictionary<T[]>
) =>
  mapValues(
    groupedResponses,
    (group) =>
      // Returning the most recent data from the group
      group.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
  );

export const getLastUsersAttemptByQuestion = (
  responsesGroupedByQId: Dictionary<AppData[]>
) =>
  Object.fromEntries(
    Object.entries(responsesGroupedByQId).map(([questionId, responses]) => {
      const attemptsByUser = groupBy(responses, (r) => r.creator?.id);
      const lastAttemptByUser = getLastDataByGroup(attemptsByUser);
      const questionLastAttempts = Object.values(lastAttemptByUser).map(
        (v) => v
      );
      return [questionId, questionLastAttempts];
    })
  );

export const getQuestionNameFromId = (
  appSettings: QuestionDataAppSetting[],
  qId: string
) =>
  appSettings?.find((setting) => setting.data.questionId === qId)?.data
    .question;

export const getQuestionNames = (
  responses: TableByUserResponse[],
  questions: QuestionDataAppSetting[]
) =>
  responses
    .map((res) => getQuestionNameFromId(questions, res.data.questionId))
    .filter((r): r is string => Boolean(r))
    .reduce<[string, number][]>((result, question) => {
      const index = result.filter((entry) => entry[0] === question).length;
      result.push([question, index]);
      return result;
    }, []);

export const getAllAppDataByQuestionId = (
  appData: AppData[] | undefined,
  qId: string
) => appData?.filter(({ data }) => data?.questionId === qId) ?? [];

export const getAllAppDataByUserId = (
  appData: AppData[] | undefined,
  uId: string
) => appData?.filter((entry) => entry.member.id === uId) ?? [];

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
      if (hasDuplicatedKeys(getDuplicatedKeys(data?.choices, 'value'))) {
        throw FAILURE_MESSAGES.MULTIPLE_CHOICES_DUPLICATED_CHOICE;
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
    case QuestionType.TEXT_INPUT:
      if (!data?.text?.length) {
        throw FAILURE_MESSAGES.TEXT_INPUT_NOT_EMPTY;
      }
      break;
    default:
      return true;
  }
};

/**
 * Return the first valid value in three possible name of values or empty if all nullish
 * @param response The response to get the value.
 * @returns The first valid value of the data.
 */
export const getResponseValue = (response: Data | undefined) => {
  const text = (response as TextAppDataData)?.text;
  if (text) {
    return text;
  }

  const value = (response as SliderAppDataData)?.value;
  if (value) {
    return value;
  }

  const choices = (response as MultipleChoiceAppDataData)?.choices;
  if (choices) {
    return choices.join(', ');
  }

  return '';
};

export const removeDuplicates =
  (tmpQ: AppSetting[]) =>
  ({ id, data, updatedAt }: AppSetting, idx: number) => {
    const duplicate = tmpQ.find(
      (q) => data?.questionId === q.data.questionId && q.id !== id
    );
    if (!duplicate) {
      return true;
    }
    // in case of copy, updatedAt properties are the same for all settings, so we return the furthest in the list, assuming the list is ordered by creation
    if (updatedAt === duplicate.updatedAt) {
      return idx > tmpQ.indexOf(duplicate);
    }
    return updatedAt > duplicate.updatedAt;
  };
