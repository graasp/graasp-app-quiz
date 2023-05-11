import { IconTestText } from '../utils/IconTestText';
import { HARPER_RESPONSES, LIAM_RESPONSES, MASON_RESPONSES } from './appData';
import {
  BABY_CAT_SETTING,
  CAPITAL_FRANCE_SETTING,
  FILL_BLANKS_SETTING_2,
  HAPPINESS_LEVEL_SETTING,
} from './appSettings';
import { MEMBERS_RESULT_TABLES } from './members';

export const USER_RESPONSES = {
  [MEMBERS_RESULT_TABLES.LIAM.id]: [
    {
      qName: FILL_BLANKS_SETTING_2.data.question,
      fields: {
        answer: LIAM_RESPONSES[2].data.text,
        date: new Date(LIAM_RESPONSES[2].updatedAt).toDateString(),
        icon: IconTestText.WRONG,
      },
    },
    {
      qName: BABY_CAT_SETTING.data.question,
      fields: {
        answer: LIAM_RESPONSES[1].data.text,
        date: new Date(LIAM_RESPONSES[1].updatedAt).toDateString(),
        icon: IconTestText.WRONG,
      },
    },
    {
      qName: CAPITAL_FRANCE_SETTING.data.question,
      fields: {
        answer: LIAM_RESPONSES[0].data.choices[0],
        date: new Date(LIAM_RESPONSES[0].updatedAt).toDateString(),
        icon: IconTestText.CORRECT,
      },
    },
  ],
  [MEMBERS_RESULT_TABLES.HARPER.id]: [
    {
      qName: HAPPINESS_LEVEL_SETTING.data.question,
      fields: {
        answer: HARPER_RESPONSES[0].data.value,
        date: new Date(HARPER_RESPONSES[0].updatedAt).toDateString(),
        icon: IconTestText.WRONG,
      },
    },
    {
      qName: CAPITAL_FRANCE_SETTING.data.question,
      fields: {
        answer: HARPER_RESPONSES[1].data.choices.join(', '),
        date: new Date(HARPER_RESPONSES[1].updatedAt).toDateString(),
        icon: IconTestText.WRONG,
      },
    },
  ],
  [MEMBERS_RESULT_TABLES.MASON.id]: [
    {
      qName: FILL_BLANKS_SETTING_2.data.question,
      fields: {
        answer: MASON_RESPONSES[0].data.text,
        date: new Date(MASON_RESPONSES[0].updatedAt).toDateString(),
        icon: IconTestText.WRONG,
      },
    },
  ],
};
