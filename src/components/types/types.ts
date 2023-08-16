import { AppData, AppSetting } from '@graasp/sdk';
import { ImmutableCast } from '@graasp/sdk/frontend';

import { QuestionType } from '../../config/constants';

export type AppDataData = {
  questionId: string;
};
export type AppDataQuestionRecord = ImmutableCast<
  AppData & { data: AppDataData }
>;

export type MultipleChoiceAppDataData = AppDataData & {
  choices: string[];
};
export type MultipleChoiceAppDataDataRecord =
  ImmutableCast<MultipleChoiceAppDataData>;

export type TextAppDataData = AppDataData & {
  text: string;
};

export type TextAppDataDataRecord = ImmutableCast<TextAppDataData>;

export type FillTheBlanksAppDataData = AppDataData & {
  text: string;
};

export type FillTheBlanksAppDataDataRecord =
  ImmutableCast<FillTheBlanksAppDataData>;

export type SliderAppDataData = AppDataData & {
  value: number;
};

export type SliderAppDataDataRecord = ImmutableCast<SliderAppDataData>;

export type AppDataDataRecord = ImmutableCast<
  | MultipleChoiceAppDataData
  | TextAppDataData
  | FillTheBlanksAppDataData
  | SliderAppDataData
>;

export type AppSettingData = {
  questionId: string,
  type: string;
  question: string;
  explanation?: string;
};
export type AppSettingDataRecord = ImmutableCast<AppSettingData>;

export type MultipleChoicesAppSettingData = AppSettingData & {
  type: QuestionType.MULTIPLE_CHOICES;
  choices: { value: string; isCorrect: boolean }[];
};
export type MultipleChoicesAppSettingDataRecord =
  ImmutableCast<MultipleChoicesAppSettingData>;

export type SliderAppSettingData = AppSettingData & {
  type: QuestionType.SLIDER;
  value: number;
  min: number;
  max: number;
};
export type SliderAppSettingDataRecord = ImmutableCast<SliderAppSettingData>;
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

export type QuestionDataRecord = ImmutableCast<
  | MultipleChoicesAppSettingData
  | SliderAppSettingData
  | TextAppSettingData
  | FillTheBlanksAppSettingData
>;
// export type QuestionDataRecord =
//   | ImmutableCast<MultipleChoicesAppSettingData>
//   | ImmutableCast<SliderAppSettingData>
//   | ImmutableCast<TextAppSettingData>
//   | ImmutableCast<FillTheBlanksAppSettingData>;

export type QuestionListTypeRecord = ImmutableCast<
  AppSetting & {
    data: {
      list: string[];
    };
  }
>;

export type QuestionDataAppSettingRecord = ImmutableCast<
  AppSetting & {
    data: QuestionData;
  }
>;
