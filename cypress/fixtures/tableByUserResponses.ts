import { IconTestText } from '../utils/IconTestText';
import { HARPER_RESPONSES, LIAM_RESPONSES, MASON_RESPONSES } from './appData';
import {
  BABY_CAT_SETTING,
  CAPITAL_FRANCE_SETTING,
  FILL_BLANKS_SETTING_2,
  HAPPINESS_LEVEL_SETTING,
} from './appSettings';
import { HARPER, LIAM, MASON } from './members';

const toDateString = (date: string) => new Date(date).toDateString();

export const USER_RESPONSES = {
  [LIAM.id]: [
    {
      qName: FILL_BLANKS_SETTING_2.data.question,
      fields: {
        answer: LIAM_RESPONSES[2].data.text,
        date: toDateString(LIAM_RESPONSES[2].updatedAt),
        icon: IconTestText.CORRECT,
      },
    },
    {
      qName: BABY_CAT_SETTING.data.question,
      fields: {
        answer: LIAM_RESPONSES[1].data.text,
        date: toDateString(LIAM_RESPONSES[1].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
    {
      qName: CAPITAL_FRANCE_SETTING.data.question,
      fields: {
        answer: LIAM_RESPONSES[0].data.choices[0],
        date: toDateString(LIAM_RESPONSES[0].updatedAt),
        icon: IconTestText.CORRECT,
      },
    },
  ],
  [HARPER.id]: [
    {
      qName: HAPPINESS_LEVEL_SETTING.data.question,
      fields: {
        answer: HARPER_RESPONSES[0].data.value,
        date: toDateString(HARPER_RESPONSES[0].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
    {
      qName: CAPITAL_FRANCE_SETTING.data.question,
      fields: {
        answer: HARPER_RESPONSES[1].data.choices.join(', '),
        date: toDateString(HARPER_RESPONSES[1].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
  ],
  [MASON.id]: [
    {
      qName: FILL_BLANKS_SETTING_2.data.question,
      fields: {
        answer: MASON_RESPONSES[0].data.text,
        date: toDateString(MASON_RESPONSES[0].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
  ],
};
