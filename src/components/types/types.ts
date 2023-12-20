import { MutableRefObject } from 'react';

import { AppData, AppSetting } from '@graasp/sdk';

import { QuestionType } from '../../config/constants';
import { PlotDatum } from 'plotly.js-basic-dist-min';

export type AppDataData = {
  questionId: string;
};
export type AppDataQuestion = AppData & { data: AppDataData };

export type MultipleChoiceAppDataData = AppDataData & {
  choices: string[];
};

export type TextAppDataData = AppDataData & {
  text: string;
};

export type FillTheBlanksAppDataData = AppDataData & {
  text: string;
};

export type SliderAppDataData = AppDataData & {
  value: number;
};

export type AppSettingData = {
  type: string;
  question: string;
  questionId: string;
  explanation?: string;
  numberOfAttempts?: number;
};

export type MultipleChoicesChoice = {
  value: string;
  isCorrect: boolean;
  explanation?: string;
};
export type MultipleChoicesAppSettingData = AppSettingData & {
  type: QuestionType.MULTIPLE_CHOICES;
  choices: MultipleChoicesChoice[];
};

export type SliderAppSettingData = AppSettingData & {
  type: QuestionType.SLIDER;
  value: number;
  min: number;
  max: number;
};
export type TextAppSettingData = AppSettingData & {
  type: QuestionType.TEXT_INPUT;
  text: string;
};
export type FillTheBlanksAppSettingData = AppSettingData & {
  type: QuestionType.FILL_BLANKS;
  text: string;
};

export type QuestionData =
  | MultipleChoicesAppSettingData
  | SliderAppSettingData
  | TextAppSettingData
  | FillTheBlanksAppSettingData;

export type QuestionListType = AppSetting & {
  data: {
    list: string[];
  };
};

export type QuestionDataAppSetting = AppSetting & {
  data: QuestionData;
};

export type CurrentQuestion = Pick<AppSetting, 'id'> & { data: QuestionData };

export type ChartData = {
  data: {
    x: string[];
    y: number[];
  };
  percentage: number[];
  maxValue: number;
  hoverText: string[];
  barColors: string[];
};

export type CommonChart = {
  type: 'chart';
};

export type DetailedChart = {
  type: QuestionType.FILL_BLANKS;
  chartIndex: number;
};

export type Chart = {
  label: string;
  id: string;
  link: string;
  chartType: symbol;
} & (CommonChart | DetailedChart);

interface ChartPoint<T> extends PlotDatum {
  meta?: T;
}

export interface ChartEvent<T> {
  points: ChartPoint<T>[];
}

export type AllOfExcept<T, K extends keyof T> = Omit<T, K>;

export type RefsObject<T> = { [key: string]: T };
export type MultipleRefs<T> = MutableRefObject<RefsObject<T>>;

export type QuestionAppData<T extends QuestionData> = Omit<
  T,
  keyof AppSettingData
>;
export type QuestionAppDataData = MultipleChoiceAppDataData | FillTheBlanksAppDataData | SliderAppDataData;