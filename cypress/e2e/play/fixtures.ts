import { AppSetting } from '@graasp/sdk';

import { QuestionDataAppSetting } from '../../../src/components/types/types';
import { APP_SETTING_NAMES, QuestionType } from '../../../src/config/constants';
import { datesFactory } from '../../../src/data/factories';
import { mockItem } from '../../../src/data/items';

export const FILL_BLANKS_SETTING_WITH_DUPLICATED: QuestionDataAppSetting = {
  id: 'fill-blanks-id',
  name: APP_SETTING_NAMES.QUESTION,
  item: mockItem,
  ...datesFactory,
  data: {
    type: QuestionType.FILL_BLANKS,
    questionId: 'fill-blanks-id1',
    question: 'My fill in the blanks question',
    text: 'Lorem <something> dolor sit amet, consectetur adipiscing elit. <something> ut fermentum nulla, sed <suscipit> sem.',
    explanation: 'my explanation for fill in the blanks',
    hints: 'my hints for fill in the blanks',
  },
};

export const APP_SETTINGS_FILL_THE_BLANKS_WITH_DUPLICATED: AppSetting[] = [
  FILL_BLANKS_SETTING_WITH_DUPLICATED,
  {
    id: 'order-list-id',
    name: APP_SETTING_NAMES.QUESTION_LIST,
    item: mockItem,
    ...datesFactory,
    data: {
      list: [FILL_BLANKS_SETTING_WITH_DUPLICATED.data.questionId],
    },
  },
];
